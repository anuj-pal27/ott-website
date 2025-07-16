const SubscriptionPlan = require('../models/SubscriptionPlan');


const getPublicPlans = async (req, res) => {
    try {
        const filter = { isActive: true };
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const plans = await SubscriptionPlan.find(filter);
        res.status(200).json({
            success: true,
            message: "Public plans fetched successfully",
            plans
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
    
};

module.exports = { getPublicPlans, getPublicPlanById };