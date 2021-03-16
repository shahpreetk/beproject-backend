const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const bookingsRouter = require("./routers/booking");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(bookingsRouter);

module.exports = app;
