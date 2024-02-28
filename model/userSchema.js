const mongoose = require("mongoose");

userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dhubjv2sc/image/upload/v1708929900/djgpmo29tid0mkt0vn9z.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const user = new mongoose.model("user", userSchema);

module.exports = user;
