const {
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
} = require("../services/auth.service.js");
const catchAsync = require("../utils/catchAsync.js");

exports.signup = catchAsync(async (req, res) => {
  const newUser = await createUser(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      userId: newUser.userId,
      username: newUser.username,
      createdAt: newUser.createdAt,
    },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, user } = await loginUser(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      refreshToken,
      user: {
        userId: user._id,
        username: user.username,
      },
    },
  });
});
exports.refresh = catchAsync(async (req, res, next) => {
  const refresh_token = req.cookies?.refreshToken;

  if (!refresh_token) {
    return next(new AppError("Refresh token missing or expired.", 401));
  }

  const accessToken = await refreshToken(refresh_token);

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    accessToken,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const refresh_token = req.cookies?.refreshToken;

  if (refresh_token) {
    await logoutUser(refresh_token);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
  }

  res.status(200).json({
    success: true,
    message: "User Logged out successfully",
  });
});

exports.refreshWithToken = catchAsync(async (req, res, next) => {
  const refresh_token = req.body.refreshToken;

  if (!refresh_token) {
    return next(new AppError("No refresh token provided", 400));
  }

  const accessToken = await refreshToken(refresh_token);

  return res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    accessToken,
  });
});

// Renamed function for handling logout with token in the body
exports.logoutWithToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return next(new AppError("No refresh token provided", 400));
  }

  await logoutUser(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
