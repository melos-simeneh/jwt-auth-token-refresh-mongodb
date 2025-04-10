const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const envVarsConfig = require("./utils/env.js");
const mongoDBConnection = require("./config/db.config.js");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const { AppError, globalErrorHandler } = require("./utils/errorHandler.js");
const setupSwagger = require("./config/swagger.config.js");
const cookieParser = require("cookie-parser");
const limiter = require("./config/rate-limiter.config.js");

const app = express();

envVarsConfig();
mongoDBConnection();

app.use(express.json({ limit: "10kb" }));

app.use(helmet());
app.use(cors());
app.use(cookieParser());

app.use(limiter);

app.use("/api/docs", setupSwagger());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.use((req, res, next) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});

// Global Error Handler (MUST be last middleware)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
