const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

// middle ware
app.use(cors());

// for json body parse
app.use(express.json());


// Test Server
app.get("/", (req, res) => {
  res.send("Contest Hub Server is running !!!");
});

app.listen(port, () => {
  console.log("Running on Port", port);
});
