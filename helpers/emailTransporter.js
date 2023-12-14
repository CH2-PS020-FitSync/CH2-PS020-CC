const nodemailer = require('nodemailer');

function createEmailTransporter(options) {
  const isInDevelopment =
    process.env.ENVIRONMENT.toLowerCase() === 'development';

  let transporterOptions;

  if (isInDevelopment) {
    const { host, port, username, password } = options;

    transporterOptions = {
      host: host || process.env.EMAIL_TRANSPORTER_HOST,
      port: port || process.env.EMAIL_TRANSPORTER_PORT,
      auth: {
        user: username || process.env.EMAIL_TRANSPORTER_USERNAME,
        pass: password || process.env.EMAIL_TRANSPORTER_PASSWORD,
      },
    };
  } else {
    transporterOptions = {
      service: process.env.EMAIL_TRANSPORTER_SERVICE,
      auth: {
        user: process.env.EMAIL_TRANSPORTER_USERNAME,
        pass: process.env.EMAIL_TRANSPORTER_PASSWORD,
      },
    };
  }

  const emailTransporter = nodemailer.createTransport(transporterOptions);

  return emailTransporter;
}

module.exports = createEmailTransporter;
