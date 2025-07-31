import mongoose, { Schema, model } from "mongoose";
// event model

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    location: { type: String, enum: ["Online", "In-Person"], required: true },
    date: { type: Date, required: true },
    capacity: { type: Number, required: true },
    eventId: { type: String, required: true, unique: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

 export const Event = model("Event", eventSchema);
