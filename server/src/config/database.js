// const mongoose = require("mongoose");
// require('dotenv').config()

// const connectDB = async () => {
//     await mongoose.connect(DB_URL)
// }

// module.exports = connectDB;

const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URL);
}

module.exports = connectDB;