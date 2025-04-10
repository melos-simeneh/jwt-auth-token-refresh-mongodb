const jwt = require("jsonwebtoken");
const { AppError } = require("./errorHandler.js");

// Token configuration
const tokenConfig = {
  access: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: "15m", // Shorter lifespan for better security
    audience: "access",
    issuer: "your-app-name",
  },
  refresh: {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: "7d",
    audience: "refresh",
    issuer: "your-app-name",
  },
};

/**
 * Generate a JWT token with standard claims
 * @param {Object} user - User object
 * @param {string} type - Token type ('access' or 'refresh')
 * @returns {string} Generated token
 */
generateToken = (user, type = "access") => {
  if (!["access", "refresh"].includes(type)) {
    throw new Error("Invalid token type");
  }

  const config = tokenConfig[type];
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      // Add any other non-sensitive user data needed
    },
    config.secret,
    {
      expiresIn: config.expiresIn,
      audience: config.audience,
      issuer: config.issuer,
      subject: user._id.toString(),
    }
  );
};

/**
 * Verify and decode a JWT token
 * @param {string} token - Token to verify
 * @param {string} type - Expected token type ('access' or 'refresh')
 * @returns {Object} Decoded token payload
 * @throws {AppError} If token is invalid
 */
const verifyToken = (token, type = "access") => {
  if (!token) {
    throw new AppError("No token provided", 401);
  }

  if (!["access", "refresh"].includes(type)) {
    throw new AppError("Invalid token type", 400);
  }

  const config = tokenConfig[type];

  try {
    return jwt.verify(token, config.secret, {
      audience: config.audience,
      issuer: config.issuer,
      ignoreExpiration: false,
    });
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      throw new AppError("Token expired", 401);
    }
    if (err.name === "JsonWebTokenError") {
      throw new AppError("Invalid token", 401);
    }
    throw new AppError("Authentication failed", 401);
  }
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Tokens object
 */
exports.generateAuthTokens = (user) => {
  return {
    accessToken: generateToken(user, "access"),
    refreshToken: generateToken(user, "refresh"),
  };
};

/**
 * Check if token is about to expire (within threshold)
 * @param {string} token - Token to check
 * @param {string} type - Token type
 * @param {number} thresholdSeconds - Threshold in seconds
 * @returns {boolean} True if token is about to expire
 */
exports.isTokenExpiringSoon = (token, type, thresholdSeconds = 300) => {
  try {
    const decoded = verifyToken(token, type);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp - now < thresholdSeconds;
  } catch (err) {
    return true;
  }
};

// Aliases for backward compatibility
exports.generateAccessToken = (user) => generateToken(user, "access");
exports.generateRefreshToken = (user) => generateToken(user, "refresh");
exports.verifyAccessToken = (token) => verifyToken(token, "access");
exports.verifyRefreshToken = (token) => verifyToken(token, "refresh");
