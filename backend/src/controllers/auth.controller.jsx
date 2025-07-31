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

    // Input validation
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json(new ApiError(400, "Name, email, and password are required"));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(new ApiError(409, "User already exists"));
    }

    // Create and save the user (password is hashed in pre-save middleware)
    const user = await User.create({ name, email, password });

    // Generate JWT token for the new user
    const token = user.generateAccessToken();

    // Remove sensitive info (like password) before sending back
    const userData = await User.findById(user._id).select("-password");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user: userData, token },
          "Registered successfully"
        )
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

    // Input validation
    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiError(400, "Email and password are required"));
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json(new ApiError(401, "Invalid email or password"));
    }

    // Compare passwords using instance method
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiError(401, "Invalid email or password"));
    }

    // Generate JWT for logged-in user
    const token = user.generateAccessToken();

    // Exclude password from response
    const userData = await User.findById(user._id).select("-password");

    return res
      .status(200)
      .json(
        new ApiResponse(200, { user: userData, token }, "Login successful")
      );
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json(new ApiError(500, "Login failed"));
  }
};


/**
 * @desc   Logout user (JWT is stateless — no action server-side)
 * @route  POST /api/auth/logout
 * @access Public
 */


export const logoutUser = (_req, res) => {
  // With JWT, logout is handled client-side 
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
};
