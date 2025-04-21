const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const userModel = require("../models/user");
const profileRouter= express.Router();
const bcrypt = require("bcryptjs");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth , async(req, res)=>{

    try{
        const user = req.user;
        res.send(user)
        
    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) =>loggedInUser[key]=req.body[key]);
        await loggedInUser.save();

        res.json({message: `${loggedInUser.firstName}, your pofile edited successfully`, data: loggedInUser});
    }catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
});

profileRouter.patch("/profile/password", userAuth, async(req, res)=>{
    try{
        const newPassword = req.body.password;
        const user = req.user;
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Enter a strong Password");
        }
        const isSamePassword = await bcrypt(newPassword, user.password);
        if(isSamePassword){
            throw new Error("New password cannot be same as old password");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({message: "Password changed successfully"})

    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }

    // try{
    //     if(!validateEditProfileData(req)){
    //         throw new Error("Invalid Edit Request");
    //     }

    //     const loggedInUser = req.user;

    //     Object.keys(req.body).forEach((key) =>loggedInUser[key]=req.body[key]);
    //     await loggedInUser.save();

    //     res.json({message: `${loggedInUser.firstName}, your pofile edited successfully`, data: loggedInUser});
    // }catch(err){
    //     res.status(400).send("ERROR: "+ err.message)
    // }
});

module.exports = profileRouter;