const express = require("express");
const controller = require("../controllers/authController");

const router = express.Router();

// 🚨 LOGIN É PÚBLICO
router.post("/login", controller.login);

module.exports = router;
