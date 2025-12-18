const express = require("express");
const {
  getUsers,
  changeRole,
  changeContestStatus,
  deleteContest,
  getContestData,
} = require("../../controllers/admin/admin.controller");
const { default: verifyFirebaseToken } = require("../../middleware/FirebaseAuth/verifyFirebaseToken");

const router = express.Router();

// get all Users
router.get("/",verifyFirebaseToken, getUsers);

// change role
router.patch("/role/:id", changeRole);

// Accept/Reject
router.patch("/status/:id", changeContestStatus);

// Delete contest
router.delete("/delete/:id", deleteContest);

// get all Contests
router.get("/pending", getContestData);

module.exports = router;
