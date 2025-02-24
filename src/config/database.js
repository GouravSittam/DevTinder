const mongoose = require("mongoose");
require("dotenv").config();

const connectionDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};

module.exports = connectionDB;

// mongoose.connect(
//   "mongodb+srv://gouravsittam:BixBie2C7oFv2j4Z@devspark.yx5wf.mongodb.net/"
// );
