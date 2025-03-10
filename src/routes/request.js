const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionReqModel = require("../models/connectionReq");
const User = require("../models/user");
const mongoose = require("mongoose");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // Validate toUserId
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({
          message: "Invalid user ID: " + toUserId,
        });
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      // Check if there is an existing connection request
      const existingRequest = await ConnectionReqModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).json({
          message: "Connection request already exists!!",
        });
      }

      const connectionReq = new ConnectionReqModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionReq.save();

      res.json({
        message: "Connection request sent",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
