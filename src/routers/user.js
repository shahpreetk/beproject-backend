// @ts-check
const express = require("express");
const auth = require("../middleware/auth");
// @ts-ignore
const router = new express.Router();
const User = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");
// @ts-ignore
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../emails/account");
const { validateCartItems } = require("use-shopping-cart/src/serverUtil");

router.post("/checkout-sessions", createCheckoutSession);
router.get("/checkout-sessions/:sessionId", getCheckoutSession);

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // @ts-ignore
    sendWelcomeEmail(user.email, user.name);
    // @ts-ignore
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).json({ msg: "User Registration Failed" });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    // @ts-ignore
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).json({ msg: "Invalid Credentials" });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancellationEmail(req.user);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({
      error: error.message,
    });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // @ts-ignore
    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    // @ts-ignore
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

async function createCheckoutSession(req, res) {
  console.log("stripe-routes.js 9 | route reached", req.body);
  let { amount, id } = req.body;
  console.log("stripe-routes.js 10 | amount and id", amount, id);
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "INR",
      description: "Your Company Description",
      payment_method: id,
      confirm: true,
    });
    console.log("stripe-routes.js 19 | payment", payment);
    res.json({
      message: "Payment Successful",
      success: true,
    });
    // @ts-ignore
    res.status(200).json(checkoutSession);
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
}

async function createCheckoutSession(req, res) {
  const domainURL = req.headers.referer;

  const { quantity, locale, amount, email } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    locale: locale,
    customer_email: email,
    line_items: [
      {
        name: "KJSIEIT",
        images: [
          "https://kjsieit.somaiya.edu.in/assets/kjsieit/images/infra/blg.jpg",
        ],
        quantity: quantity,
        currency: "INR",
        amount: amount,
      },
    ],
    success_url: `${domainURL}booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}booking/checkout`,
  });

  res.send({
    sessionId: session.id,
  });
}

async function getCheckoutSession(req, res) {
  const { sessionId } = req.params;

  try {
    if (!sessionId.startsWith("cs_")) {
      throw Error("Incorrect checkout session id");
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ["payment_intent"] }
    );
    res.status(200).json(checkout_session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = router;
