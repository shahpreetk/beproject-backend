const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Booking = require("../models/booking");

router.post("/bookings", auth, async (req, res) => {
  const booking = new Booking({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await booking.save();
    res.status(201).send(booking);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/bookings", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    await req.user
      .populate({
        path: "bookings",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.bookings);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/bookings/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const booking = await Booking.findOne({ _id, owner: req.user._id });
    if (!booking) {
      return res.status(404).send();
    }
    res.send(booking);
  } catch {
    (e) => res.status(500).send();
  }
});

router.patch("/bookings/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!booking) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      booking[update] = req.body[update];
    });

    await booking.save();
    res.send(booking);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/bookings/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!booking) {
      return res.status(404).send();
    }
    res.send(booking);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
