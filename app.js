const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const envVarsConfig = require("./utils/env.js");
const mongoDBConnection = require("./config/db.config.js");
const authRoutes = require("./routes/auth.routes.js");
const { AppError, globalErrorHandler } = require("./utils/errorHandler.js");
const rateLimit = require("express-rate-limit");

const app = express();

envVarsConfig();
mongoDBConnection();

app.use(express.json({ limit: "10kb" }));

app.use(helmet());
app.use(cors()); // This will allow all origins, but you can specify specific ones.

// Rate limiter: allow only 5 requests per IP address in 1 minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 5, // limit each IP to 5 requests per windowMs
  handler: (req, res) => {
    throw new AppError("Too many requests, please try again later.", 429);
  },
});

app.use(limiter);

app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});

// Global Error Handler (MUST be last middleware)
app.use(globalErrorHandler);

module.exports = app;
