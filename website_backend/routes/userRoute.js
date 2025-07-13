const express = require("express");
const router = express.Router();
const {signup,login,forgotPassword,getUserDetails,
    updateUserDetails,changePassword,sendOtp,updateAccountType} = require("../controller/authController");
const {resetPassword} = require("../controller/resetPassword");
const {auth} = require("../middleware/auth");
const { 
  userSchema, 
  loginSchema, 
  sendOtpSchema, 
  changePasswordSchema, 
  resetPasswordSchema,
  getUserDetailsSchema,
  updateUserDetailsSchema,
  updateAccountTypeSchema,
  validateRequest 
} = require("../joi");

router.post("/signup", validateRequest(userSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/send-otp", validateRequest(sendOtpSchema), sendOtp);
router.post("/forgot-password", validateRequest(sendOtpSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
router.post("/change-password", validateRequest(changePasswordSchema), changePassword);
router.post("/get-user-details", validateRequest(getUserDetailsSchema), auth, getUserDetails);
router.post("/update-user-details", validateRequest(updateUserDetailsSchema), auth, updateUserDetails);
router.post("/update-account-type", validateRequest(updateAccountTypeSchema), updateAccountType);

module.exports = router;