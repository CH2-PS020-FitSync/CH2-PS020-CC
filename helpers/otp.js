const bcrypt = require('bcrypt');

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

function isOTPCodeExpired(startDate, seconds = 120) {
  const startSecond = Math.round(startDate.getTime() / 1000);
  const currentSecond = Math.round(new Date().getTime() / 1000);
  const diffSecond = currentSecond - startSecond;

  if (diffSecond > seconds) {
    return true;
  }

  return false;
}

module.exports = {
  generateOTPCode,
  isOTPCodeExpired,
};
