import { db, usersTable, referralBonusesTable, transactionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

type TxOrDb = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

const MLM_LEVELS = [
  { level: 1, percent: 10 },
  { level: 2, percent: 5 },
  { level: 3, percent: 3 },
  { level: 4, percent: 1 },
  { level: 5, percent: 1 },
];

export async function processReferralBonuses(
  investmentId: number,
  investorId: number,
  amount: number,
  tx: TxOrDb = db,
) {
  let currentUserId: number | null = investorId;

  for (const { level, percent } of MLM_LEVELS) {
    const [user] = await tx
      .select({ referredById: usersTable.referredById })
      .from(usersTable)
      .where(eq(usersTable.id, currentUserId!));

    if (!user?.referredById) break;

    const beneficiaryId = user.referredById;
    const bonusAmount = (amount * percent) / 100;

    await tx.insert(referralBonusesTable).values({
      beneficiaryId,
      fromUserId: investorId,
      investmentId,
      level,
      percent: String(percent),
      amount: String(bonusAmount),
      status: "pending",
    });

    await tx.insert(transactionsTable).values({
      userId: beneficiaryId,
      type: "mlm_bonus",
      amount: String(bonusAmount),
      description: `MLM бонус уровень ${level} (${percent}%) от инвестиции #${investmentId}`,
      status: "completed",
      referenceId: investmentId,
    });

    currentUserId = beneficiaryId;
  }
}

export function generateReferralCode(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${base}${rand}`;
}
