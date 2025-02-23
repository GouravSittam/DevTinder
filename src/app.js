const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  res.send({ firstname: "Gobu", lastname: "Chaudhary" });
});

app.post("/user", (req, res) => {
  res.send("User created successfully");
});

app.delete("/user", (req, res) => {
  res.send("Delete user successfully");
});

//this will match all the HTTP methods API call to  /Test
app.use("/test", (req, res) => {
  res.send("Hello, hello!");
});

// Handle Auth Middleware for all GET, POST, etc. requests to /admin
app.use("/admin", (req, res, next) => {
  console.log("Admin auth is getting checked!!");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
});

app.get("/admin/getAllData", (req, res) => {
  res.send("Admin Data Sent");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Admin deleted a user");
});

app.use("/test", (req, res) => {
  res.send("HelloHello, hello!");
});


app.get("/userr", (req, res) => {
  try {
    // Logic of DB call and get user data
    throw new Error("Simulated DB error");
    res.send("User Data Sent");
  } catch (err) {
    console.error(err); // Log your error
    res.status(530).send("Some Error, contact support team");
  }
});

app.use("/",(err, req, res, next) => {
  if (err) {
    console.error(err); // Log your error
    res.status(500).send("Something went wrong");
  } else {
    next();
  }
});


app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777.");
});