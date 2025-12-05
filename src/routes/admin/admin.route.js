const express = require("express");
const {
  getUsers,
  changeRole,
} = require("../../controllers/admin/admin.controller");
const router = express.Router();

router.get("/", getUsers);

// change role
router.patch("/:id", changeRole);

module.exports = router;
