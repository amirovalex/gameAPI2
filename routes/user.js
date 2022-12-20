const express = require("express");
let router = express.Router();
const { players } = require("../socket/socket.js");

router.get("/", async (req, res) => {
  try {
    res.send("It works");
  } catch (err) {
    console.log(err);
  }
});

router.get("/server", async (req, res) => {
  console.log("players object is existing", players);
  console.log("request", req);
  if (players) {
    let playersCount = Object.keys(players).length;
    console.log("players on the server", playersCount);

    res.json({ country: "US", players: playersCount });
  } else {
    res.json({ country: "US", players: 0 });
  }
});

module.exports = router;
