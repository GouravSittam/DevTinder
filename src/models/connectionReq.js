const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function () {
  const connectionReq = this;
  //check if the fromuserid is same as touserId
  if (
    connectionReq.fromUserId.toString() === connectionReq.toUserId.toString()
  ) {
    throw new Error("fromUserId and toUserId cannot be the same");
  }
  next();
});

const ConnectionReqModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionReqModel;
