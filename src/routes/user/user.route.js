const express = require("express");
const { getContestByID, updateProfile } = require("../../controllers/user/user.controller");
const router = express.Router();

// get contest by ID
router.get("/:id", getContestByID);


//Update Profile
router.patch("/update/:id", updateProfile);




module.exports = router;
