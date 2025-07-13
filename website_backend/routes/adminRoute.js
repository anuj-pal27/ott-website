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
    validateRequest 
} = require("../joi");

const { createAdmin, promoteToAdmin } = require("../controller/authController");

// Admin routes for subscription plan management
// Order: auth (verify JWT) -> isAdmin (check role) -> validateRequest (validate data) -> controller
router.post("/plans", auth, isAdmin, validateRequest(planSchema), addSubscriptionPlan);
router.put("/plans/:planId", auth, isAdmin, validateRequest(updatePlanSchema), updateSubscriptionPlan);
router.delete("/plans/:planId", auth, isAdmin, deleteSubscriptionPlan);
router.get("/plans", auth, isAdmin, getAllSubscriptionPlans);
router.get("/plans/:planId", auth, isAdmin, getSubscriptionPlanById);

// Admin creation and management routes (no auth required - uses secret key)
router.post("/create-admin", validateRequest(createAdminSchema), createAdmin);
router.post("/promote-to-admin", validateRequest(promoteToAdminSchema), promoteToAdmin);

module.exports = router;