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

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777.");
});
