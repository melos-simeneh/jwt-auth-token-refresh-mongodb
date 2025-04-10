const { AppError } = require("../utils/errorHandler.js");
const { verifyAccessToken } = require("../utils/token.js");
const User = require("../models/User.model.js");

const auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError("Access denied: No token provided", 401));
  }

  try {
    const decoded = verifyAccessToken(token);

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};

// Role-based authorization
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

module.exports = { auth, restrictTo };
