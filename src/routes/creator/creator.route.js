const express = require("express");
const { createContest, updateContest,deleteContest, declareWinner, getParticipants, getContestByEmail } = require("../../controllers/creator/creator.controller");
const { default: verifyFirebaseToken } = require("../../middleware/FirebaseAuth/verifyFirebaseToken");
const router = express.Router();

// create contest
router.post("/create",verifyFirebaseToken, createContest);

// Update contest
router.patch("/update/:id", updateContest);

// Delete contest
router.delete("/delete/:id",verifyFirebaseToken, deleteContest);

// Declare winner
router.patch("/declare/winner",verifyFirebaseToken, declareWinner);

// see all participants
router.post("/all-participants",verifyFirebaseToken, getParticipants);

// see own created contests
router.get("/all/:email", getContestByEmail);

module.exports = router;