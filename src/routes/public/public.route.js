const express = require("express");
const { getContest, signUp, getLeaderboard } = require("../../controllers/public/public.controller");

const router = express.Router();

// Sign Up
router.post("/signUp", signUp)

// See all confirmed contests
router.get("/contests", getContest);

// see leaderboard
router.get("/leaderboard", getLeaderboard)

module.exports = router;
