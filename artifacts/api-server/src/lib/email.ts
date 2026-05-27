const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "Trends Investor <noreply@trendspartner.space>";

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Resend error: ${JSON.stringify(err)}`);
  }
}

function card(body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0d0f14;color:#fff;margin:0;padding:40px 20px;">
<div style="max-width:480px;margin:0 auto;background:#151821;border-radius:16px;padding:40px;border:1px solid rgba(255,255,255,0.08);">
<span style="font-size:22px;font-weight:900;">Trends</span>${body}
</div></body></html>`;
}

export interface InvestmentConfirmedParams {
  to: string; name: string; packageName: string; amount: number; txHash: string | null; cabinetUrl: string;
}
export async function sendInvestmentConfirmedEmail(p: InvestmentConfirmedParams) {
  const txRow = p.txHash ? `<tr><td style="color:#8b92a0;padding:8px 0;font-size:13px;">TX Hash</td><td style="font-size:12px;font-family:monospace;word-break:break-all;text-align:right;">${p.txHash}</td></tr>` : "";
  const html = card(`
    <div style="background:linear-gradient(135deg,rgba(0,212,255,0.15),rgba(123,94,255,0.15));border:1px solid rgba(0,212,255,0.25);border-radius:14px;padding:20px;text-align:center;margin:24px 0;">
      <div style="font-size:32px;">✅</div><div style="font-size:20px;font-weight:900;color:#00D4FF;">Инвестиция подтверждена!</div>
    </div>
    <p style="color:#c8cdd6;font-size:15px;line-height:1.6;">Привет, <strong>${p.name}</strong>!<br>Ваша инвестиция в пакет <strong style="color:#00D4FF;">«${p.packageName}»</strong> подтверждена.</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="color:#8b92a0;padding:8px 0;font-size:13px;">Пакет</td><td style="font-weight:700;text-align:right;">${p.packageName}</td></tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="color:#8b92a0;padding:8px 0;font-size:13px;">Сумма</td><td style="font-weight:700;color:#00D4FF;text-align:right;">$${p.amount.toLocaleString("ru-RU")} USDT</td></tr>
      ${txRow}
    </table>
    <a href="${p.cabinetUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#00D4FF,#7B5EFF);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;">Открыть кабинет →</a>`);
  await sendEmail(p.to, `✅ Инвестиция подтверждена — ${p.packageName}`, html);
}

export interface InvestmentRejectedParams {
  to: string; name: string; packageName: string; amount: number; reason?: string | null; cabinetUrl: string;
}
export async function sendInvestmentRejectedEmail(p: InvestmentRejectedParams) {
  const html = card(`
    <div style="background:rgba(255,80,80,0.08);border:1px solid rgba(255,80,80,0.25);border-radius:14px;padding:20px;text-align:center;margin:24px 0;">
      <div style="font-size:32px;">❌</div><div style="font-size:20px;font-weight:900;color:#ff5050;">Инвестиция отклонена</div>
    </div>
    <p style="color:#c8cdd6;font-size:14px;line-height:1.6;">Привет, <strong>${p.name}</strong>!<br>Заявка на пакет <strong style="color:#ff5050;">«${p.packageName}»</strong> отклонена.${p.reason ? `<br>Причина: ${p.reason}` : ""}</p>
    <a href="${p.cabinetUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#00D4FF,#7B5EFF);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;">Открыть кабинет →</a>`);
  await sendEmail(p.to, `❌ Заявка отклонена — ${p.packageName}`, html);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = card(`
    <h1 style="font-size:22px;font-weight:800;margin:24px 0 12px;">Сброс пароля</h1>
    <p style="color:#8b92a0;margin:0 0 28px;line-height:1.6;">Ссылка действует <strong style="color:#fff;">1 час</strong>.</p>
    <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#00D4FF,#7B5EFF);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;">Сбросить пароль</a>
    <p style="color:#555c6a;font-size:12px;margin-top:24px;">Если вы не запрашивали сброс — проигнорируйте это письмо.</p>`);
  await sendEmail(to, "Сброс пароля — Trends Investor", html);
}

export async function sendWalletOtpEmail(to: string, name: string, code: string, newAddress: string, network: string) {
  const html = card(`
    <div style="background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.25);border-radius:14px;padding:24px;text-align:center;margin:24px 0;">
      <div style="font-size:13px;color:#8b92a0;margin-bottom:8px;">Код подтверждения смены кошелька</div>
      <div style="font-size:40px;font-weight:900;color:#00D4FF;letter-spacing:8px;">${code}</div>
      <div style="font-size:11px;color:#8b92a0;margin-top:8px;">Действует 15 минут</div>
    </div>
    <p style="color:#c8cdd6;font-size:14px;line-height:1.6;">Привет, <strong>${name}</strong>!<br>Новый адрес: <code>${newAddress}</code> (${network})</p>
    <p style="color:#ff5050;font-size:12px;background:rgba(255,80,80,0.08);border:1px solid rgba(255,80,80,0.2);border-radius:8px;padding:12px;">Если вы не запрашивали смену кошелька — немедленно смените пароль.</p>`);
  await sendEmail(to, "🔐 Подтверждение смены кошелька — Trends", html);
}

export async function sendTwoFactorCodeEmail(to: string, name: string, code: string) {
  const html = card(`
    <div style="background:rgba(123,94,255,0.1);border:1px solid rgba(123,94,255,0.3);border-radius:14px;padding:24px;text-align:center;margin:24px 0;">
      <div style="font-size:13px;color:#8b92a0;margin-bottom:8px;">Код двухфакторной аутентификации</div>
      <div style="font-size:40px;font-weight:900;color:#7B5EFF;letter-spacing:8px;">${code}</div>
      <div style="font-size:11px;color:#8b92a0;margin-top:8px;">Действует 10 минут</div>
    </div>
    <p style="color:#c8cdd6;font-size:14px;">Привет, <strong>${name}</strong>! Введите этот код для входа.</p>`);
  await sendEmail(to, "🔑 Код входа — Trends Investor", html);
}

export async function sendPasswordChangedEmail(to: string, name: string) {
  const html = card(`
    <h1 style="font-size:20px;font-weight:800;margin:24px 0 12px;">Пароль изменён ✅</h1>
    <p style="color:#c8cdd6;font-size:14px;line-height:1.6;">Привет, <strong>${name}</strong>!<br>Пароль вашего аккаунта успешно изменён. Если это сделали не вы — немедленно свяжитесь с поддержкой.</p>`);
  await sendEmail(to, "🔒 Пароль изменён — Trends Investor", html);
}
