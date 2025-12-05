const express = require("express");
const { createContest } = require("../../controllers/creator/creator.controller");
const router = express.Router();

router.post("/", createContest)


module.exports = router;