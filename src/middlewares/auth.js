const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  // Read the token from the req cookies
  // console.log("userAuth called");
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login first");
    }

    const decodedObj = jwt.verify(token, "Gourav$15");
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
