// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,  // Firebase UID
  },

  email: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    default: "",
  },

  role: {
    type: String,
    enum: ["customer", "provider"],
    default: "customer",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
