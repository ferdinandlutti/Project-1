const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new mongoose.Schema(
  {
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "category",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // Consider specifying the unit (e.g., minutes)
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    selectedImage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("class", classSchema);
