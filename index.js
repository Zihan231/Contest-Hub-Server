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
// --------------------->>> Public API <<<------------------------------
const publicRoutes = require("./src/routes/public/public.route");

// SignUp
app.use("/public/signUp", publicRoutes);

// see all confirmed contests
app.use("/public/contests", publicRoutes);

// ----------------------------->>> Admin Routes <<<-------------------------------------
const adminRoute = require("./src/routes/admin/admin.route");

// Change Role
app.use("/admin/change/role", adminRoute);

// Accept/Reject Contest
app.use("/admin/contest", adminRoute);

//see all users
app.use("/users", adminRoute);

// ---------------------------->>> Creator Routes <<<-------------------------------
const contestRoutes = require("./src/routes/creator/creator.route");

// Create Contest
app.use("/creator/contest/create", contestRoutes);

// update contest
app.use("/creator/contest", contestRoutes);

// Delete contest
app.use("/creator/contest/delete", contestRoutes);

// Declare winner
app.use("/creator/contest", contestRoutes);


// ----------------------------->>> User Route <<<-------------------------

const userRoutes = require("./src/routes/user/user.route");

// get contest by ID
app.use("/user/contest", userRoutes);

// Update User Profile
app.use("/user/profile", userRoutes);

// see all participants in a contest 
app.use("/user/contest", userRoutes);







// ---------------------->>> test server <<<-------------------------------
app.get("/", (req, res) => {
  res.send("Contest Hub Server is running !!!");
});
startServer();
