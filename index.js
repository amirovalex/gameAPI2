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

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const clients = {};

let players = {};
let unmatched;

io.on("connection", function (socket) {
  let id = socket.id;

  console.log("New client connected. ID: ", socket.id);
  clients[socket.id] = socket;

  socket.on("disconnect", () => {
    console.log("Client disconnected. ID: ", socket.id);
    delete clients[socket.id];
    socket.broadcast.emit("clientdisconnect", id);
  });

  join(socket); // Fill 'players' data structure

  if (opponentOf(socket)) {
    socket.emit("game.begin", {
      symbol: players[socket.id].symbol,
    });
    console.log("Game begins!!");

    opponentOf(socket).emit("game.begin", {
      symbol: players[opponentOf(socket).id].symbol,
    });
  }

  socket.on("make.move", function (data) {
    if (!opponentOf(socket)) {
      return;
    }

    socket.emit("move.made", data);

    opponentOf(socket).emit("move.made", data);
  });

  socket.on("disconnect", function () {
    if (opponentOf(socket)) {
      opponentOf(socket).emit("opponent.left");
    }
  });
});

const join = (socket) => {
  players[socket.id] = {
    opponent: unmatched,
    symbol: "X",
    socket: socket,
  };

  if (unmatched) {
    players[socket.id].symbol = "O";
    players[unmatched].opponent = socket.id;
    unmatched = null;
  } else {
    unmatched = socket.id;
  }
};

const opponentOf = (socket) => {
  if (!players[socket.id].opponent) {
    return;
  }
  return players[players[socket.id].opponent].socket;
};

io.on("connection", (socket) => {
  let id = socket.id;

  console.log("a user connected");
  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", `${id} said ${message}`);
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
