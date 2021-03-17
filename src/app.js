const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");
const bAudiRouter = require("./routers/bAudi");
const bTurfRouter = require("./routers/bTurf");

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(bAudiRouter);
app.use(bTurfRouter);

module.exports = app;
