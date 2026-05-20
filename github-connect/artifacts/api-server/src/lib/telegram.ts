const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

async function sendMessage(text: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch {
    /* non-fatal — never crash the server over a notification */
  }
}

export interface NotifyNewInvestmentParams {
  investmentId: number;
  userName: string;
  telegramUsername: string | null;
  packageName: string;
  amount: number;
  walletFrom: string | null;
}

export async function notifyNewInvestment(p: NotifyNewInvestmentParams): Promise<void> {
  const tg = p.telegramUsername ? ` (@${p.telegramUsername})` : "";
  await sendMessage(
    `💰 <b>Новая инвестиция #${p.investmentId}</b>\n` +
    `👤 ${escHtml(p.userName)}${tg}\n` +
    `📦 ${escHtml(p.packageName)} — <b>$${p.amount.toLocaleString()}</b>\n` +
    (p.walletFrom ? `🔑 <code>${escHtml(p.walletFrom)}</code>\n` : "") +
    `\n⏳ Ожидает подтверждения`
  );
}

export interface NotifyConfirmedParams {
  investmentId: number;
  userName: string;
  telegramUsername: string | null;
  packageName: string;
  amount: number;
  txHash: string | null;
}

export async function notifyConfirmed(p: NotifyConfirmedParams): Promise<void> {
  const tg = p.telegramUsername ? ` (@${p.telegramUsername})` : "";
  await sendMessage(
    `✅ <b>Инвестиция #${p.investmentId} подтверждена</b>\n` +
    `👤 ${escHtml(p.userName)}${tg}\n` +
    `📦 ${escHtml(p.packageName)} — <b>$${p.amount.toLocaleString()}</b>\n` +
    (p.txHash ? `🔗 TxHash: <code>${escHtml(p.txHash)}</code>` : "")
  );
}

export interface NotifyRejectedParams {
  investmentId: number;
  userName: string;
  telegramUsername: string | null;
  packageName: string;
  amount: number;
}

export async function notifyRejected(p: NotifyRejectedParams): Promise<void> {
  const tg = p.telegramUsername ? ` (@${p.telegramUsername})` : "";
  await sendMessage(
    `❌ <b>Инвестиция #${p.investmentId} отклонена</b>\n` +
    `👤 ${escHtml(p.userName)}${tg}\n` +
    `📦 ${escHtml(p.packageName)} — <b>$${p.amount.toLocaleString()}</b>`
  );
}

export interface NotifyNewUserParams {
  userId: number;
  name: string;
  email: string;
  telegramUsername: string | null;
  referralCode: string;
  referredByCode: string | null;
}

export async function notifyNewUser(p: NotifyNewUserParams): Promise<void> {
  const tg = p.telegramUsername ? ` (@${escHtml(p.telegramUsername)})` : "";
  const ref = p.referredByCode ? `\n🔗 Реферал от: <code>${escHtml(p.referredByCode)}</code>` : "";
  await sendMessage(
    `🆕 <b>Новый инвестор #${p.userId}</b>\n` +
    `👤 ${escHtml(p.name)}${tg}\n` +
    `📧 ${escHtml(p.email)}\n` +
    `🎟 Реф. код: <code>${escHtml(p.referralCode)}</code>` +
    ref
  );
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
