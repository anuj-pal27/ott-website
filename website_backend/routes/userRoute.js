const express = require("express");
const router = express.Router();
const {signup,login,loginWithEmail,getUserDetails,
    updateUserDetails,sendOtp,sendPhoneOtp,sendSignupOtp,updateAccountType} = require("../controller/authController");
const {auth} = require("../middleware/auth");
const { 
  userSchema, 
  loginSchema, 
  loginWithEmailSchema,
  sendOtpSchema, 
  sendPhoneOtpSchema,
  sendSignupOtpSchema,
  getUserDetailsSchema,
  updateUserSchema,
  updateAccountTypeSchema,
  validateRequest 
} = require("../joi");

// Phone-based authentication routes
router.post("/signup", validateRequest(userSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/send-signup-otp", validateRequest(sendSignupOtpSchema), sendSignupOtp);
router.post("/send-login-otp", validateRequest(sendPhoneOtpSchema), sendPhoneOtp);

// Legacy email-based authentication routes (for backward compatibility)
router.post("/login-email", validateRequest(loginWithEmailSchema), loginWithEmail);
router.post("/send-otp", validateRequest(sendOtpSchema), sendOtp);

// Other routes

router.post("/get-user-details", validateRequest(getUserDetailsSchema), auth, getUserDetails);
router.post("/update-user-details", validateRequest(updateUserSchema), auth, updateUserDetails);
router.post("/update-account-type", validateRequest(updateAccountTypeSchema), updateAccountType);

module.exports = router;