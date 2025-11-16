const mongoose = require("mongoose");

const guidelineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Guideline = mongoose.model("Guideline", guidelineSchema);

module.exports = Guideline;
