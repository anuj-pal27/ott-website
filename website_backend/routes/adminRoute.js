const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const { 
    addSubscriptionPlan, 
    updateSubscriptionPlan, 
    deleteSubscriptionPlan, 
    getAllSubscriptionPlans, 
    getSubscriptionPlanById,
    uploadImage
} = require("../controller/adminController");
const { 
    planSchema, 
    updatePlanSchema, 
    validateRequest
} = require("../joi");

// Admin routes for subscription plan management
// Order: auth (verify JWT) -> isAdmin (check role) -> validateRequest (validate data) -> controller
router.post("/plans", auth, isAdmin, validateRequest(planSchema), addSubscriptionPlan);
router.put("/plans/:planId", auth, isAdmin, validateRequest(updatePlanSchema), updateSubscriptionPlan);
router.delete("/plans/:planId", auth, isAdmin, deleteSubscriptionPlan);
router.get("/plans", auth, isAdmin, getAllSubscriptionPlans);
router.get("/plans/:planId", auth, isAdmin, getSubscriptionPlanById);

// Image upload route
router.post("/upload-image", auth, isAdmin, upload.single('image'), uploadImage);

module.exports = router;