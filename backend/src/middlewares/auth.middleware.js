import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const isAuthenticated = asyncHandler(async (req, res, next) => {
    
  // Extract token from "Authorization: Bearer <token>"
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Unauthorized: Invalid or expired token");
  }

  // Fetch user from database (excluding password)
  const user = await User.findById(decoded._id).select("-password");

  if (!user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  // Attach user to req object for access in route/controller
  req.user = user;

  next();
});
