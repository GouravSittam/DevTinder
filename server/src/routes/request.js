const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const requestRouter = express.Router();

const sendEmail = require("../utils/sendEmail");
const { find, findById } = require("../models/user");
const userModel = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    {
      try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const user= req.user;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
          // throw new Error("Invalid Status");
          return res
            .status(400)
            .json({ message: "Invalid status type: " + status });
        }

        // Check if the target user exists
      const toUser = await userModel.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

        const connectionRequest = new ConnectionRequestModel({
          fromUserId,
          toUserId,
          status,
        });

        const data = await connectionRequest.save();

      // Send an email notification
      const emailSubject = "New Friend Request";
      const emailBody = `You have received a new friend request from ${req.user.firstName} (${status}) to ${toUser.firstName}.`;
      const emailRes = await sendEmail.run(
        emailSubject,
        emailBody
      );

        res.json({ message: "Connection Request Sent Successfully!", data });
      } catch (err) {
        res.status(400).send("ERROR: " + err.message);
      }

    }
  }
);
 
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if(!connectionRequest){
        return res.status(400).json({message: "Invalid Request ID"});
      }

      connectionRequest.status=status;

      const data = await connectionRequest.save();

      res.json({message: "Connection Request Updated Successfully!", data});
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
