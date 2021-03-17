const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");
const bookingsRouter = require("./routers/booking");

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(bookingsRouter);

module.exports = app;
