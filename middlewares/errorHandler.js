function errorHandler(err, req, res, next) {
  if (res.headerSent) {
    next(err);
  }

  console.error(err);

  res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
}

module.exports = errorHandler;
