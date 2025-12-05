const express = require("express");
const {
  getUsers,
  changeRole,
  changeContestStatus,
} = require("../../controllers/admin/admin.controller");
const router = express.Router();

// get all Users
router.get("/", getUsers);

// change role
router.patch("/:id", changeRole);

// Accept/Reject
router.patch("/status/:id", changeContestStatus);


module.exports = router;
