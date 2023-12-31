const user = require("../model/userSchema");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let JWT_SECRET_KEY = 'ANILKUMARYADAV'
const loginController = async (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;
  let exist = await user.find({ email: email });
  let rightUser 
  if(exist.length !== 0)
    rightUser = await bcrypt.compare(pass, exist[0].password)
  if (exist.length === 0 && (email!=="" || pass !=="")) {
    res.json({ message: "User doesn't exist, please register first!" });
  } else {
    if (email == "" || pass == "") {
      res.json({ message: "Please fill all the filed carefully!" });
    } else {
      if (rightUser) {
        jwt.sign({email, password:pass}, JWT_SECRET_KEY, {}, (err, token)=>{
          if(err) throw err
          res.cookie('token', token).json({message:"Logged in successfully!"})
        })
      } else {
        res.json({ message: "Email or Password is wrong!" });
      }
    }
  }
};

const registerController = async (req, res) => {
  let data = req.body;
  const registeredUser = await user.find({ email: data.email });
  const bcryptedPassword = await  bcrypt.hash(data.password, 10)
  if (registeredUser.length !== 0) {
    res.send({ message: "Already registered!" });
  } else {
    if (
      data.email !== "" &&
      data.password !== "" &&
      data.confirmPassword !== ""
    ) {
      if (data.password === data.confirmPassword) {
        data.password = bcryptedPassword
        const token  = jwt.sign(data, JWT_SECRET_KEY)
        const collection = await user(data);
        let result = await collection.save();
        res.send({ message: "successfully registered", user: result });
      } else {
        res.send({ message: "Password and confirm password not matched" });
      }
    } else {
      res.send({ message: "Please fill all the field carefully!" });
    }
  }
};

let profileController = (req, res)=>{
  let {token} = req.cookies;
  if(token)
    jwt.verify(token, JWT_SECRET_KEY, {}, (err, info)=>{
    if(err) throw err
    res.json({email:info.email})
  }) 
  else {
    res.send({message:"failed to load"})
  }
}

let logoutController = (req, res)=>{
  res.cookie('token', "")
  res.send(req.cookies)
}

module.exports = { loginController, registerController, profileController, logoutController };
