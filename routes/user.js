const express = require("express");
let router = express.Router();
router.get("/", async (req, res) => {
  try {
    res.send("It works");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
