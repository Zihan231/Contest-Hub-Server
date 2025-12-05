const express = require("express");
const { createContest, updateContest } = require("../../controllers/creator/creator.controller");
const router = express.Router();

// create contest
router.post("/", createContest);


// Update contest
router.patch("/:id", updateContest);

module.exports = router;