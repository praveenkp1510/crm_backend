const express = require("express");
const router = express.Router();
// Destructuring MUST match the controller's 'exports.name'
const {
  register,
  login,
  verifyOtp,
  resendOtp,
  getUserProfile,
  getAllUsers,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp); // New Route
router.post("/resend-otp", resendOtp);
router.get("/profile", getUserProfile);
router.get("/users", getAllUsers);
module.exports = router;
