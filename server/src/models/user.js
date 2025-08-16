const mongoose = require("mongoose");
const validator= require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 60,
    },
    lastName: {
      type: String,
    },

    emailId: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid Email address "+value);
        }
      }
    },
    password: {
      type: String,
      required: true,
      validator(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Enter a Strong Password: "+ value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other","Male", "Female", "Other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    skills: {
      type: [String],
    },
    photoURL: {
      type: String,
      validate(value){
        if(!validator.isURL(value)){
          throw new Error ("Invalid photo Url "+ value)
        }
      },
      default: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
    },
    about: {
      type: String, 
    },
    createdAt:{
        type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT= async function(){
  const user = this;
  const token = await jwt.sign({_id: user._id}, "DEV@CONNECT123", {expiresIn: "1h"});
  return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
