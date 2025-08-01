import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// Public Routes
router.get("/", getAllEvents); // View all events with filters
router.get("/:id", getEventById); // Get a single event

//  Admin Protected Routes
router.post("/", isAuthenticated, isAdmin, createEvent); // Create
router.put("/:id", isAuthenticated, isAdmin, updateEvent); // Update
router.delete("/:id", isAuthenticated, isAdmin, deleteEvent); // Delete

export default router;
