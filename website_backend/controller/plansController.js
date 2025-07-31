const SubscriptionPlan = require('../models/SubscriptionPlan');

const getPublicPlans = async (req, res) => {
    try {
        const filter = { isActive: true };
        
        // Filter by category
        if (req.query.category && req.query.category !== 'all') {
            filter.category = req.query.category;
        }
        
        // Filter by service type
        if (req.query.serviceType) {
            filter.serviceType = req.query.serviceType;
        }
        
        // Filter by plan type
        if (req.query.planType) {
            filter.planType = req.query.planType;
        }
        
        const plans = await SubscriptionPlan.find(filter).sort({ createdAt: -1 });
        
        // Debug: Log plans data to check iconImage fields
        console.log('Fetched plans count:', plans.length);
        plans.forEach((plan, index) => {
            console.log(`Plan ${index + 1}:`, {
                serviceName: plan.serviceName,
                iconImage: plan.iconImage,
                cloudinaryPublicId: plan.cloudinaryPublicId
            });
        });
        
        res.status(200).json({
            success: true,
            message: "Public plans fetched successfully",
            plans,
            total: plans.length
        });
    } catch (error) {
        console.error('Error fetching public plans:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch plans",
            error: error.message 
        });
    }
};

const getPublicPlanById = async (req, res) => {
    try{
        const {planId } = req.params;
        const plan = await SubscriptionPlan.findById(planId);
        if(!plan){
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Plan fetched successfully",
            plan
        });
    } catch (error) {
        console.error('Error fetching plan by ID:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch plan",
            error: error.message 
        });
    }
};

// Get all unique categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await SubscriptionPlan.distinct('category', { isActive: true });
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};

module.exports = {
    getPublicPlans,
    getPublicPlanById,
    getAllCategories
};