const mongoose = require("mongoose");

const imagesSchema = new mongoose.Schema(
  {
    pathname: { type: String, required: true },
    filename: { type: String, required: true },
  },
  { strictQuery: false }
);

module.exports = mongoose.model("image", imagesSchema);
