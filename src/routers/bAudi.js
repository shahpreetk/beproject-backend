const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const BAudi = require("../models/bAudi");

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

// router.get("/baudis", auth, async (req, res) => {
//   const match = {};
//   const sort = {};

//   if (req.query.sortBy) {
//     const parts = req.query.sortBy.split(":");
//     sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
//   }
//   try {
//     await req.user.populate({
//       path: "baudis",
//       match,
//       options: {
//         limit: parseInt(req.query.limit),
//         skip: parseInt(req.query.skip),
//         sort,
//       },
//     });
//     res.send(req.user.bAudis);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

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

router.patch("/baudis/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["date", "starttime", "endtime"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const bAudi = await BAudi.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!bAudi) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      bAudi[update] = req.body[update];
    });

    await bAudi.save();
    res.send(bAudi);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/baudis/:id", auth, async (req, res) => {
  try {
    const bAudi = await BAudi.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!bAudi) {
      return res.status(404).send();
    }
    res.send(bAudi);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
