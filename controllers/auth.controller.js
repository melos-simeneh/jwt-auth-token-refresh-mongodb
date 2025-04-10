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

exports.refresh = catchAsync(async (req, res) => {
  const refresh_token = req.cookies.refreshToken || req.body.refreshToken;

  if (!refresh_token) {
    throw new AppError("No refresh token provided", 400);
  }

  const accessToken = await refreshToken(refresh_token);

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    accessToken,
  });
});

exports.logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new AppError("No refresh token provided", 400);
  }

  await logoutUser(refreshToken);

  // Clear the refresh token cookie
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
