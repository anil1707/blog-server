const user = require("../model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let JWT_SECRET_KEY = "ANILKUMARYADAV";
const loginController = async (req, res) => {
  try {
    let email = req.body.email;
    let pass = req.body.password;
    let exist = await user.find({ email: email });
    let rightUser;
    if (exist.length !== 0)
      rightUser = await bcrypt.compare(pass, exist[0].password);
    if (exist.length === 0 && (email !== "" || pass !== "")) {
      res.json({ message: "User doesn't exist, please register first!" });
    } else {
      if (email == "" || pass == "") {
        res.json({ message: "Please fill required field carefully!" });
      } else {
        if (rightUser) {
          jwt.sign(
            { email, password: pass },
            JWT_SECRET_KEY,
            { expiresIn: "1h" },
            (err, token) => {
              if (err) throw err;
              res
                .cookie("token", token, {
                  domain: ".netlify.app", // or 'localhost' during development
                  path: "/",
                  secure: true, // only set this to true if using HTTPS
                  httpOnly: true, // recommended for security
                  sameSite: "None", // required for cross-origin requests
                })
                .json({ message: "Logged in successfully!" });
            }
          );
        } else {
          res.json({ message: "Email or Password is wrong!" });
        }
      }
    }
  } catch (error) {
    res.send({ Error: error });
  }
};

const registerController = async (req, res) => {
  try {
    let data = req.body;
    const registeredUser = await user.find({ email: data.email });
    const bcryptedPassword = await bcrypt.hash(data.password, 10);
    if (registeredUser.length !== 0) {
      return res.status(400).send({ message: "Already registered!" });
    } else {
      if (
        data.email === "" ||
        data.password === "" ||
        data.confirmPassword === "" ||
        data.userName === ""
      ) {
        return res
          .status(400)
          .json({ message: "Please fill required field carefully!" });
      }

      if (data.password !== data.confirmPassword) {
        return res
          .status(400)
          .json({ message: "Password and confirm password not matched" });
      }
      data.password = bcryptedPassword;
      const collection = await user(data);
      let result = await collection.save();
      res.send({ message: "successfully registered", user: result });
    }
  } catch (error) {
    console.log(error);
  }
};

let profileController = async (req, res) => {
  try {
    const userInfo = req.userInfo;
    if (req.jwt?.error) {
      return res.send({ Error: "Please sign in" });
    }
    if (!userInfo) {
      res.send({ message: "failed to load" });
    }
    let userDetail = await user.find({ email: userInfo?.email });
    if (userDetail.length > 0) userDetail = userDetail[0];
    if (userDetail) {
      res.json({
        userData: {
          email: userInfo.email,
          userName: userDetail.userName,
          email: userDetail.email,
          firstName: userDetail.firstName,
          lastName: userDetail.lastName,
          logo: userDetail.pic,
          userId: userDetail._id,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

let profileOtherUserController = async (req, res) => {
  const { email } = req.params;
  const userDoc = await user.findOne({ email });
  const dataToSend = {
    firstName: userDoc?.firstName,
    lastName: userDoc?.lastName,
    pic: userDoc?.pic,
    userName: userDoc?.userName,
    email: userDoc?.email,
  };
  res.send({ data: dataToSend });
};

const updateProfilePic = async (req, res) => {
  const userInfo = req.userInfo;
  if (req.params.email !== userInfo?.email) {
    return res.status(401).send({ message: "Invalid access" });
  }
  const userDoc = await user.find({ email: userInfo?.email });
  if (userDoc.length == 0) {
    return res.send({ message: "Invalid access" });
  }

  if (userDoc[0].email === userInfo?.email) {
    await user.updateOne(
      { email: userInfo?.email },
      {
        $set: {
          pic: req.body.pic,
        },
      }
    );

    let userD = await user.find({ email: userInfo?.email });
    res.send({ userD });
  }
};

let editProfileController = async (req, res) => {
  let { userName, firstName, lastName, email } = req.body;
  let userDetail = req.userInfo;
  if (userDetail?.email !== email) {
    return res.status(400).json({ message: "Invalid Access" });
  }

  await user.updateOne(
    { email },
    {
      $set: {
        userName,
        firstName,
        lastName,
      },
    }
  );
  res.send({ message: "Updated successfull" });
};

let logoutController = (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 900000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.send(req.cookies);
  } catch (error) {
    res.send({ Error: error });
  }
};

module.exports = {
  loginController,
  registerController,
  profileController,
  logoutController,
  editProfileController,
  profileOtherUserController,
  updateProfilePic,
};
