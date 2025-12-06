const express = require("express");
const { getContest, signUp } = require("../../controllers/public/public.controller");

const router = express.Router();

// Sign Up
router.post("/", signUp)

// See all confirmed contests
router.get("/", getContest);

module.exports = router;
