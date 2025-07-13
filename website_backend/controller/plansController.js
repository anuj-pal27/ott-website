const SubscriptionPlan = require('../models/SubscriptionPlan');

const getAllPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find();
        res.status(200).json({
            success: true,
            message: "Plans fetched successfully",
            plans
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllPlans };