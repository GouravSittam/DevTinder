const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionReqModel = require("../models/connectionReq");

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionReqModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "skills",
    ]);

    res.json({
      message: "Data Fetched Successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res
      .status(400)
      .send("Error while fetching connection requests: " + err.message);
  }
});

module.exports = userRouter;
