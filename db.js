const mongoose = require("mongoose");
let dotenv = require('dotenv')
dotenv.config()
function connectDB() {
  mongoose
    .connect(process.env.CONNECTTION_URL)
    .then(() => console.log("Connected!"))
    .catch((error)=>{
      console.log("connection error :", error);
    });
}
module.exports = connectDB;