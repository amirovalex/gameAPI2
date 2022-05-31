const express = require("express");
let router = express.Router();
const {
  players,
  unmatched,
  joinRoom,
  getUnmatched,
  joinRoomOtherServer,
  getOpponentObject,
  getOpponentId,
} = require("../socket/socket.js");
router.get("/", async (req, res) => {
  try {
    res.send("It works");
  } catch (err) {
    console.log(err);
  }
});

router.post("/connect", async (req, res) => {
  try {
    if (getUnmatched()) {
      const data = req.body;
      console.log("data", data);

      const playerObject = joinRoomOtherServer({ id: data.socketid });
      console.log("1111", playerObject);
      const opponentId = getOpponentId(getOpponentId(playerObject.opponent));
      const opponentObject = getOpponentObject(getOpponentId(opponentId));
      console.log("112211", opponentObject);
      // const returnId = getOpponentId(playerObject.id);
      res.send({
        id: opponentId,
        opponent: opponentObject.opponent,
        symbol: opponentObject.symbol,
      });
    } else {
      console.log("Nobody is waiting for the connection");
      res.send("Nobody is waiting for the connection");
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
});

module.exports = router;
