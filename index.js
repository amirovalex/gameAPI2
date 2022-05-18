const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./routes/user.js");

const app = express();
const port = process.env.PORT || 7070;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/", userRoutes);

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = new Server(server);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", `${socket.id} said ${message}`);
  });
});

const run = async () => {
  try {
    server.listen(port, () => {
      console.log(`server is listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

run();
