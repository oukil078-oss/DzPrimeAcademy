export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ActivationEmailParams {
  to: string;
  name: string;
  token: string;
  locale?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<{ success: boolean; error?: string; mode: 'resend' | 'smtp' | 'preview' }> {
  // 1. Resend API (Recommended for Vercel - Free 3,000/mo)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'DZ Prime Academy <noreply@dzprimeacademy.live>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
          text,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[Email / Resend] Sent to ${to} (ID: ${data.id})`);
        return { success: true, mode: 'resend' };
      } else {
        console.error('[Email / Resend Error]', data);
        return { success: false, error: data.message || 'Resend API error', mode: 'resend' };
      }
    } catch (err: any) {
      console.error('[Email / Resend Exception]', err);
    }
  }

  // 2. Gmail / Custom SMTP (Free 500/day with Gmail App Password or Zoho/Hostinger SMTP)
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST;

  if ((gmailUser && gmailPass) || smtpHost) {
    try {
      // Dynamic require to prevent breaking if nodemailer isn't installed
      const nodemailer = require('nodemailer');
      const transporter = gmailUser
        ? nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: gmailUser,
              pass: gmailPass,
            },
          })
        : nodemailer.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT || 587),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

      const rawFrom = process.env.EMAIL_FROM || (gmailUser ? `"DZ Prime Academy" <${gmailUser}>` : '"DZ Prime Academy" <noreply@dzprimeacademy.live>');
      const fromEmail = rawFrom.includes('<') ? rawFrom : `"DZ Prime Academy" <${rawFrom}>`;
      await transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html,
        text,
      });

      console.log(`[Email / SMTP] Sent successfully to ${to}`);
      return { success: true, mode: 'smtp' };
    } catch (err: any) {
      console.error('[Email / SMTP Error]', err);
    }
  }

  // 3. Dev / Staging Preview Fallback (Never crashes registration)
  console.log('================================================================');
  console.log(`[EMAIL DISPATCH PREVIEW - NO API KEY CONFIGURED]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text summary: ${text || 'View HTML activation email'}`);
  console.log('================================================================');

  return { success: true, mode: 'preview' };
}

export function buildActivationEmailTemplate({ name, activationUrl, locale = 'ar' }: { name: string; activationUrl: string; locale?: string }) {
  const isAr = locale === 'ar';

  return `
<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'fr'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isAr ? 'تأكيد تفعيل حسابك في DZ Prime Academy' : 'Activez votre compte DZ Prime Academy'}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #060913; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #060913; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background: linear-gradient(180deg, #0F172A 0%, #080C1A 100%); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);">
          
          <!-- Gold Top Accent Bar -->
          <tr>
            <td height="5" style="background: linear-gradient(90deg, #D4AF37 0%, #F5D061 50%, #D4AF37 100%);"></td>
          </tr>

          <!-- Header Logo Section -->
          <tr>
            <td align="center" style="padding: 35px 30px 20px 30px;">
              <div style="display: inline-block; padding: 12px 24px; border-radius: 16px; background-color: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);">
                <span style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: 1px;">
                  DZ <span style="color: #D4AF37;">PRIME</span> ACADEMY
                </span>
              </div>
              <div style="margin-top: 10px; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 2px;">
                Plateforme Nationale d'Excellence 2026
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 10px 35px 30px 35px; text-align: ${isAr ? 'right' : 'left'};">
              <h1 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0; line-height: 1.4;">
                ${isAr ? `مرحباً بك يا ${name} 👋` : `Bienvenue ${name} 👋`}
              </h1>
              
              <p style="font-size: 14px; line-height: 1.7; color: #CBD5E1; margin: 0 0 20px 0;">
                ${
                  isAr
                    ? 'شكراً لانضمامك إلى منصة DZ Prime Academy. يرجى تأكيد بريدك الإلكتروني وتفعيل حسابك عبر الضغط على الزر أدناه لبدء استكشاف المقاييس، الامتحانات، والحصص المباشرة فوراً.'
                    : 'Merci de vous être inscrit sur DZ Prime Academy. Veuillez confirmer votre adresse email et activer votre compte en cliquant sur le bouton ci-dessous pour accéder immédiatement à vos modules et examens.'
                }
              </p>

              <!-- Prominent CTA Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${activationUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #D4AF37 0%, #E6C86E 50%, #B8972E 100%); color: #05070D; font-size: 15px; font-weight: 900; text-decoration: none; border-radius: 16px; box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4); text-align: center; letter-spacing: 0.5px;">
                      ${isAr ? '✓ تفعيل حسابي الآن' : '✓ Activer mon compte'}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Direct Link -->
              <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 12px; padding: 14px; margin-top: 25px;">
                <p style="font-size: 12px; color: #94A3B8; margin: 0 0 8px 0;">
                  ${isAr ? 'إذا لم يعمل الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك مباشرة:' : 'Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :'}
                </p>
                <p style="font-size: 11px; color: #D4AF37; word-break: break-all; margin: 0; font-family: monospace;">
                  <a href="${activationUrl}" style="color: #D4AF37; text-decoration: underline;">${activationUrl}</a>
                </p>
              </div>

              <!-- Expiry & Notice -->
              <p style="font-size: 12px; color: #64748B; margin-top: 24px; margin-bottom: 0;">
                ⏳ ${isAr ? 'هذا الرابط صالح لمدة 24 ساعة فقط.' : 'Ce lien d\'activation est valable pendant 24 heures.'}
                <br>
                ${isAr ? 'إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة بأمان.' : 'Si vous n\'avez pas créé ce compte, ignorez simplement cet email.'}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 35px;">
              <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 0;">
            </td>
          </tr>

          <!-- Footer Support -->
          <tr>
            <td style="padding: 24px 35px; text-align: center;">
              <p style="font-size: 12px; color: #94A3B8; margin: 0 0 10px 0;">
                ${isAr ? 'تحتاج إلى مساعدة؟ فريق دعم الأكاديمية متواجد على مدار 58 ولاية' : 'Besoin d\'aide ? Le support DZ Prime Academy est à votre écoute'}
              </p>
              <div style="font-size: 11px; color: #64748B;">
                DZ Prime Academy © 2026 — Tous droits réservés.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendActivationEmail({ to, name, token, locale = 'ar' }: ActivationEmailParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dzprimeacademy.live';
  const activationUrl = `${baseUrl}/${locale}/activate?token=${token}`;

  const isAr = locale === 'ar';
  const subject = isAr
    ? 'تفعيل حسابك في DZ Prime Academy 🎓'
    : 'Activez votre compte DZ Prime Academy 🎓';

  const html = buildActivationEmailTemplate({ name, activationUrl, locale });
  const text = isAr
    ? `مرحباً بك ${name} في DZ Prime Academy.\nلتفعيل حسابك، يرجى فتح الرابط التالي:\n${activationUrl}\n(صالح لمدة 24 ساعة)`
    : `Bienvenue ${name} sur DZ Prime Academy.\nPour activer votre compte, cliquez sur le lien suivant :\n${activationUrl}\n(Valable 24 heures)`;

  return sendEmail({
    to,
    subject,
    html,
    text,
  });
}
