const {
  loginBodyValidation,
  refreshTokenBodyValidation,
  signUpBodyValidation,
} = require("../validators/auth.validator.js");
const { handleValidationError } = require("../utils/errorHandler.js");

exports.validateSignup = (req, res, next) => {
  const { error } = signUpBodyValidation(req.body);
  if (error) {
    return next(handleValidationError(error));
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  const { error } = loginBodyValidation(req.body);
  if (error) {
    return next(handleValidationError(error));
  }
  next();
};

exports.validateRefreshToken = (req, res, next) => {
  const { error } = refreshTokenBodyValidation(req.body);
  if (error) {
    return next(handleValidationError(error));
  }
  next();
};
