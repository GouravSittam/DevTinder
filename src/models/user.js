const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    lastName: {
      type: String,
    },
    emailID: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter A Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 12,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender Data is Not Valid");
        }
      },
    },
    photoURL: {
      type: String,
      default: "data:image/jpeg;base64,",
      validate(value) {
        if (value !== "data:image/jpeg;base64," && !validator.isURL(value)) {
          throw new Error("Invalid Photo URL " + value);
        }
      },
    },
    about: {
      type: String,
      default: "Hey there! I am using Social Media App",
    },
    skills: {
      type: [String],
      // validate(value) {
      //   if (value.length > 10) {
      //     throw new Error("Skills cannot be more than 10");
      //   }
      // },
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
