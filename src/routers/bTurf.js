const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const BTurf = require("../models/bTurf");

router.post("/bturfs", auth, async (req, res) => {
  const bTurf = new BTurf({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await bTurf.save();
    res.status(201).send(bTurf);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.get("/bturfs", auth, async (req, res) => {
//   const match = {};
//   const sort = {};

//   if (req.query.completed) {
//     match.completed = req.query.completed === "true";
//   }

//   if (req.query.sortBy) {
//     const parts = req.query.sortBy.split(":");
//     sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
//   }
//   try {
//     await req.user.populate({
//       path: "bturfs",
//       match,
//       options: {
//         limit: parseInt(req.query.limit),
//         skip: parseInt(req.query.skip),
//         sort,
//       },
//     });
//     res.send(req.user.bturfs);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.get("/bturfs/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const bTurf = await BTurf.findOne({ _id, owner: req.user._id });
    if (!bTurf) {
      return res.status(404).send();
    }
    res.send(bTurf);
  } catch {
    (e) => res.status(500).send();
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
