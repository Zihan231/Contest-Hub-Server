const express = require("express");
const {
  getContestByID,
  updateProfile,
  participantsContest,
  participatedContest,
  joinContest,
  winRate,
  getUserByEmail,
  proceedPayment,
  checkPayment,
  submitTask,
} = require("../../controllers/user/user.controller");
const { default: verifyFirebaseToken } = require("../../middleware/FirebaseAuth/verifyFirebaseToken");
const router = express.Router();

// see Own Profile
router.get("/", verifyFirebaseToken, getUserByEmail);

// get contest by ID
router.get("/:id", verifyFirebaseToken, getContestByID);

//Update Profile
router.patch("/update",verifyFirebaseToken, updateProfile);

// see all Participants in a contest
router.post("/participants", participantsContest);

// see participated contests
router.get("/participated/:email", participatedContest);

// Join in contest
router.post("/join",verifyFirebaseToken, joinContest);

// Win rate
router.get("/winRate/:id",verifyFirebaseToken, winRate)

// payment
router.post('/payment',verifyFirebaseToken, proceedPayment);

// check payment
router.patch('/payment/check',verifyFirebaseToken, checkPayment);

// submit task
router.patch('/submit-task', verifyFirebaseToken, submitTask);
module.exports = router;
