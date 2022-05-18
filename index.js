const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.js");
dotenv.config();
const app = express();
const port = process.env.PORT || 7070;

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);

const run = async () => {
  try {
    app.listen(port, () => {
      console.log(`server is listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

run();
