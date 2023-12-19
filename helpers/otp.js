const ejs = require('ejs');
const bcrypt = require('bcrypt');

const createEmailTransporter = require('./emailTransporter');

async function generateOTPCode(length = 4, saltRounds = 10) {
  const characters = '0123456789';
  let plainOTPCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    plainOTPCode += characters.charAt(randomIndex);
  }

  const encryptedOTPCode = await bcrypt.hash(plainOTPCode, saltRounds);

  return [plainOTPCode, encryptedOTPCode];
}

function isOTPCodeExpired(startDate, maxSeconds = 300) {
  const startSeconds = Math.round(startDate.getTime() / 1000);
  const currentSeconds = Math.round(new Date().getTime() / 1000);
  const diffSeconds = currentSeconds - startSeconds;

  if (diffSeconds > maxSeconds) {
    return true;
  }

  return false;
}

const OTP_TYPES = {
  REGISTER: Symbol('register'),
  FORGOT_PASSWORD: Symbol('forgot-password'),
};

async function generateHTMLEmail(type, otpCode, name) {
  let title;
  let opening;
  let closing;

  if (type === OTP_TYPES.REGISTER) {
    title = 'Registration OTP Code';
    opening = `Thank you for registering at FitSync. Complete your registration process by inputting this OTP code in the app.`;
    closing = `⚠️ If you feel you didn't register at FitSync, please ignore this email letter.`;
  } else {
    title = 'Reset Password Request OTP Code';
    opening = `You're attempting to reset your password. Please verify your action by inputting this OTP code in the app.`;
    closing = `⚠️ If you feel you didn't request this action, please ignore this email letter and change your password immediately.`;
  }

  try {
    const html = await ejs.renderFile('views/emails/otp.ejs', {
      locals: {
        title,
        logoSrc: `https://storage.googleapis.com/${process.env.STATIC_ASSETS_BUCKET}/fitsync-logo.png`,
        name,
        opening,
        closing,
        otpCode,
      },
    });

    return html;
  } catch (error) {
    throw new Error(error);
  }
}

async function sendOTPToEmail({ type, otpCode, to, name, smtpOptions }) {
  try {
    const html = await generateHTMLEmail(type, otpCode, name);

    const emailTransporter = createEmailTransporter(smtpOptions);

    const info = await emailTransporter.sendMail({
      from: `"${process.env.EMAIL_TRANSPORTER_NAME}" <${process.env.EMAIL_TRANSPORTER_USERNAME}>`,
      to,
      subject:
        type === OTP_TYPES.REGISTER
          ? 'Verify Your Account'
          : 'Reset Password Request',
      html,
    });

    return info;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  generateOTPCode,
  isOTPCodeExpired,
  OTP_TYPES,
  sendOTPToEmail,
};
