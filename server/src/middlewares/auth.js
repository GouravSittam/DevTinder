const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const redisClient = require("../config/redis");

const userAuth= (async (req, res, next)=>{
    try{
    // Read tokens from req.cookies
    const cookie = req.cookies;
    const {token} = cookie;

    if(!token) return res.status(401).send("Invalid token");

    //                                 Private key set by developer/myself
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const {_id}= decodedObj;

    const user = await userModel.findById(_id);

    if(!user) throw new Error("user not found")
    
    // Check if the user is blocked
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
        throw new Error("Access denied. User is blocked. Invalid token.");
    }

    req.user = user;
    next();

    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }

})

module.exports= {
    userAuth,  
}