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
      type: String,
    },
    catering: {
      type: String,
    },
    podium: {
      type: String,
    },
    music: {
      type: String,
    },
    less100: {
      type: String,
    },
    backstage: {
      type: String,
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
