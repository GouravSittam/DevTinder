require("dotenv").config();
const express = require("express");
const connectionDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  //creating a new instance of user model
  const user = new User(req.body);

  // const user = new User({
  //   firstName: "Kunal",
  //   lastName: "Pathakkk",
  //   emailID: "kp@gmail.com",
  //   password: "KP@12345",
  // });
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.send(400).send("Error while adding user" + err.message);
  }
});

//Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailID;

  try {
    const users = await User.find({ emailID: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Error while fetching user: " + err.message);
  }
});

//Feed api - get /feed -- get al the uders from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Something went Wrong");
  }
});

//Delete API
app.delete("/user",async(req,res)=>{
  const userId=req.body.userid;
  try{
    const user=await User.findByIdAndDelete({_id: userId});
  }
  catch(err){
    res.status(500).send("Error while deleting user: ");
  }
})

connectionDB()
  .then(() => {
    console.log("Database connected successfully✅✅");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777⭐⭐");
    });
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
