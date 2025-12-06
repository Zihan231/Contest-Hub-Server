const express = require("express");
const { createContest, updateContest,deleteContest } = require("../../controllers/creator/creator.controller");
const router = express.Router();

// create contest
router.post("/", createContest);


// Update contest
router.patch("/:id", updateContest);

// Delete contest
router.delete("/:id", deleteContest);

module.exports = router;