const express = require("express");
const {
  loginController,
  registerController,
  profileController,
  logoutController,
} = require("../controller/userController");

const userRoute = express.Router();

userRoute.post("/login", loginController);
userRoute.post("/register", registerController);
userRoute.get("/profile", profileController);
userRoute.post("/logout", logoutController);

module.exports = { userRoute };
