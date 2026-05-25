const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "Trends Investor <noreply@trendspartner.space>";

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Resend error: ${JSON.stringify(err)}`);
  }
}

export interface InvestmentConfirmedParams {
  to: string;
  name: string;
  packageName: string;
  amount: number;
  txHash: string | null;
  cabinetUrl: string;
}

export async function sendInvestmentConfirmedEmail(p: InvestmentConfirmedParams): Promise<void> {
  const txRow = p.txHash
    ? `<tr><td style="color:#8b92a0;padding:6px 0;font-size:13px;">Хэш транзакции</td><td style="font-size:13px;font-family:monospace;word-break:break-all;">${p.txHash}</td></tr>`
    : "";

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0d0f14;color:#fff;margin:0;padding:40px 20px;">
  <div style="max-width:520px;margin:0 auto;background:#151821;border-radius:16px;padding:40px;border:1px solid rgba(255,255,255,0.08);">
    <div style="margin-bottom:28px;">
      <span style="font-size:22px;font-weight:900;color:#fff;">Trends</span>
    </div>

    <div style="background:linear-gradient(135deg,rgba(0,212,255,0.15),rgba(123,94,255,0.15));border:1px solid rgba(0,212,255,0.25);border-radius:14px;padding:20px;text-align:center;margin-bottom:28px;">
      <div style="font-size:32px;margin-bottom:8px;">✅</div>
      <div style="font-size:20px;font-weight:900;color:#00D4FF;">Инвестиция подтверждена!</div>
      <div style="color:#8b92a0;font-size:13px;margin-top:4px;">Транзакция успешно обработана в блокчейне TON</div>
    </div>

    <p style="color:#c8cdd6;font-size:15px;margin:0 0 24px;line-height:1.6;">
      Привет, <strong style="color:#fff;">${p.name}</strong>!<br><br>
      Ваша инвестиция в пакет <strong style="color:#00D4FF;">«${p.packageName}»</strong> успешно подтверждена. Вы уже являетесь участником Trends и будете получать RevShare по мере роста платформы.
    </p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
        <td style="color:#8b92a0;padding:10px 0;font-size:13px;">Пакет</td>
        <td style="font-size:14px;font-weight:700;color:#fff;text-align:right;">${p.packageName}</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
        <td style="color:#8b92a0;padding:10px 0;font-size:13px;">Сумма</td>
        <td style="font-size:14px;font-weight:700;color:#00D4FF;text-align:right;">$${p.amount.toLocaleString("ru-RU")} USDT</td>
      </tr>
      ${txRow ? `<tr><td style="color:#8b92a0;padding:10px 0;font-size:13px;vertical-align:top;">Хэш транзакции</td><td style="font-size:12px;font-family:monospace;word-break:break-all;color:#8b92a0;text-align:right;">${p.txHash}</td></tr>` : ""}
    </table>

    <a href="${p.cabinetUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#00D4FF,#7B5EFF);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;margin-bottom:24px;">
      Открыть личный кабинет →
    </a>

    <p style="color:#555c6a;font-size:12px;margin:0;line-height:1.6;text-align:center;">
      Следите за метриками платформы и ростом вашего портфеля в личном кабинете.<br>
      Спасибо, что верите в Trends 🚀
    </p>
  </div>
</body>
</html>`;

  await sendEmail(p.to, `✅ Инвестиция подтверждена — ${p.packageName} · $${p.amount.toLocaleString("ru-RU")} USDT`, html);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY не задан — отправка email невозможна");
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0d0f14; color: #fff; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #151821; border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.08);">
    <div style="margin-bottom: 32px;">
      <span style="font-size: 22px; font-weight: 900; color: #fff;">Trends</span>
    </div>
    <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 12px;">Сброс пароля</h1>
    <p style="color: #8b92a0; margin: 0 0 32px; line-height: 1.6;">
      Мы получили запрос на сброс пароля для вашего инвесторского аккаунта.<br>
      Ссылка действует <strong style="color: #fff;">1 час</strong>.
    </p>
    <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #00D4FF, #7B5EFF); color: #fff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 12px;">
      Сбросить пароль
    </a>
    <p style="color: #555c6a; font-size: 13px; margin: 32px 0 0; line-height: 1.5;">
      Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.<br>
      Ссылка: <span style="color: #8b92a0;">${resetUrl}</span>
    </p>
  </div>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject: "Сброс пароля — Trends Investor",
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Resend error: ${JSON.stringify(err)}`);
  }
}
