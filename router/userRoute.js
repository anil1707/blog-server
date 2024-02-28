const express = require("express");
const {
  loginController,
  registerController,
  profileController,
  logoutController,
  editProfileController,
  profileOtherUserController,
  updateProfilePic,
} = require("../controller/userController");
const { verifyUser } = require("../middleware/auth");

const userRoute = express.Router();

userRoute.post("/login", loginController);
userRoute.post("/register", registerController);
userRoute.get("/profile", verifyUser, profileController);
userRoute.get("/otherUserProfile/:email", profileOtherUserController);
userRoute.put("/editProfile", verifyUser, editProfileController);
userRoute.put("/editProfilePic/:email", verifyUser, updateProfilePic);
userRoute.post("/logout", logoutController);

module.exports = { userRoute };
