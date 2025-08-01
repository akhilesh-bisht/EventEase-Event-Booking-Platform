import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Normalize and validate input
    const normalizedEmail = email?.toLowerCase().trim();
    if (!name?.trim() || !normalizedEmail || !password?.trim()) {
      return res
        .status(400)
        .json(new ApiError(400, "Name, email, and password are required"));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json(new ApiError(409, "User already exists"));
    }

    // Create user
    const user = await User.create({ name, email: normalizedEmail, password });

    // Generate token
    const token = user.generateAccessToken();

    // Remove sensitive info
    const userData = await User.findById(user._id).select("-password");

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, { user: userData }, "Registered successfully")
      );
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json(new ApiError(500, "Registration failed"));
  }
};

/**
 * @desc   Login user with email and password
 * @route  POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json(new ApiError(400, "Email and password are required"));
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.isPasswordCorrect(password))) {
      return res
        .status(401)
        .json(new ApiError(401, "Invalid email or password"));
    }

    const token = user.generateAccessToken();
    const userData = await User.findById(user._id).select("-password");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { user: userData }, "Login successful"));
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json(new ApiError(500, "Login failed"));
  }
};

/**
 * @desc   Logout user
 * @route  POST /api/auth/logout
 * @access Public
 */
export const logoutUser = (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
};
