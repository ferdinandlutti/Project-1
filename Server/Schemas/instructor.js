const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    bio: { type: String, required: true },
    location: { type: String, required: true },
    profilePicture: { type: String, required: false },
    completedClassesCount: { type: Number, default: 0 },
    classSchedule: [{ type: mongoose.Schema.Types.ObjectId, ref: "class" }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Instructor", instructorSchema);
