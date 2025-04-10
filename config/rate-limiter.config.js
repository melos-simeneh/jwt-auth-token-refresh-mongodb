const rateLimit = require("express-rate-limit");
const { AppError } = require("../utils/errorHandler");

// Rate limiter: allow only 5 requests per IP address in 1 minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 5, // limit each IP to 5 requests per windowMs
  handler: (req, res) => {
    throw new AppError("Too many requests, please try again later.", 429);
  },
});

module.exports = limiter;
