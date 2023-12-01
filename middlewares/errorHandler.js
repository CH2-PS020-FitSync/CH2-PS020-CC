function errorHandler(err, req, res, next) {
  if (res.headerSent) {
    return next(err);
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
}

module.exports = errorHandler;
