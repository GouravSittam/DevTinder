const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong Password in validation");
  }
};

const validateLoginData = (req) => {
  const {emailId, password} = req.body; 

  if(!validator.isEmail(emailId)){
    throw new Error("Incorrect Email Address");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Incorrect Password");
  }
}

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName", 
    "photoURL",
    "gender", 
    "age",
    "skills",
    "about"
  ]
  const isEditAllowed = Object.keys(req.body).every((k)=> allowedEditFields.includes(k))

  return isEditAllowed;
}

module.exports = { validateSignUpData, validateLoginData,validateEditProfileData };
