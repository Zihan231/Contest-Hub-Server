const express = require("express");
const { createContest, updateContest,deleteContest, declareWinner } = require("../../controllers/creator/creator.controller");
const router = express.Router();

// create contest
router.post("/", createContest);


// Update contest
router.patch("/update/:id", updateContest);

// Delete contest
router.delete("/:id", deleteContest);

// Declare winner
router.patch("/declare/winner", declareWinner);

module.exports = router;