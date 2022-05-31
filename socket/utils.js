// if (opponentOtherServer(socket) && !opponentOf(socket)) {
//   socket.emit("game.begin", {
//     symbol: players[socket.id].symbol,
//   });
//   console.log("Game begins!!");
//   emitOnOtherServer(socket.opponent, {
//     emitRole: "game.begin",
//     emitPayload: {
//       symbol: players[opponentOtherServer(socket)].symbol,
//     },
//   });
// }

// if (opponentOf(socket)) {
//   socket.emit("game.begin", {
//     symbol: players[socket.id].symbol,
//   });
//   console.log("Game begins!!");

//   opponentOf(socket).emit("game.begin", {
//     symbol: players[opponentOf(socket).id].symbol,
//   });
// }
// console.log("SHOW PLAYERS AFTER JOINING FROM OTHER SERVER", players);
// if (opponentOtherServer(socket)) {
//   socket.emit("game.begin", {
//     symbol: players[socket.id].symbol,
//   });
//   console.log("Game begins!!");
//   emitOnOtherServer(socket.opponent, {
//     emitRole: "game.begin",
//     emitPayload: {
//       symbol: players[opponentOtherServer(socket)].symbol,
//     },
//   });
// }

// socket.on("reset.game", () => {
//   if (!opponentOf(socket)) {
//     return;
//   }

//   socket.emit("game.reseted", { myTurn: true });

//   opponentOf(socket).emit("game.reseted", { myTurn: false });
// });

// const checkOtherServer = async (socket) => {
//   try {
//     console.log("is now unmatched", unmatched);
//     console.log("check other server", socket.id);
//     const serverResponse = await axios.post("http://localhost:7070/connect", {
//       socketid: socket.id,
//     });
//     console.log("SERVER RESPONSE", serverResponse.data, "SERVER RESPONSE");
//     joinRoomOtherServer(serverResponse);
//     console.log(serverResponse.data);
//   } catch (err) {
//     console.log("ERROR", err, "ERROR");
//   }
// };

// const emitOnOtherServer = async (socketId, emit) => {
//   try {
//     const serverResponse = await axios.post("http://localhost:7070/emit", {
//       socketid: socket.id,
//       emit: emit,
//     });
//     console.log(
//       "SERVER EMIT RESPONSE",
//       serverResponse.data,
//       "SERVER EMIT RESPONSE"
//     );
//   } catch (err) {
//     console.log("ERROR", err.message, "ERROR");
//   }
// };

// const onOtherServer = () => {};

// const renderTurnMessage = (myTurn) => {
//   if (!myTurn) {
//     const turnObj = { message: "Your opponent's turn", disabled: true };
//     return turnObj;
//   } else {
//     const turnObj = { message: "Your turn", disabled: false };
//     return turnObj;
//   }
// };

// const opponentOtherServer = (socket) => {
//   if (!players[socket.id].opponent) {
//     return;
//   }
//   console.log("OPPONENT OTHER SERVER", players[socket.id].opponent);
//   return players[players[socket.id].opponent];
// };

// const isGameOnSameServer = (id) => {
//   if (
//     players[id].handshake.query.id ||
//     players[id.opponent.handshake.query.id]
//   ) {
//     return false;
//   }
//   return true;
// };
