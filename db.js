const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect("mongodb+srv://yadavanil1707ax:nN1CATlIpXTlSnl5@cluster0.82rjn25.mongodb.net/")
    .then(() => console.log("Connected!"))
    .catch((error)=>{
      console.log("connection error :", error);
    });
}
module.exports = connectDB;