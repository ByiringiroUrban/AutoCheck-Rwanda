import logging
from email.message import EmailMessage
from email.utils import make_msgid, formatdate
from typing import Optional
import aiosmtplib

from app.core.config import settings

logger = logging.getLogger("autocheck.email")


class EmailService:
    @staticmethod
    def is_configured() -> bool:
        return bool(settings.SMTP_USER and settings.SMTP_PASS)

    @staticmethod
    async def send_email(
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """
        Sends an email asynchronously via SMTP.
        """
        if not EmailService.is_configured():
            logger.warning(
                f"[EmailService] SMTP credentials not configured. Email to '{to_email}' skipped.\n"
                f"Subject: {subject}"
            )
            return False

        message = EmailMessage()
        message["From"] = settings.SMTP_FROM
        message["To"] = to_email
        message["Subject"] = subject
        
        # Add required headers to prevent spam blocking by Gmail
        message["Message-ID"] = make_msgid(domain="gmail.com")
        message["Date"] = formatdate(localtime=True)

        # Set plain text alternative if available, or extract simple fallback
        if text_content:
            message.set_content(text_content)
            message.add_alternative(html_content, subtype="html")
        else:
            message.set_content("Please view this email in an HTML-compatible email client.")
            message.add_alternative(html_content, subtype="html")

        try:
            logger.info(f"[EmailService] Sending email to {to_email} via {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
            await aiosmtplib.send(
                message,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USER,
                password=settings.SMTP_PASS,
                start_tls=settings.SMTP_TLS,
                timeout=15.0,
            )
            logger.info(f"[EmailService] Email successfully sent to {to_email}")
            return True
        except Exception as e:
            logger.error(f"[EmailService] Failed to send email to {to_email}: {str(e)}", exc_info=True)
            return False

    @staticmethod
    async def send_password_reset_otp_email(
        to_email: str,
        first_name: str,
        otp_code: str
    ) -> bool:
        """
        Sends a branded password reset email with a 6-digit OTP verification code.
        """
        subject = f"{otp_code} is your AutoCheck Rwanda Password Reset Code"
        
        # Split digits for individual display boxes
        digits_html = "".join(
            f'<div style="display: inline-block; width: 44px; height: 52px; line-height: 52px; font-size: 28px; font-weight: 800; color: #0284c7; background: #f0f9ff; border: 2px solid #bae6fd; border-radius: 8px; margin: 0 4px; text-align: center; font-family: monospace;">{d}</div>'
            for d in str(otp_code)
        )

        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP - AutoCheck Rwanda</title>
  <style>
    body {{
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f6f9;
      color: #1e293b;
      line-height: 1.6;
    }}
    .email-wrapper {{
      max-width: 580px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }}
    .header {{
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 30px 24px;
      text-align: center;
    }}
    .brand-title {{
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
    }}
    .brand-tagline {{
      margin: 4px 0 0;
      font-size: 12px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }}
    .content {{
      padding: 32px 28px;
      text-align: center;
    }}
    .greeting {{
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 12px;
    }}
    .message-p {{
      font-size: 15px;
      color: #475569;
      margin: 0 0 24px;
      line-height: 1.5;
    }}
    .otp-container {{
      margin: 28px 0;
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px dashed #cbd5e1;
    }}
    .otp-label {{
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 14px;
    }}
    .expiry-note {{
      font-size: 13px;
      color: #e11d48;
      font-weight: 600;
      margin-top: 14px;
    }}
    .alert-box {{
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      border-radius: 4px;
      margin: 24px 0 0;
      font-size: 13px;
      color: #92400e;
      text-align: left;
    }}
    .footer {{
      background: #f8fafc;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }}
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1 class="brand-title">AutoCheck Rwanda</h1>
      <p class="brand-tagline">Logan Investment Co. Ltd</p>
    </div>
    <div class="content">
      <h2 class="greeting">Hello {first_name or 'Valued Customer'},</h2>
      <p class="message-p">
        We received a request to reset your <strong>AutoCheck Rwanda</strong> password for <code>{to_email}</code>. Use the 6-digit verification code below:
      </p>

      <div class="otp-container">
        <div class="otp-label">Your 6-Digit Password Reset OTP Code</div>
        <div style="margin: 8px 0;">
          {digits_html}
        </div>
        <div class="expiry-note">
          ⏱ Code expires in 10 minutes
        </div>
      </div>

      <p class="message-p" style="font-size: 14px; margin-bottom: 0;">
        Enter this code in the password reset form on AutoCheck Rwanda along with your new password.
      </p>

      <div class="alert-box">
        <strong>Security Notice:</strong> Never share this code with anyone. AutoCheck support staff will never ask for your verification code. If you did not request this, please ignore this email.
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 4px;">&copy; 2026 Logan Investment Co. Ltd. All rights reserved.</p>
      <p style="margin: 0;">AutoCheck Rwanda &bull; Vehicle Inspection &amp; History Platform</p>
    </div>
  </div>
</body>
</html>
"""
        text_content = f"""Hello {first_name or 'User'},

Your 6-digit AutoCheck Rwanda password reset code is:

{otp_code}

This code is valid for 10 minutes.

Enter this code on the password reset page along with your new password.

If you did not request a password reset, please ignore this email.

--
Logan Investment Co. Ltd
AutoCheck Rwanda Team
"""
        return await EmailService.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )

    @staticmethod
    async def send_password_reset_email(
        to_email: str,
        first_name: str,
        reset_token: str,
        reset_url: str
    ) -> bool:
        """
        Sends a branded password reset email with the reset link and token.
        """
        subject = "Reset Your AutoCheck Rwanda Password"
        
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - AutoCheck Rwanda</title>
  <style>
    body {{
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f6f9;
      color: #1e293b;
      line-height: 1.6;
    }}
    .email-wrapper {{
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }}
    .header {{
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 32px 24px;
      text-align: center;
    }}
    .brand-title {{
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
    }}
    .brand-tagline {{
      margin: 6px 0 0;
      font-size: 13px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }}
    .content {{
      padding: 36px 32px;
    }}
    .greeting {{
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
    }}
    .message-p {{
      font-size: 15px;
      color: #475569;
      margin: 0 0 20px;
    }}
    .btn-container {{
      text-align: center;
      margin: 32px 0;
    }}
    .reset-btn {{
      display: inline-block;
      background: #0284c7;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      padding: 14px 36px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
      transition: background 0.2s ease;
    }}
    .reset-btn:hover {{
      background: #0369a1;
    }}
    .token-box {{
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
      word-break: break-all;
    }}
    .token-title {{
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 6px;
    }}
    .token-value {{
      font-family: monospace;
      font-size: 13px;
      color: #0f172a;
      background: #ffffff;
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }}
    .alert-box {{
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 14px 18px;
      border-radius: 4px;
      margin: 24px 0 0;
      font-size: 13px;
      color: #92400e;
    }}
    .footer {{
      background: #f8fafc;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }}
    .footer a {{
      color: #0284c7;
      text-decoration: none;
    }}
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1 class="brand-title">AutoCheck Rwanda</h1>
      <p class="brand-tagline">Logan Investment Co. Ltd</p>
    </div>
    <div class="content">
      <h2 class="greeting">Hello {first_name or 'Valued Customer'},</h2>
      <p class="message-p">
        We received a request to reset the password for your <strong>AutoCheck Rwanda</strong> account associated with <code>{to_email}</code>.
      </p>
      <p class="message-p">
        Click the secure button below to choose a new password. This link is valid for the next <strong>60 minutes</strong>.
      </p>

      <div class="btn-container">
        <a href="{reset_url}" class="reset-btn" target="_blank" rel="noopener noreferrer">Reset My Password</a>
      </div>

      <div class="token-box">
        <div class="token-title">Direct Reset Link</div>
        <p style="margin: 0; font-size: 13px; color: #64748b;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="margin: 8px 0 0; font-size: 12px; word-break: break-all;"><a href="{reset_url}" style="color: #0284c7;">{reset_url}</a></p>
      </div>

      <div class="alert-box">
        <strong>Security Notice:</strong> If you did not request this password reset, please disregard this email. Your password will remain unchanged and your account stays safe.
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px;">&copy; 2026 Logan Investment Co. Ltd. All rights reserved.</p>
      <p style="margin: 0;">AutoCheck Rwanda &bull; Vehicle Inspection &amp; History Platform &bull; Kigali, Rwanda</p>
    </div>
  </div>
</body>
</html>
"""
        text_content = f"""Hello {first_name or 'User'},

We received a request to reset your password on AutoCheck Rwanda.

To reset your password, please open the following link in your browser:
{reset_url}

This link is valid for 60 minutes.

If you did not request a password reset, please ignore this email.

--
Logan Investment Co. Ltd
AutoCheck Rwanda Team
"""
        return await EmailService.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )

    @staticmethod
    async def send_password_changed_confirmation(
        to_email: str,
        first_name: str
    ) -> bool:
        """
        Sends a confirmation email notifying the user that their password was changed.
        """
        subject = "Your AutoCheck Rwanda Password Was Changed"
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Changed</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f6f9; color: #1e293b; }}
    .box {{ max-width: 550px; margin: 30px auto; background: #ffffff; border-radius: 10px; padding: 30px; border: 1px solid #e2e8f0; }}
    .header {{ font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }}
    .alert {{ background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; color: #065f46; font-size: 14px; border-radius: 4px; }}
    .footer {{ font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; }}
  </style>
</head>
<body>
  <div class="box">
    <div class="header">AutoCheck Rwanda</div>
    <p>Hello {first_name},</p>
    <div class="alert">
      Your account password was successfully updated.
    </div>
    <p style="margin-top: 16px; font-size: 14px; color: #475569;">
      If you made this change, you can safely ignore this email. If you did not make this change, please contact our support team immediately.
    </p>
    <div class="footer">
      Logan Investment Co. Ltd &bull; AutoCheck Rwanda
    </div>
  </div>
</body>
</html>
"""
        return await EmailService.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            text_content=f"Hello {first_name},\n\nYour AutoCheck Rwanda account password was successfully updated.\n\nIf you did not make this change, please contact support immediately.\n\nLogan Investment Co. Ltd"
        )
