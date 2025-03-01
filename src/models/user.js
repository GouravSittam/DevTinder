const mongoose = require("mongoose");

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
    },
    password: {
      type: String,
      requried: true,
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
      default:
        "data:image/jpeg;base64,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",
    },
    about: {
      type: String,
      default: "Hey there! I am using Social Media App",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
