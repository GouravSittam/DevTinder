const express = require("express");
const authRouter = require("./auth");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");
const { jaccardSimilarity } = require("../utils/helpers");
const userRouter = express.Router();

const USER_SAFE_DATA = "_id firstName lastName photoURL age gender about skills";

// get all the pending connection request for the loggedIn user
userRouter.get("/user/request/received", userAuth, async (req, res)=>{
    try{
        const loggedInUser= req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        res.send({message: "Data fetched successfully", data: connectionRequests});
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA); // Populate toUserId

        const getUserConnections = (connectionRequests, loggedInUser) => {
            const userSet = new Set(); // To store unique user objects
            return connectionRequests
                .map(row => 
                    row.fromUserId._id.toString() === loggedInUser._id.toString()
                        ? row.toUserId // If `fromUserId` is logged in user, return `toUserId`
                        : row.fromUserId // Else, return `fromUserId`
                )
                .filter(user => {
                    if (user && user._id && !userSet.has(user._id.toString())) {
                        userSet.add(user._id.toString());
                        return true;
                    }
                    return false;
                }); // Ensure only unique user objects are returned
        };
        
        // Example usage:
        const data = getUserConnections(connectionRequests, loggedInUser);
        res.json({ data: data });
        
    }
    catch(err){
        res.status(400).send({message: err.message});
    }
})

// Feed Api/router
userRouter.get("/feed", userAuth, async (req, res) => {
  // User should see all theuser cards except
  // 1. User itself
  // 2. User's connections
  // 3. User's pending requests
  // 4. User's rejected requests
  // 5. User's blocked users
  // 6.  ignored people

  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // ✅ FIX: This block of code needs to be active to define hideUsersFromFeed.
    // Find all connection requests (sent + received)
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // 1. Fetch ALL potential users that are not excluded
    const potentialUsers = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } }, // Now this line will work
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA + " skills");

    // 2. Calculate Jaccard similarity for each user
    const usersWithSimilarity = potentialUsers.map((user) => {
      const similarity = jaccardSimilarity(
        loggedInUser.skills || [],
        user.skills || []
      );
      return { ...user.toObject(), similarity: similarity };
    });

    // 3. Sort by similarity in descending order
    usersWithSimilarity.sort((a, b) => b.similarity - a.similarity);

    // 4. Apply pagination to the *sorted* array
    const paginatedUsers = usersWithSimilarity.slice(skip, skip + limit);

    res.json({ data: paginatedUsers });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;