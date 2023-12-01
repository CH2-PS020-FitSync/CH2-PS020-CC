function apiKey(req, res, next) {
  if (req.headers['x-api-key'] === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({
      status: 'fail',
      message: 'API Key is not valid.',
    });
  }
}

module.exports = apiKey;
