const mongoose = require("mongoose");

const bAudiSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      trim: true,
    },
    starttime: {
      type: String,
      required: true,
    },
    endtime: {
      type: String,
      required: true,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    catering: {
      type: Boolean,
      default: false,
    },
    podium: {
      type: Boolean,
      default: false,
    },
    music: {
      type: Boolean,
      default: false,
    },
    less100: {
      type: Boolean,
      default: false,
    },
    backstage: {
      type: Boolean,
      default: false,
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
