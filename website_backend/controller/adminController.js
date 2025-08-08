const SubscriptionPlan = require("../models/SubscriptionPlan");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

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

        // If iconImage is a Cloudinary URL, extract public_id
        if (subscriptionData.iconImage && subscriptionData.iconImage.includes('cloudinary.com')) {
            const urlParts = subscriptionData.iconImage.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            subscriptionData.cloudinaryPublicId = publicId;
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

        // If iconImage is being updated and there's an existing Cloudinary image, delete it
        if (updateData.iconImage && existingPlan.cloudinaryPublicId && 
            updateData.iconImage !== existingPlan.iconImage) {
            try {
                await deleteFromCloudinary(existingPlan.cloudinaryPublicId);
            } catch (deleteError) {
                console.error("Error deleting old Cloudinary image:", deleteError);
                // Continue with update even if deletion fails
            }
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

        // Delete Cloudinary image if it exists
        if (existingPlan.cloudinaryPublicId) {
            try {
                await deleteFromCloudinary(existingPlan.cloudinaryPublicId);
            } catch (deleteError) {
                console.error("Error deleting Cloudinary image:", deleteError);
                // Continue with deletion even if image deletion fails
            }
        }

        await SubscriptionPlan.findByIdAndDelete(planId);
        
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
        
        const subscriptionPlan = await SubscriptionPlan.findById(planId);
        if (!subscriptionPlan) {
            return res.status(404).json({
                success: false,
                message: "Subscription plan not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            subscriptionPlan
        });
    } catch (error) {
        console.error("Error in getSubscriptionPlanById:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching subscription plan"
        });
    }
};

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded"
            });
        }

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file);
        
        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: uploadResult.url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            size: uploadResult.size
        });
    } catch (error) {
        console.error("Error in uploadImage:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error in uploading image"
        });
    }
};

module.exports = {
    addSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    getAllSubscriptionPlans,
    getSubscriptionPlanById,
    uploadImage
};