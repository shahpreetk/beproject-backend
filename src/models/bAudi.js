const mongoose = require("mongoose");

const bAudiSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
    },
    addons: {
      type: Array,
    },
    cost: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const BAudi = mongoose.model("BAudi", bAudiSchema);

module.exports = BAudi;
