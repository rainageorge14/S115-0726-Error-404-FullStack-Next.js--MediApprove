import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || `"MediApprove" <no-reply@mediapprove.com>`;

  // 1. Prioritize Resend if API key is provided
  if (resendApiKey) {
    console.log(`Sending email via Resend to: ${to}`);
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          subject,
          html,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Resend API returned error:", data);
        throw new Error(data.message || "Failed to send email via Resend");
      }

      console.log("Email sent successfully via Resend. ID:", data.id);
      return data;
    } catch (err) {
      console.error("Error sending email via Resend:", err);
      throw err;
    }
  }

  // 2. Fallback to standard Nodemailer SMTP
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    console.log(`Sending email via SMTP to: ${to}`);
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port || "587", 10),
      secure: port === "465",
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    return info;
  }

  // 3. Dev Fallback to Ethereal mock SMTP
  console.log("----------------------------------------------------------------------");
  console.log("Email Config Missing / Incomplete in .env. Using mock Ethereal inbox.");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("----------------------------------------------------------------------");

  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"MediApprove (Mock)" <${testAccount.user}>`,
      to,
      subject,
      html,
    });

    console.log("Message sent to mock mailer. ID: %s", info.messageId);
    console.log("Preview Link: %s", nodemailer.getTestMessageUrl(info));
    console.log("----------------------------------------------------------------------");
    return info;
  } catch (err) {
    console.error("Failed to send email via Ethereal:", err);
    return null;
  }
}

export function getPasswordResetTemplate(userName: string, resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #F8FAFC;
            color: #0F2940;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            width: 100%;
            background-color: #F8FAFC;
            padding: 40px 0;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          }
          .header {
            background-color: #0F2940;
            padding: 30px;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: 800;
            color: #0EA5B7;
            text-decoration: none;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 40px 30px;
          }
          h1 {
            font-size: 22px;
            font-weight: 800;
            color: #0F2940;
            margin-top: 0;
            margin-bottom: 16px;
            letter-spacing: -0.5px;
          }
          p {
            font-size: 15px;
            line-height: 1.6;
            color: #475569;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .button-container {
            text-align: center;
            margin-bottom: 30px;
            margin-top: 10px;
          }
          .button {
            display: inline-block;
            background-color: #0EA5B7;
            color: #FFFFFF !important;
            font-weight: 600;
            font-size: 15px;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 12px;
            transition: background-color 0.2s ease;
          }
          .button:hover {
            background-color: #0C909F;
          }
          .expiry {
            font-size: 13px;
            color: #EF4444;
            background-color: #FEF2F2;
            border: 1px solid #FEE2E2;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-weight: 500;
          }
          .footer {
            background-color: #F8FAFC;
            padding: 24px 30px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            font-size: 12px;
            color: #94A3B8;
          }
          .footer-text {
            margin: 0;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <span class="logo">MediApprove</span>
            </div>
            <div class="content">
              <h1>Password Reset Request</h1>
              <p>Hello <strong>${userName}</strong>,</p>
              <p>We received a request to reset the password for your MediApprove account. Click the button below to set a new password:</p>
              
              <div class="button-container">
                <a href="${resetLink}" class="button" target="_blank">Reset Password</a>
              </div>
              
              <div class="expiry">
                <strong>Important:</strong> For security reasons, this link will expire in <strong>15 minutes</strong> and can only be used once.
              </div>
              
              <p>If you did not request a password reset, you can safely ignore this email. Your current password will remain secure and unchanged.</p>
            </div>
            <div class="footer">
              <p class="footer-text">This is an automated email from MediApprove. Please do not reply directly.</p>
              <p class="footer-text" style="margin-top: 6px;">&copy; 2026 MediApprove. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
