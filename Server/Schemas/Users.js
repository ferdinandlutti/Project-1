const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["user", "instructor"],
    default: "user",
  },
  profilePicture: { type: String, default: "default-profile.jpg" },
  location: { type: String, default: "" },

  // Instructor-specific fields
  completedClassesCount: { type: Number, default: 0 },
  classSchedule: [{ type: mongoose.Schema.Types.ObjectId, ref: "class" }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  bio: { type: String, default: "" },
});
module.exports = mongoose.model("user", userSchema);
