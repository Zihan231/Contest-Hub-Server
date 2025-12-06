const express = require("express");
const { getContestByID } = require("../../controllers/user/user.controller");
const router = express.Router();

// get contest by ID
router.get("/:id", getContestByID);







module.exports = router;
