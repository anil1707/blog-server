const express = require("express");
const { userRoute } = require("./router/userRoute");
const cors = require("cors");
const connectDB = require("./db");
const cookieParser = require('cookie-parser');
const { postRouter } = require("./router/postRoute");
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use('/uploads', express.static(__dirname+'/uploads'))
connectDB();
const PORT = 5000;
app.get("/", (req, res) => {
  console.log("hello");
  res.send({ result: "hello" });
});

app.use(cors({credentials:true}));

app.use("/user", userRoute);
app.use("/post", postRouter)

app.listen(PORT, (err) => {
  if (err) {
    console.log("Something is wrong");
  } else {
    console.log(`Server is running on PORT http://localhost:${PORT}`);
  }
});
