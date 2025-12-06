const express = require("express");
const { getContestByID, updateProfile, participantsContest } = require("../../controllers/user/user.controller");
const router = express.Router();

// get contest by ID
router.get("/:id", getContestByID);


//Update Profile
router.patch("/update/:id", updateProfile);

// see all Participants in a contest
router.get("/participants/:id", participantsContest)


module.exports = router;
