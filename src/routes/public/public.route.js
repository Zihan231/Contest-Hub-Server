const express = require("express");
const { getContest } = require("../../controllers/public/public.controller");

const router = express.Router();

router.get("/", getContest);

module.exports = router;
