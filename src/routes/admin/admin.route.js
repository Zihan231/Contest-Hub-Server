const express = require("express");
const {
  getUsers,
  changeRole,
  changeContestStatus,
  deleteContest,
} = require("../../controllers/admin/admin.controller");
const router = express.Router();

// get all Users
router.get("/", getUsers);

// change role
router.patch("/role/:id", changeRole);

// Accept/Reject
router.patch("/status/:id", changeContestStatus);

// Delete contest
router.delete("/delete/:id", deleteContest);


module.exports = router;
