const express = require("express");
const {
  getContestByID,
  updateProfile,
  participantsContest,
  participatedContest,
  joinContest,
  winRate,
} = require("../../controllers/user/user.controller");
const router = express.Router();

// get contest by ID
router.get("/:id", getContestByID);

//Update Profile
router.patch("/update/:id", updateProfile);

// see all Participants in a contest
router.post("/participants", participantsContest);

// see participated contests
router.get("/participated/:email", participatedContest);

// Join in contest
router.post("/join", joinContest);

// Win rate
router.get("/winRate/:id", winRate)

module.exports = router;
