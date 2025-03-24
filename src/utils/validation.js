const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailID, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid!");
  } else if (!validator.isEmail(emailID)) {
    throw new Error("Email is not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailID",
    "about",
    "photoURL",
    "gender",
    "age",
    "skills",
  ];

  
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) {
    throw new Error("Update not allowed");
  }
};

const validatePasswordUpdate = (req) => {
  const { password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};
module.exports = { validateSignUpData, validateEditProfileData ,validatePasswordUpdate};