// @ts-check
const express = require("express");
// @ts-ignore
const router = new express.Router();
const auth = require("../middleware/auth");
const BAudi = require("../models/bAudi");
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

router.post("/baudis", auth, async (req, res) => {
  const bAudi = new BAudi({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await bAudi.save();
    res.status(201).send(bAudi);
  } catch (e) {
    res.status(400).json({ msg: "Failed to book auditorium" });
  }
});

router.get("/baudis", auth, async (req, res) => {
  BAudi.find({ owner: req.user._id })
    .sort({ created: 1 })
    .then((baudis) => {
      res.status(200).send(baudis);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/baudis/:date", async (req, res) => {
  const date = req.params.date;
  try {
    const bAudi = await BAudi.find({ date });
    let allTimings = [];
    let bookedTimings = [];
    const availableTimings = [];
    AllTime(allTimings);
    if (bAudi.length === 0) {
      res.status(200).send(allTimings);
    } else {
      BookedTime(bAudi, bookedTimings);
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

router.get("/baudis/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const bAudi = await BAudi.findOne({ _id, owner: req.user._id });
    if (!bAudi) {
      return res.status(404).send();
    }
    res.send(bAudi);
  } catch (e) {
    res.status(500).send(e);
  }
});

// router.patch("/baudis/:id", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["date", "starttime", "endtime"];
//   const isValidOperation = updates.every((update) => {
//     return allowedUpdates.includes(update);
//   });

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates" });
//   }

//   try {
//     const bAudi = await BAudi.findOne({
//       _id: req.params.id,
//       owner: req.user._id,
//     });

//     if (!bAudi) {
//       return res.status(404).send();
//     }
//     updates.forEach((update) => {
//       bAudi[update] = req.body[update];
//     });

//     await bAudi.save();
//     res.send(bAudi);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// router.delete("/baudis/:id", auth, async (req, res) => {
//   try {
//     const bAudi = await BAudi.findOneAndDelete({
//       _id: req.params.id,
//       owner: req.user._id,
//     });
//     if (!bAudi) {
//       return res.status(404).send();
//     }
//     res.send(bAudi);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

module.exports = router;
