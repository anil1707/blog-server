const mongoose = require("mongoose");

userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      reqired: true,
    },
  },
  {
    timestamps: true,
  }
);

const user = new mongoose.model("user", userSchema);

module.exports = user;
