const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/Owner");

// Endpoint: POST http://localhost:5100/api/owner/login
router.post("/login", ownerController.ownerLogin);

module.exports = router;