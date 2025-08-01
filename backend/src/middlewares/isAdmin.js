// middlewares/role.middleware.js
import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json(new ApiError(403, "Admin access required"));
  }
  next();
};
