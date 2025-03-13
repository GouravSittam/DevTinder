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

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionReq = this;
  // Check if the fromUserId is the same as toUserId
  if (
    connectionReq.fromUserId.toString() === connectionReq.toUserId.toString()
  ) {
    return next(new Error("fromUserId and toUserId cannot be the same"));
  }
  next();
});

const ConnectionReqModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionReqModel;
