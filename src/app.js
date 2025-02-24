require("dotenv").config();
const express = require("express");
const connectionDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async(req, res) => {
  //creating a new instance of user model

  const user = new User({
    firstName: "Kunal",
    lastName: "Pathak",
    emailID: "kp@gmail.com",
    password: "KP@12345",
  });
  await user.save();
  res.send("User added successfully");
});

connectionDB()
  .then(() => {
    console.log("Database connected successfully✅✅");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777⭐⭐");
    });
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
