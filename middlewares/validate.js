const { matchedData, validationResult } = require('express-validator');

function validate(validations) {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      req.matchedData = matchedData(req);
      return next();
    }

    return res.status(400).json({
      status: 'fail',
      message: 'Validation error.',
      validationErrors: errors.array(),
    });
  };
}

module.exports = validate;
