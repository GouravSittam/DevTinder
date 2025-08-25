const express = require("express");
const authRouter = express.Router();
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation.js");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user");
const redisClient = require("../config/redis.js");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth.js");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

authRouter.get("/config/google-client-id", (req, res) => {
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
});

authRouter.post("/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) throw new Error("No Google idToken provided");

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Try to find user by email
    let user = await userModel.findOne({ emailId: payload.email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new userModel({
        firstName: payload.given_name,
        lastName: payload.family_name,
        emailId: payload.email,
        password: await bcrypt.hash(payload.sub, 10), // Use Google sub as password hash
        photoURL: payload.picture,
        skills: [],
        about: "",
      });
      await user.save();
    }

    // Issue JWT and set cookie
    res.clearCookie("token");
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000),
    });

    res.json({ message: "Login/Signup Successful!", data: user });
  } catch (err) {
    res.status(400).send("Error with Google auth: " + err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, skills, photoURL, about } =
      req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new userModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      skills,
      photoURL,
      about,
    });
    const savedUser = await user.save();

    res.clearCookie("token");

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000), // 1 hour from now
    });
    res.json({ message: "User Added Successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);

    const { emailId, password } = req.body;

    const user = await userModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      res.clearCookie("token");

      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000),
      });

      console.log("Login Successful");
      res.send(user);
    } else {
      throw new Error("Password is incorrect");
    }
  } catch (err) {
    res.status(400).send("Error in login: " + err.message);
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const payload = jwt.decode(token);

    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expire(`token:${token}`, payload.exp);

    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = authRouter;