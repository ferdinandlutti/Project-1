const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // name: { type: String, required: true },
    // surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true, default: "user" },
    profilePicture: { type: String },
  },
  { strictQuery: false, timestamps: true }
);
module.exports = mongoose.model("user", userSchema);

// role: {
//   type: String,
//   required: true,
//   enum: ["user", "instructor"],
//   default: "user",
// },
// profilePicture: { type: String, default: "default-profile.jpg" },
// location: { type: String, default: "" },

// Instructor-specific fields
//   classSchedule: [{ type: mongoose.Schema.Types.ObjectId, ref: "class" }],
//   rating: { type: Number, default: 0, min: 0, max: 5 },
//   bio: { type: String, default: "" },
