const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");

const { 
    addSubscriptionPlan, 
    updateSubscriptionPlan, 
    deleteSubscriptionPlan, 
    getAllSubscriptionPlans, 
    getSubscriptionPlanById 
} = require("../controller/adminController");
const { 
    planSchema, 
    updatePlanSchema, 
    createAdminSchema, 
    promoteToAdminSchema, 
    validateRequest,
    loginAdminSchema,
    sendAdminSignupOtpSchema,
    sendAdminLoginOtpSchema
} = require("../joi");

const { 
    createAdmin, 
    promoteToAdmin, 
    loginAdmin, 
    sendAdminSignupOtp, 
    sendAdminLoginOtp 
} = require("../controller/authController");

// Admin routes for subscription plan management
// Order: auth (verify JWT) -> isAdmin (check role) -> validateRequest (validate data) -> controller
router.post("/plans", auth, isAdmin, validateRequest(planSchema), addSubscriptionPlan);
router.put("/plans/:planId", auth, isAdmin, validateRequest(updatePlanSchema), updateSubscriptionPlan);
router.delete("/plans/:planId", auth, isAdmin, deleteSubscriptionPlan);
router.get("/plans", auth, isAdmin, getAllSubscriptionPlans);
router.get("/plans/:planId", auth, isAdmin, getSubscriptionPlanById);

// Admin OTP routes (no auth required - uses secret key)
router.post("/send-admin-signup-otp", validateRequest(sendAdminSignupOtpSchema), sendAdminSignupOtp);
router.post("/send-admin-login-otp", validateRequest(sendAdminLoginOtpSchema), sendAdminLoginOtp);

// Admin creation and management routes (no auth required - uses secret key)
router.post("/login-admin", validateRequest(loginAdminSchema), loginAdmin);
router.post("/create-admin", validateRequest(createAdminSchema), createAdmin);
router.post("/promote-to-admin", validateRequest(promoteToAdminSchema), promoteToAdmin);

module.exports = router;