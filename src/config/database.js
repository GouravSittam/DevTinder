const mongoose = require("mongoose");
require("dotenv").config();

const connectionDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};

module.exports = connectionDB;
