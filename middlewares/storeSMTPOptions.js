function storeSMTPOptions(req, res, next) {
  req.smtpOptions = {
    host: req.headers['x-smtp-host'],
    port: req.headers['x-smtp-host'],
    username: req.headers['x-smtp-username'],
    password: req.headers['x-smtp-password'],
  };

  next();
}

module.exports = storeSMTPOptions;
