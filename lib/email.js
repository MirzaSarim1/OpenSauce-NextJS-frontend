import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})


export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}


export function getOTPExpiry() {
  return new Date(Date.now() + 10 * 60 * 1000)
}


export async function sendVerificationEmail(email, name, otp) {
  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `${process.env.APP_NAME} - Verify Your Email`,
    text: `Hi ${name},\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #18181b;
              margin-bottom: 20px;
            }
            .content p {
              color: #52525b;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .otp-box {
              background-color: #fef3c7;
              border: 2px dashed #f59e0b;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #ea580c;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .expiry {
              color: #78716c;
              font-size: 14px;
              margin-top: 10px;
            }
            .footer {
              background-color: #fafafa;
              padding: 20px;
              text-align: center;
              color: #78716c;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍳 ${process.env.APP_NAME}</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}! 👋</h2>
              <p>Thank you for signing up! To complete your registration, please verify your email address using the code below:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="expiry">⏰ This code expires in 10 minutes</div>
              </div>
              
              <p>Enter this code on the verification page to activate your account and start sharing delicious recipes!</p>
              
              <p style="color: #71717a; font-size: 14px;">
                If you didn't create an account with ${process.env.APP_NAME}, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('✅ Verification email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return { success: false, error: error.message }
  }
}

export async function sendPasswordResetEmail(email, name, resetLink) {
  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `${process.env.APP_NAME} - Reset Your Password`,
    text: `Hi ${name},\n\nClick this link to reset your password: ${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">© ${new Date().getFullYear()} ${process.env.APP_NAME}</p>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('✅ Password reset email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return { success: false, error: error.message }
  }
}