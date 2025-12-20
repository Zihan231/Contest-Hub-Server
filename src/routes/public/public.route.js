const express = require("express");
const { getContest, signUp, getLeaderboard, getPopularContests, getRole, getItems } = require("../../controllers/public/public.controller");

const router = express.Router();

// Sign Up
router.post("/signUp", signUp)

// See all confirmed contests
router.get("/contests", getContest);

// see leaderboard
router.get("/leaderboard", getLeaderboard)

// get popular contests
router.get("/contests/popular", getPopularContests)

// get role 
router.get("/user/getRole/:email", getRole)

// Search 
router.get("/contests/find", getItems);
module.exports = router;
