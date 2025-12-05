const express = require("express");
const { getUsers } = require("../../controllers/admin/admin.controller");
const router = express.Router();

router.get("/", getUsers);

module.exports = router;
