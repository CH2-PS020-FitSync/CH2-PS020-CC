function checkAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (apiKey === process.env.API_KEY) {
    return next();
  }

  return res.status(401).json({
    status: 'fail',
    message: 'API key is invalid.',
  });
}

module.exports = checkAPIKey;
