import mongoose, { Schema, model } from "mongoose";

// booking model

const bookingSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    seats: { type: Number, required: true, min: 1, max: 2 },
    bookingDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Booking = model("Booking", bookingSchema);

