const User = require("../models/User.model.js");
const UserToken = require("../models/UserToken.model.js");
const { AppError } = require("../utils/errorHandler.js");
const { comparePasswords, hashPassword } = require("../utils/password.js");
const {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token.js");

// Cache frequently accessed data
const userCache = new Map();

const doesUsernameExist = async (username) => {
  if (userCache.has(username)) {
    return true;
  }

  const user = await User.findOne({ username }).lean().exec();
  if (user) {
    userCache.set(username, user);
    return true;
  }
  return false;
};

const findUserByUsername = async (username) => {
  if (userCache.has(username)) {
    return userCache.get(username);
  }

  const user = await User.findOne({ username });
  if (user) {
    userCache.set(username, user);
  }
  return user;
};

exports.createUser = async (userData) => {
  const { username, password } = userData;

  if (await doesUsernameExist(username)) {
    throw new AppError("Username already taken", 409);
  }

  const hashedPassword = await hashPassword(password);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  // Add to cache
  userCache.set(username, newUser);

  return {
    userId: newUser._id,
    username: newUser.username,
    createdAt: newUser.createdAt,
  };
};

exports.loginUser = async (loginData) => {
  const { username, password } = loginData;
  const user = await findUserByUsername(username);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isCorrectPassword = await comparePasswords(password, user.password);
  if (!isCorrectPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token with user info
  await UserToken.findOneAndUpdate(
    { userId: user._id },
    { token: refreshToken, createdAt: new Date() },
    { upsert: true, new: true }
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      username: user.username,
    },
  };
};

exports.refreshToken = async (token) => {
  const payload = verifyRefreshToken(token);

  const userToken = await UserToken.findOne({
    userId: payload.userId,
    token,
  });

  if (!userToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return generateAccessToken(user);
};

exports.logoutUser = async (token) => {
  const payload = verifyRefreshToken(token);
  await UserToken.deleteOne({ userId: payload.userId, token });
};
