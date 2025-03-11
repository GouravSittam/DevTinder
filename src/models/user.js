const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index:true,
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

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Gourav$15", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;

  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
