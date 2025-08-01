import { Router } from "express";
import {
  bookEvent,
  cancelBooking,
  getMyBookings,
} from "../controllers/booking.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

//  All routes 

router.post("/:eventId", isAuthenticated, bookEvent);               // Book event
router.delete("/:bookingId", isAuthenticated, cancelBooking);       // Cancel booking
router.get("/me", isAuthenticated, getMyBookings);                // Get my bookings

export default router;
