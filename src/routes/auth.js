const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailID, password } = req.body;
    //Encrypting the password
    const passwordHash = await bcrypt.hash(password, 9);
    // console.log(passwordHash);

    //creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailID,
      password: passwordHash,
      //req.body
    });

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      //Create a JWT Token
      // const token = await jwt.sign({ _id: user._id }, "Gourav$15", {
      //   expiresIn: "1d",
      // });

      const token = await user.getJWT();
      // console.log(token);

      //Add the token to cookie and send the response back the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 4 * 360000),
      });
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successfull");
});

module.exports = authRouter;
