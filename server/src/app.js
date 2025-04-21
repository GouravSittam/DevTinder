require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user");
const validator = require("validator");
// const {validateSignUpData, validateLoginData } = require("./utils/validation.js")
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const cors = require("cors");
require("./utils/cronjob.js");
const http = require("http");
const initilizeSocket = require("./utils/socket.js");
const chatRouter = require("./routes/chat.js");

const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);


app.get("/", async (req, res) => {
  res.send("hello from server");
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });

const server = http.createServer(app);
initilizeSocket(server);

server.listen(port, (req, res) => {
  console.log("Server is running at port " + port);
});
