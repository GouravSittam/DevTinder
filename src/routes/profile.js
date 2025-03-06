const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");


profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;
    // const { token } = cookies;
    const user = req.user;
    // Validate the token
    // if (!token) {
    //   throw new Error("Unauthorized Token");
    // }

    // const decodedMessage = await jwt.verify(token, "Gourav$15");
    // const { _id } = decodedMessage;
    // console.log("Logged in user is: " + _id);

    // Fetch the user from the database
    // const user = await User.findById(_id);
    // if (!user) {
    //   throw new Error("User not found");
    // }

    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
