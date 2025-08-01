import { Booking } from "../models/booking.model.js";
import { Event } from "../models/event.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendEmail } from "../utils/sendEmail.js";
import mongoose from "mongoose";

// ==========================
// @desc   Book seats for an event (Max 2)
// @route  POST /api/bookings/:eventId
// @access Private (User)

export const bookEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;
    const { seats } = req.body;

    // Seat validation
    if (!seats || seats < 1 || seats > 2) {
      return res
        .status(400)
        .json(new ApiError(400, "You can book 1 or 2 seats only."));
    }

    // Find event by _id or eventId field
    const event = await Event.findOne({
      $or: [
        mongoose.Types.ObjectId.isValid(eventId) ? { _id: eventId } : null,
        { eventId: eventId },
      ].filter(Boolean),
    });

    if (!event) {
      return res.status(404).json(new ApiError(404, "Event not found."));
    }

    // Total existing bookings for the event
    const existingBookings = await Booking.find({ event: event._id });
    const totalSeatsBooked = existingBookings.reduce(
      (acc, booking) => acc + booking.seats,
      0
    );

    if (totalSeatsBooked + seats > event.capacity) {
      return res
        .status(400)
        .json(new ApiError(400, "Event is full or not enough seats left."));
    }

    // Check how many seats the user already booked
    const userBookings = await Booking.find({ user: userId, event: event._id });
    const alreadyBookedSeats = userBookings.reduce(
      (acc, b) => acc + b.seats,
      0
    );

    if (alreadyBookedSeats + seats > 2) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            `You can book up to 2 seats only. You have already booked ${alreadyBookedSeats} seat(s).`
          )
        );
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      event: event._id,
      seats,
    });

    // Add user to attendees if not already present
    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      await event.save();
    }

    // Email confirmation
    const recipientEmail = req.user.email;

    try {
      await sendEmail(
        recipientEmail,
        `Booking Confirmation - ${event.title}`,
        `
          <h2>Booking Confirmed!</h2>
          <p>Hello ${req.user.name},</p>
          <p>You have successfully booked <strong>${seats}</strong> seat(s) for:</p>
          <ul>
            <li><strong>Event:</strong> ${event.title}</li>
            <li><strong>Date:</strong> ${new Date(
              event.date
            ).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}</li>
            <li><strong>Location:</strong> ${event.location}</li>
          </ul>
          <p>We look forward to seeing you there!</p>
          <br/>
          <p>Regards,<br/><strong>EventEase Team</strong></p>
        `
      );

      console.log(`Confirmation email sent to: ${recipientEmail}`);
    } catch (emailErr) {
      console.warn("⚠️ Booking saved, but email failed:", emailErr.message);
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          booking,
          `Event booked successfully. Confirmation sent to ${recipientEmail}`
        )
      );
  } catch (error) {
    console.error("Booking error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong during booking"));
  }
};

// ==========================
// @desc   Cancel a booking (before event starts)
// @route  DELETE /api/bookings/:bookingId
// @access Private (User)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate(
      "event"
    );

    if (!booking) {
      return res.status(404).json(new ApiError(404, "Booking not found."));
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiError(403, "Not authorized."));
    }

    const now = new Date();
    if (booking.event.date <= now) {
      return res
        .status(400)
        .json(new ApiError(400, "Cannot cancel past or ongoing events."));
    }

    await Booking.findByIdAndDelete(booking._id);

    await Event.findByIdAndUpdate(booking.event._id, {
      $pull: { attendees: req.user._id },
    });

    //  Send cancellation email
    await sendEmail(
      req.user.email,
      `Booking Cancelled - ${booking.event.title}`,
      `
        <h3>Booking Cancelled</h3>
        <p>Your booking for <strong>${
          booking.event.title
        }</strong> has been cancelled.</p>
        <p><strong>Scheduled Date:</strong> ${new Date(
          booking.event.date
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}</p>
        <p>We're sorry to see you go. Feel free to book again anytime.</p>
      `
    );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Booking cancelled successfully."));
  } catch (error) {
    console.error("Cancel error:", error);
    return res.status(500).json(new ApiError(500, "Failed to cancel booking"));
  }
};

// ==========================
// @desc   Get user's bookings
// @route  GET /api/bookings/mine
// @access Private (User)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "event"
    );

    return res
      .status(200)
      .json(new ApiResponse(200, bookings, "Your bookings"));
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json(new ApiError(500, "Could not fetch bookings"));
  }
};
