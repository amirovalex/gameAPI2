const axios = require("axios").default;
const ioClient = require("socket.io-client");
const clients = {};

let players = {};
let unmatched;

const connectToSocket = (io) => {
  return io.on("connection", (socket) => {
    let id = socket.id;
    let url = socket.handshake.query.urlHost;
    let idOtherServer = socket.handshake.query.id;

    console.log(socket.handshake);
    console.log("New client connected. ID: ", socket.id);
    clients[socket.id] = socket;
    console.log("ID OTHER SERVER", idOtherServer);

    socket.on("disconnect", () => {
      console.log("Client disconnected. ID: ", socket.id);
      delete clients[socket.id];
      socket.broadcast.emit("clientdisconnect", id);
    });
    console.log(isUserOnOtherServer(socket));
    joinRoom(socket); // Fill 'players' data structure

    if (
      (opponentOf(socket) && isUserOnOtherServer(opponentOf(socket))) ||
      (unmatched && url !== "localhost:7070")
    ) {
      const secondAPI = ioClient(process.env.SOCKET_TWO_URL, {
        query: {
          id: id,
          urlHost: "localhost:7071",
        },
      });

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
        console.log(data);
        if (!opponentOf(socket)) {
          return;
        }

        secondAPI.emit("make.move", data);
        console.log("IS GAME OVER", isGameOver(data.board));
        if (isGameOver(data.board)) {
          console.log("hey");
          socket.emit("game.end", { winMessage: "You won!" });
          opponentOf(socket).emit("game.end", { winMessage: "You lost!" });
        }
        socket.emit("move.made", data);
        opponentOf(socket).emit("move.made", data);
      });

      socket.on("disconnect", () => {
        if (opponentOf(socket)) {
          opponentOf(socket).emit("opponent.left");
          secondAPI.emit("opponent.left");
        }
      });
      // secondAPI.emit("");
      console.log(url);
    } else {
      if (opponentOf(socket)) {
        socket.emit("game.begin", {
          symbol: players[socket.id].symbol,
        });
        console.log("Game begins!!");

        opponentOf(socket).emit("game.begin", {
          symbol: players[opponentOf(socket).id].symbol,
        });
      }
      console.log(
        "PLAAAAAYEEERS AFTER GAME BEGINS",
        players,
        "PLAAAAAYEEERS AFTER GAME BEGINS"
      );

      socket.on("make.move", (data) => {
        console.log(data);
        if (!opponentOf(socket)) {
          return;
        }

        if (isGameOver(data.board)) {
          console.log("hey");
          socket.emit("game.end", { winMessage: "You won!" });
          opponentOf(socket).emit("game.end", { winMessage: "You lost!" });
        }
        socket.emit("move.made", data);

        opponentOf(socket).emit("move.made", data);
      });

      socket.on("disconnect", () => {
        if (opponentOf(socket)) {
          opponentOf(socket).emit("opponent.left");
        }
      });
    }
  });
};

const joinRoom = (socket) => {
  console.log("room joined", socket.id);
  players[socket.id] = {
    opponent: unmatched,
    symbol: "X",
    socket: socket,
  };
  // console.log("what are the clients", clients);
  console.log("PLYAERS", players);
  if (unmatched) {
    players[socket.id].symbol = "O";
    players[unmatched].opponent = socket.id;
    unmatched = null;
  } else {
    unmatched = socket.id;
  }
};

const joinRoomOtherServer = (socket) => {
  console.log(
    "JOINED ROOM FROM OTHER SERVER",
    socket,
    "JOINED ROOM FROM OTHER SERVER"
  );
  console.log(unmatched);
  players[socket.id] = {
    opponent: unmatched,
    symbol: socket.symbol,
  };

  if (unmatched) {
    players[socket.id].symbol = "O";
    players[unmatched].opponent = socket.id;
    unmatched = null;
  } else {
    unmatched = socket.id;
  }
  console.log("PLYAERS 2", players);
  return players[socket.id];
};

const isUserOnOtherServer = (socket) => {
  if (socket.handshake.query.id) {
    return true;
  } else {
    return false;
  }
};

const opponentOf = (socket) => {
  if (!players[socket.id].opponent) {
    return;
  }
  return players[players[socket.id].opponent].socket;
};

const getOpponentObject = (id) => {
  return players[players[id].opponent];
};

const getOpponentId = (id) => {
  console.log(" ID", id, " ID");
  console.log("OPPONENT ID", players[id].opponent, "OPPONENT ID");
  return players[id].opponent;
};

const isGameOver = (board) => {
  console.log("game over is true board", board);
  let matches = ["XXX", "OOO"];
  let rows = [
    board.r0c0 + board.r0c1 + board.r0c2, // 1st line
    board.r1c0 + board.r1c1 + board.r1c2, // 2nd line
    board.r2c0 + board.r2c1 + board.r2c2, // 3rd line
    board.r0c1 + board.r1c1 + board.r2c1, // 2nd column
    board.r0c2 + board.r1c2 + board.r2c2, // 3rd column
    board.r0c0 + board.r1c1 + board.r2c2, // Primary diagonal
    board.r0c2 + board.r1c1 + board.r2c0, // Secondary diagonal
  ];

  for (let i = 0; i < rows.length; i++) {
    if (rows[i] === matches[0] || rows[i] === matches[1]) {
      console.log("game over is true rows", rows[i]);
      return true;
    }
  }

  return false;
};

const getUnmatched = () => {
  return unmatched;
};

module.exports = {
  connectToSocket,
  players,
  unmatched,
  joinRoom,
  joinRoomOtherServer,
  getUnmatched,
  getOpponentObject,
  getOpponentId,
};
// module.exports = players;
// module.exports = unmatched;
