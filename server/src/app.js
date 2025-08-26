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
const redisClient = require("./config/redis.js");
const rateLimiter = require("./middlewares/rateLimiter.js");

const port = process.env.SERVER_PORT;

app.use(cors({
    origin: process.env.SERVER_ENV === 'production'
      ? [
          'http://devconnects.tech',
          'https://devconnects.tech',
          'http://www.devconnects.tech',
          'https://www.devconnects.tech',
          'http://20.244.50.103:5173',
          'http://20.244.50.103'
        ]
      : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter)

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);


app.get("/", async (req, res) => {
  res.send("hello from server");
});


const server = http.createServer(app);
initilizeSocket(server);

const initilizeConnection = async() => {
  try{
    await Promise.all([redisClient.connect(), connectDB()]);
    console.log("Database connected successfully along with redis")

    server.listen(port, (req, res) => {
      console.log("Server is running at port " + port);
    });

  }
  catch(err){
    console.log("Error: "+ err);
  }
}

initilizeConnection();

