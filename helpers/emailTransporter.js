const nodemailer = require('nodemailer');

function createEmailTransporter({ host, port, username, password }) {
  const options = {
    auth: {
      user: username || process.env.EMAIL_TRANSPORTER_USERNAME,
      pass: password || process.env.EMAIL_TRANSPORTER_PASSWORD,
    },
  };

  const transporterService = process.env.EMAIL_TRANSPORTER_SERVICE;

  if (transporterService) {
    options.service = transporterService;
  } else {
    options.host = host || process.env.EMAIL_TRANSPORTER_HOST;
    options.port = port || process.env.EMAIL_TRANSPORTER_PORT;
  }

  const emailTransporter = nodemailer.createTransport(options);

  return emailTransporter;
}

module.exports = createEmailTransporter;
