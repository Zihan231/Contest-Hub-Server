const express = require("express");
const app = express();
const cors = require("cors");
// Port
const port = process.env.PORT || 3000;

// middle ware
app.use(cors());
// for json body parse
app.use(express.json());
// Import Database connection
const { connectDB } = require("./src/config/db");

// Test Server
async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log("Running on Port", port);
    });
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}
// Public API
const publicRoutes = require("./src/routes/public/public.route");
app.use("/public/contests", publicRoutes);

// users
const userRoutes = require("./src/routes/admin/admin.route");

app.use("/users", userRoutes);

// contests
const contestRoutes = require("./src/routes/creator/creator.route");

app.use("/contest/create", contestRoutes);

// test server
app.get("/", (req, res) => {
  res.send("Contest Hub Server is running !!!");
});
startServer();
