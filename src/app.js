// //

// require("dotenv").config();
// const express = require("express");
// const connectionDB = require("./config/database");
// const app = express();
// const User = require("./models/user");

// app.use(express.json());

// app.post("/signup", async (req, res) => {
//   //creating a new instance of user model
//   const user = new User(req.body);

//   try {
//     await user.save();
//     res.send("User added successfully");
//   } catch (err) {
//     res.status(400).send("Error while adding user: " + err.message);
//   }
// });

// //Get user by email
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailID;

//   try {
//     const users = await User.find({ emailID: userEmail });
//     if (users.length === 0) {
//       return res.status(404).send("User not found");
//     }
//     res.send(users);
//   } catch (err) {
//     res.status(500).send("Error while fetching user: " + err.message);
//   }
// });

// //Feed api - get /feed -- get all the users from the database
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(500).send("Error while fetching users: " + err.message);
//   }
// });

// //Delete API user for database
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     const user = await User.findByIdAndDelete(userId);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(500).send("Error while deleting user: " + err.message);
//   }
// });

// //update data of the user
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = ["photoURL", "about", "gender", "skills", "age"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       return res.status(400).send("Update not Allowed");
//     }

//     if (data?.skills.length > 10) {
//       return res.status(400).send("Skills cannot be more than 10");
//     }

//     await User.findByIdAndUpdate({ _id: userId }, data, {
//       runValidators: true,
//     });
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(500).send("Error while updating user: " + err.message);
//   }
// });

// connectionDB()
//   .then(() => {
//     console.log("Database connected successfully✅✅");
//     app.listen(7777, () => {
//       console.log("Server is successfully listening on port 7777⭐⭐");
//     });
//   })
//   .catch((err) => {
//     console.error("Database connection failed: " + err.message);
//   });

require("dotenv").config();
const express = require("express");
const connectionDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpDate } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allow these HTTP methods
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// //Get user by email
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailID;

//   try {
//     const users = await User.find({ emailID: userEmail });
//     if (users.length === 0) {
//       return res.status(404).send("User not found");
//     }
//     res.send(users);
//   } catch (err) {
//     res.status(500).send("Error while fetching user: " + err.message);
//   }
// });

// //Feed api - get /feed -- get all the users from the database
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(500).send("Error while fetching users: " + err.message);
//   }
// });

// //Delete API user for database
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     const user = await User.findByIdAndDelete(userId);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(500).send("Error while deleting user: " + err.message);
//   }
// });

// //update data of the user
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = ["photoURL", "about", "gender", "skills", "age"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       return res.status(400).send("Update not Allowed");
//     }

//     if (data.skills && data.skills.length > 10) {
//       return res.status(400).send("Skills cannot be more than 10");
//     }

//     await User.findByIdAndUpdate({ _id: userId }, data, {
//       runValidators: true,
//     });
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(500).send("Error while updating user: " + err.message);
//   }
// });

connectionDB()
  .then(() => {
    console.log("Database connected successfully✅✅");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777⭐⭐");
    });
  })
  .catch((err) => {
    console.error("Database connection failed: " + err.message);
  });
