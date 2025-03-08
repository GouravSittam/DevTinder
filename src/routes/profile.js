const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validatePasswordUpdate } = require("../utils/validation");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);
    const loggedInUser = req.user;
    await User.findByIdAndUpdate(loggedInUser._id, req.body, {
      runValidators: true,
    });

res.json({
      message: `${loggedInUser.firstName} your profile is updates successfully`,
      data: loggedInUser,
    });  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    validatePasswordUpdate(req);
    const loggedInUser = req.user;
    loggedInUser.password = req.body.password;
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} your password is updated successfully`,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
