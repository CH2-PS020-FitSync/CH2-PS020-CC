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
  const startSecond = Math.round(startDate.getTime() / 1000);
  const currentSecond = Math.round(new Date().getTime() / 1000);
  const diffSecond = currentSecond - startSecond;

  if (diffSecond > maxSeconds) {
    return true;
  }

  return false;
}

function generateHTMLEmail(type, otpCode, name) {
  return new Promise((resolve, reject) => {
    (async () => {
      let title;
      let opening;
      let closing;

      if (type === 'register') {
        title = 'Registration OTP Code';
        opening = `Thank you for registering at FitSync. Complete your registration process by inputting this OTP code in the app.`;
        closing = `⚠️ If you feel you didn't register at FitSync, please ignore
        this email letter.`;
      } else {
        title = 'Reset Password Request OTP Code';
        opening = `You're attempting to reset your password. Please verify your action by inputting this OTP code in the app.`;
        closing = `⚠️ If you feel you didn't request this action, please ignore this email letter and change your password immediately.`;
      }

      try {
        const html = await ejs.renderFile('views/emails/otp.ejs', {
          locals: {
            title,
            name,
            opening,
            closing,
            otpCode,
          },
        });

        resolve(html);
      } catch (error) {
        reject(error);
      }
    })();
  });
}

function sendOTPToEmail({ type, otpCode, to, name, smtpOptions }) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const html = await generateHTMLEmail(type, otpCode, name);

        const emailTransporter = createEmailTransporter(smtpOptions);

        const info = await emailTransporter.sendMail({
          from: `"${process.env.EMAIL_TRANSPORTER_NAME}" <${process.env.EMAIL_TRANSPORTER_USERNAME}>`,
          to,
          subject:
            type === 'register'
              ? 'Verify Your Account'
              : 'Reset Password Request',
          html,
        });

        resolve(info);
      } catch (error) {
        reject(error);
      }
    })();
  });
}

module.exports = {
  generateOTPCode,
  isOTPCodeExpired,
  sendOTPToEmail,
};
