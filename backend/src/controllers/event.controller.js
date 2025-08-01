import { Event } from "../models/event.model.js";
import { Booking } from "../models/booking.model.js"; // ✅ Added to calculate booked seats
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateEventId } from "../utils/generateEventID.js";

// =======================
// @desc    Create new event (Admin)
// @route   POST /api/events
// @access  Private/Admin

export const createEvent = async (req, res) => {
  try {
    const { title, description, category, location, date, capacity } = req.body;

    // Validate required fields
    if (!title || !category || !location || !date || !capacity) {
      return res.status(400).json(new ApiError(400, "Missing required fields"));
    }

    const eventId = generateEventId(); // Generate a short ID like EVT-XYZ

    // Create new event document
    const newEvent = await Event.create({
      title,
      description,
      category,
      location,
      date,
      capacity,
      eventId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newEvent, "Event created successfully"));
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

// =======================
// @desc    Get all events (with seats info)
// @route   GET /api/events
// @access  Public

export const getAllEvents = async (req, res) => {
  try {
    const { category, location, startDate, endDate } = req.query;

    let query = {};

    // Optional filters
    if (category) query.category = category;
    if (location) query.location = location;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Fetch events
    const events = await Event.find(query).sort({ date: 1 });

    // For each event, calculate total booked seats
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({ event: event._id });
        const totalSeatsBooked = bookings.reduce((sum, b) => sum + b.seats, 0);

        return {
          ...event.toObject(),
          totalSeatsBooked, // ✅ Added field
          remainingSeats: event.capacity - totalSeatsBooked, // ✅ Added field
        };
      })
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, enrichedEvents, "Events fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json(new ApiError(500, "Failed to fetch events"));
  }
};

// =======================
// @desc    Get single event by ID (with seats info)
// @route   GET /api/events/:id
// @access  Public

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json(new ApiError(404, "Event not found"));
    }

    // Get total seats booked for this event
    const bookings = await Booking.find({ event: event._id });
    const totalSeatsBooked = bookings.reduce((sum, b) => sum + b.seats, 0);

    const enrichedEvent = {
      ...event.toObject(),
      totalSeatsBooked, // ✅ Added field
      remainingSeats: event.capacity - totalSeatsBooked, // ✅ Added field
    };

    return res
      .status(200)
      .json(new ApiResponse(200, enrichedEvent, "Event details fetched"));
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json(new ApiError(500, "Failed to fetch event"));
  }
};

// =======================
// @desc    Update an event (Admin)
// @route   PUT /api/events/:id

export const updateEvent = async (req, res) => {
  try {
    const updates = req.body;
    const event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!event)
      return res.status(404).json(new ApiError(404, "Event not found"));

    return res
      .status(200)
      .json(new ApiResponse(200, event, "Event updated successfully"));
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json(new ApiError(500, "Update failed"));
  }
};

// =======================
// @desc    Delete an event (Admin)
// @route   DELETE /api/events/:id

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event)
      return res.status(404).json(new ApiError(404, "Event not found"));

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Event deleted successfully"));
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json(new ApiError(500, "Deletion failed"));
  }
};
