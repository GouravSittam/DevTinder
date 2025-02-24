const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailID: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },  
  gender: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
