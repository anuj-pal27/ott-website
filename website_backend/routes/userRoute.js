const express = require("express");
const router = express.Router();
const {
    signup,
    login,
    createAdmin,
    loginAdmin,
    promoteToAdmin,
    getUserDetails,
    updateUserDetails,
    updateAccountType,
    logout
} = require("../controller/authController");
const {auth} = require("../middleware/auth");
const { 
  userSchema, 
  loginSchema, 
  adminSignupSchema,
  adminLoginSchema,
  getUserDetailsSchema,
  updateUserSchema,
  updateAccountTypeSchema,
  validateRequest 
} = require("../joi");

// Email/password authentication routes
router.post("/signup", validateRequest(userSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", auth, logout);

// Admin authentication routes
router.post("/admin/signup", validateRequest(adminSignupSchema), createAdmin);
router.post("/admin/login", validateRequest(adminLoginSchema), loginAdmin);

// Other routes
router.post("/get-user-details", validateRequest(getUserDetailsSchema), auth, getUserDetails);
router.post("/update-user-details", validateRequest(updateUserSchema), auth, updateUserDetails);
router.post("/update-account-type", validateRequest(updateAccountTypeSchema), updateAccountType);
router.post("/promote-to-admin", promoteToAdmin);

module.exports = router;