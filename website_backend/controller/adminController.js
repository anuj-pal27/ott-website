const SubscriptionPlan = require("../models/SubscriptionPlan");

const VALID_CATEGORIES = ['SUBSCRIPTIONS',    
            'SOFTWARE',         
            'WEBSITES',         
            'TOOLS',           
            'COURSES',         
            'DESIGN',         
            'HOSTING',         
            'OTHER',           
            'AI TOOLS',
            'GRAPHICS AND VIDEO EDITING SERVICES',
            'WRITING TOOLS SERVICES',
            'PRODUCTIVITY AND OFFICE MANAGEMENT SERVICES',
            'ONLINE MARKETING And SOFTWARE',
            'DATA EXTRACTER SERVICES',
            'DATING SUBSCRIPTION',
            'ONLINE ENTERTAINMENT SERVICES',
            'featured' // Added featured as a category
];

const addSubscriptionPlan = async (req, res) => {
    try {
        const subscriptionData = req.body;
        // Validate category
        if (!subscriptionData.category || !VALID_CATEGORIES.includes(subscriptionData.category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing category. Allowed: subscriptions, software, websites, tools, music, design, marketing, hosting, other."
            });
        }
        const existingPlan = await SubscriptionPlan.findOne({
            serviceName: subscriptionData.serviceName
        });
        if (existingPlan) {
            return res.status(400).json({
                success: false,
                message: "Subscription plan already exists"
            });
        }
        const subscriptionPlan = await SubscriptionPlan.create(subscriptionData);
        return res.status(200).json({
            success: true,
            message: "Subscription plan created successfully",
            subscriptionPlan
        });
    } catch (error) {
        console.error("Error in addSubscriptionPlan:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating subscription plan"
        });
    }
};

const updateSubscriptionPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const updateData = req.body;
        // Validate category if present
        if (updateData.category && !VALID_CATEGORIES.includes(updateData.category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category. Allowed: subscriptions, software, websites, tools, music, design, marketing, hosting, other."
            });
        }
        const existingPlan = await SubscriptionPlan.findById(planId);
        if (!existingPlan) {
            return res.status(404).json({
                success: false,
                message: "Subscription plan not found"
            });
        }
        const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
            planId,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        return res.status(200).json({
            success: true,
            message: "Subscription plan updated successfully",
            subscriptionPlan: updatedPlan
        });
    } catch (error) {
        console.error("Error in updateSubscriptionPlan:", error);
        return res.status(500).json({
            success: false,
            message: "Error in updating subscription plan"
        });
    }
};

const deleteSubscriptionPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        
        const existingPlan = await SubscriptionPlan.findById(planId);
        if (!existingPlan) {
            return res.status(404).json({
                success: false,
                message: "Subscription plan not found"
            });
        }
        
        // Soft delete by setting isActive to false
        await SubscriptionPlan.findByIdAndUpdate(planId, { 
            isActive: false, 
            updatedAt: new Date() 
        });
        
        return res.status(200).json({
            success: true,
            message: "Subscription plan deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteSubscriptionPlan:", error);
        return res.status(500).json({
            success: false,
            message: "Error in deleting subscription plan"
        });
    }
};

const getAllSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find({ isActive: true })
            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            message: "Subscription plans retrieved successfully",
            plans
        });
    } catch (error) {
        console.error("Error in getAllSubscriptionPlans:", error);
        return res.status(500).json({
            success: false,
            message: "Error in retrieving subscription plans"
        });
    }
};


const getSubscriptionPlanById = async (req, res) => {
    try {
        const { planId } = req.params;
        
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Subscription plan not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Subscription plan retrieved successfully",
            plan
        });
    } catch (error) {
        console.error("Error in getSubscriptionPlanById:", error);
        return res.status(500).json({
            success: false,
            message: "Error in retrieving subscription plan"
        });
    }
};

module.exports = {
    addSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    getAllSubscriptionPlans,
    getSubscriptionPlanById
};