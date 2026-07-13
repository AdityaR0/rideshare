const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const { giveRideCoins } = require("../utils/coinUtils");
const rewards = require("../config/rewards");

// generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      isProfileComplete: false,
    });

    // Give Welcome RideCoins
await giveRideCoins({
  userId: user._id,
  coins: rewards.WELCOME_BONUS,
  reason: "Welcome Bonus",
});

    res.status(201).json({
      message: "Registration successful. Please login.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // role validation (VERY IMPORTANT)
    if (user.role !== role) {
      return res
        .status(403)
        .json({ message: "Role mismatch. Please select correct role." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ================= GET ME =================
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
