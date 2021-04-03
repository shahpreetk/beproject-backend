const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const BTurf = require("../models/bTurf");
const time = require("./time.json");

function AllTime(allTimings) {
  time.map((timing) => allTimings.push(timing.time));
  return allTimings;
}

function BookedTime(bAudi, bookedTimings) {
  bAudi.map((booking) => bookedTimings.push(booking.time));
  return bookedTimings;
}

function AvailableTime(allTimings, bookedTimings, availableTimings) {
  availableTimings = allTimings.filter(
    (element) => !bookedTimings.includes(element)
  );
  return availableTimings;
}

router.post("/bturfs", auth, async (req, res) => {
  const bTurf = new BTurf({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await bTurf.save();
    res.status(201).send(bTurf);
  } catch (e) {
    res.status(400).json({ msg: "Failed to book turf" });
  }
});

router.get("/bturfs", auth, async (req, res) => {
  BTurf.find({ owner: req.user._id })
    .sort({ date: 1 })
    .then((bturfs) => {
      res.status(200).send(bturfs);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/bturfs/:date", async (req, res) => {
  const date = req.params.date;
  try {
    const bTurf = await BTurf.find({ date });
    let allTimings = [];
    let bookedTimings = [];
    const availableTimings = [];
    AllTime(allTimings);
    if (bTurf.length === 0) {
      res.status(200).send(allTimings);
    } else {
      BookedTime(bTurf, bookedTimings);
      const result = await AvailableTime(
        allTimings,
        bookedTimings,
        availableTimings
      );
      res.status(200).send(result);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/bturfs/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const bTurf = await BTurf.findOne({ _id, owner: req.user._id });
    if (!bTurf) {
      return res.status(404).send();
    }
    res.send(bTurf);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/bturfs/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["date", "starttime", "endtime"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const bTurf = await BTurf.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!bTurf) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      bTurf[update] = req.body[update];
    });

    await bTurf.save();
    res.send(bTurf);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/bturfs/:id", auth, async (req, res) => {
  try {
    const bTurf = await BTurf.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!bTurf) {
      return res.status(404).send();
    }
    res.send(bTurf);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
