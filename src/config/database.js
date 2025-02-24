const mongoose = require("mongoose");

const connectionDB = async () => {
  await mongoose.connect(
    "mongodb+srv://gouravsittam:BixBie2C7oFv2j4Z@devspark.yx5wf.mongodb.net/devTinder"
  );
};

connectionDB()
    .then(() => {
        console.log("Database connected successfully....");
    })
    .catch((err) => {
        console.error("Database connection failed");
    });

// mongoose.connect(
//   "mongodb+srv://gouravsittam:BixBie2C7oFv2j4Z@devspark.yx5wf.mongodb.net/"
// );
