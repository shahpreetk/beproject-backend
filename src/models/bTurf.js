const mongoose = require("mongoose");

const bTurfSchema = new mongoose.Schema(
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
    changing: {
      type: Boolean,
      default: false,
    },
    equipment: {
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

const BTurf = mongoose.model("BTurf", bTurfSchema);

module.exports = BTurf;
