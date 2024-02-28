let jwt = require("jsonwebtoken");
let JWT_SECRET_KEY = "ANILKUMARYADAV";

const verifyUser = async (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) {
      // console.log("Main eror", err)
      req.jwt = {error:"jwt must be provided"}
    }
    req.userInfo = info;
  });
  next();
};

module.exports = { verifyUser };
