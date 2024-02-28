const express = require("express");
const { userRoute } = require("./router/userRoute");
const cors = require("cors");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const { postRouter } = require("./router/postRoute");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
let dotenv = require("dotenv");
dotenv.config();
const server = http.createServer(app);
const io = socketIO(server);

// io.on("connection", (socket) => {
//   console.log("connected user", socket);

//   socket.on("sentMessage", (data) => {
//     console.log("message from client", data);
//     io.emit("sentMessage", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });
// app.use(cors({ origin: 'https://calm-vacherin-91e18d.netlify.app', credentials: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
connectDB();
const PORT = process.env.PORT || 5000;

// Middleware to set CORS headers
app.use((req, res, next) => {
  // Allow the following HTTP methods
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  // Allow the following headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Allow credentials (if needed)
  res.header("Access-Control-Allow-Credentials", true);

  // Move to the next middleware
  next();
});
app.get("/", (req, res) => {
  res.send({ result: "Server is running..." });
});

app.use("/user", userRoute);
app.use("/post", postRouter);

server.listen(PORT, (err) => {
  if (err) {
    console.log("Something is wrong");
  } else {
    console.log(`Server is running on PORT http://localhost:${PORT}`);
  }
});
