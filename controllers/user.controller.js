const User = require("../models/User.model");
const { AppError } = require("../utils/errorHandler");

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");

    if (!user) {
      throw AppError("User not found", 404);
    }

    res.json({
      success: true,
      message: "Current logged in user",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password -__v");

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCurrentUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
};
