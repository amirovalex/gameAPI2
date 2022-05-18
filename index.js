const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./routes/user.js");
const connectToSocket = require("./socket/socket");

//EXPRESS APP
const app = express();
const port = process.env.PORT || 7070;

//MIDDLEWARES
app.use(cors({ origin: "https://amirovalex.github.io/game/" }));
app.use(express.json());
app.use("/", userRoutes);

//NODE SERVER
const http = require("http");
const server = http.createServer(app);

//Initialize socket
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const run = async () => {
  try {
    connectToSocket(io);
    server.listen(port, () => {
      console.log(`server is listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

run();
