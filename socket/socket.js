const clients = {};

let players = {};
let unmatched;

const connectToSocket = (io) => {
  return io.on("connection", (socket) => {
    let id = socket.id;

    console.log("New client connected. ID: ", socket.id);
    clients[socket.id] = socket;

    socket.on("disconnect", () => {
      console.log("Client disconnected. ID: ", socket.id);
      delete clients[socket.id];
      socket.broadcast.emit("clientdisconnect", id);
    });

    joinRoom(socket); // Fill 'players' data structure

    if (opponentOf(socket)) {
      socket.emit("game.begin", {
        symbol: players[socket.id].symbol,
      });
      console.log("Game begins!!");

      opponentOf(socket).emit("game.begin", {
        symbol: players[opponentOf(socket).id].symbol,
      });
    }

    socket.on("make.move", (data) => {
      if (!opponentOf(socket)) {
        return;
      }

      socket.emit("move.made", data);

      opponentOf(socket).emit("move.made", data);
    });

    socket.on("disconnect", () => {
      if (opponentOf(socket)) {
        opponentOf(socket).emit("opponent.left");
      }
    });
  });
};

const joinRoom = (socket) => {
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

module.exports = connectToSocket;
