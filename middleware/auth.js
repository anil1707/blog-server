let jwt = require("jsonwebtoken");
let JWT_SECRET_KEY = "ANILKUMARYADAV";

const verifyUser = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  jwt.verify(token, JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) {
      req.jwt = { error: "jwt must be provided", jwtError:err };
    }
    req.userInfo = info;
  });
  next();
};

module.exports = { verifyUser };
