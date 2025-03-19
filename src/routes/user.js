const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionReqModel = require("../models/connectionReq");

const userRouter = express.Router();
const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "about",
  "skills",
];

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionReqModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

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

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionReqModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Data Fetched Successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error while fetching connections: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {

    //user should see al the user cards erxcept
    //his own card and the cards 
    //his connections
    //ignored people
    // alredyt sent request
    //accepted request
    //rejected request
    //pending request
    //interested request

  } catch (err) {
    res
      .status(400)
      .json({ message: "Error while fetching feed: " + err.message });
  }
});

module.exports = userRouter;
