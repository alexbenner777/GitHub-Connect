import { db, investmentsTable, transactionsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { logger } from "./logger.js";
import { processReferralBonuses } from "./referral.js";
import { notifyConfirmed } from "./telegram.js";
import { sendInvestmentConfirmedEmail } from "./email.js";

const PAYMENT_WALLET = "UQCG4jJ5BHZhV0qAOwYxMNemhgcdtMBJv5cDXs0O5K3LNAgt";
const TONAPI_BASE = "https://tonapi.io/v2";

interface TonApiJettonTransfer {
  amount: string;
  jetton: { address: string; decimals: number };
  sender?: { address: string };
  recipient?: { address: string };
}

interface TonApiAction {
  type: string;
  status: string;
  JettonTransfer?: TonApiJettonTransfer;
}

interface TonApiEvent {
  event_id: string;
  timestamp: number;
  actions: TonApiAction[];
}

async function fetchRecentUSDTTransfers(since: number): Promise<Array<{
  txHash: string;
  amount: number;
  timestamp: number;
  senderAddress: string | null;
}>> {
  const url = `${TONAPI_BASE}/accounts/${PAYMENT_WALLET}/events?limit=50&start_date=${since}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    logger.warn({ status: res.status }, "tonapi.io request failed");
    return [];
  }

  const data = await res.json() as { events?: TonApiEvent[] };
  const results: Array<{ txHash: string; amount: number; timestamp: number; senderAddress: string | null }> = [];

  for (const event of data.events ?? []) {
    for (const action of event.actions) {
      if (action.type !== "JettonTransfer" || action.status !== "ok") continue;
      const jt = action.JettonTransfer!;
      const decimals = jt.jetton?.decimals ?? 6;
      const amount = Number(jt.amount) / Math.pow(10, decimals);

      results.push({
        txHash: event.event_id,
        amount,
        timestamp: event.timestamp,
        senderAddress: jt.sender?.address ?? null,
      });
    }
  }

  return results;
}

async function confirmInvestment(
  inv: { id: number; userId: number; amount: string; packageName: string },
  match: { txHash: string; amount: number },
): Promise<boolean> {
  let confirmed = false;
  await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(investmentsTable)
      .set({ status: "confirmed", txHash: match.txHash, confirmedAt: new Date() })
      .where(and(
        eq(investmentsTable.id, inv.id),
        eq(investmentsTable.status, "pending"),
      ))
      .returning();

    if (!updated) return;
    confirmed = true;

    await tx.insert(transactionsTable).values({
      userId: inv.userId,
      type: "investment",
      amount: inv.amount,
      description: `Инвестиция подтверждена автоматически: ${inv.packageName}`,
      status: "completed",
      referenceId: inv.id,
    });

    const invAmount = parseFloat(inv.amount);
    await processReferralBonuses(inv.id, inv.userId, invAmount, tx);

    const [user] = await db.select({
      name: usersTable.name,
      email: usersTable.email,
      telegramUsername: usersTable.telegramUsername,
    }).from(usersTable).where(eq(usersTable.id, inv.userId));

    notifyConfirmed({
      investmentId: inv.id,
      userName: user?.name ?? `User #${inv.userId}`,
      telegramUsername: user?.telegramUsername ?? null,
      packageName: inv.packageName,
      amount: invAmount,
      txHash: match.txHash,
    });

    if (user?.email) {
      const origin = process.env.RENDER_EXTERNAL_URL
        ?? (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://trendspartner.space");
      sendInvestmentConfirmedEmail({
        to: user.email,
        name: user.name,
        packageName: inv.packageName,
        amount: invAmount,
        txHash: match.txHash,
        cabinetUrl: `${origin}/cabinet`,
      }).catch((err) => logger.warn({ err }, "Failed to send confirmation email"));
    }

    logger.info({ investmentId: inv.id, txHash: match.txHash, amount: invAmount }, "Investment auto-confirmed via TON checker");
  });
  return confirmed;
}

export async function checkSingleInvestment(investmentId: number): Promise<boolean> {
  try {
    const [inv] = await db
      .select({
        id: investmentsTable.id,
        userId: investmentsTable.userId,
        amount: investmentsTable.amount,
        packageName: investmentsTable.packageName,
        walletFrom: investmentsTable.walletFrom,
        txHash: investmentsTable.txHash,
        createdAt: investmentsTable.createdAt,
      })
      .from(investmentsTable)
      .where(and(eq(investmentsTable.id, investmentId), eq(investmentsTable.status, "pending")));

    if (!inv) return false;

    const invCreatedTs = new Date(inv.createdAt).getTime() / 1000;
    const transfers = await fetchRecentUSDTTransfers(Math.floor(invCreatedTs) - 300);
    if (transfers.length === 0) return false;

    const invAmount = parseFloat(inv.amount);

    const match = transfers.find(t => {
      if (inv.txHash && t.txHash !== inv.txHash) return false;
      const amountOk = Math.abs(t.amount - invAmount) < 0.05;
      const timeOk = t.timestamp >= invCreatedTs - 300;
      return amountOk && timeOk;
    });

    if (!match) return false;
    return await confirmInvestment(inv, match);
  } catch (err) {
    logger.error(err, "TON single investment check error");
    return false;
  }
}

export async function checkAndConfirmPayments(): Promise<void> {
  try {
    const pending = await db
      .select({
        id: investmentsTable.id,
        userId: investmentsTable.userId,
        amount: investmentsTable.amount,
        packageName: investmentsTable.packageName,
        walletFrom: investmentsTable.walletFrom,
        txHash: investmentsTable.txHash,
        createdAt: investmentsTable.createdAt,
      })
      .from(investmentsTable)
      .where(eq(investmentsTable.status, "pending"));

    if (pending.length === 0) return;

    const oldestTs = Math.min(...pending.map(i => new Date(i.createdAt).getTime() / 1000));
    const transfers = await fetchRecentUSDTTransfers(Math.floor(oldestTs) - 300);

    if (transfers.length === 0) return;

    for (const inv of pending) {
      const invAmount = parseFloat(inv.amount);
      const invCreatedTs = new Date(inv.createdAt).getTime() / 1000;

      const match = transfers.find(t => {
        if (inv.txHash && t.txHash !== inv.txHash) return false;
        const amountOk = Math.abs(t.amount - invAmount) < 0.05;
        const timeOk = t.timestamp >= invCreatedTs - 300;
        return amountOk && timeOk;
      });

      if (!match) continue;
      await confirmInvestment(inv, match);
    }
  } catch (err) {
    logger.error(err, "TON payment checker error");
  }
}

export function startTonChecker(intervalMs = 2 * 60 * 1000): void {
  void checkAndConfirmPayments();
  setInterval(() => void checkAndConfirmPayments(), intervalMs);
  logger.info({ intervalMs }, "TON payment checker started");
}
