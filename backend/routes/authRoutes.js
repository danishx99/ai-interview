//set this file up as a routes file
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/user", authController.getUserDetails);
router.get("/verify-email", authController.verifyEmail);
router.get("/validate-token", authController.validateToken);
router.get(
  "/resend-verification-email",
  authController.resendVerificationEmail
);
router.get("/delete", authController.deleteAllUsers);

module.exports = router;
