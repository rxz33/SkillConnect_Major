// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },

  date: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "cancelled"],
    default: "pending",
  },

  notes: String
});

module.exports = mongoose.model("Booking", bookingSchema);
