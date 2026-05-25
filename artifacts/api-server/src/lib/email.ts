const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "Trends Investor <onboarding@resend.dev>";

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
