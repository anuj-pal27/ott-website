const Joi = require('joi');

// User validation schemas
const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
        'string.pattern.base': 'Phone number must be 10 digits'
    }),
    otp: Joi.string().length(6).required(),
    accountType: Joi.string().valid('user', 'admin').default('user')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

const changePasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': 'New password must be at least 6 characters long',
        'any.required': 'New password is required'
    })
});

// OTP validation schemas
const sendOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    })
});

const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'OTP must be exactly 6 digits',
        'string.pattern.base': 'OTP must contain only numbers',
        'any.required': 'OTP is required'
    })
});

// Subscription Plan validation schemas
const planSchema = Joi.object({
    serviceName: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Service name must be at least 2 characters long',
        'string.max': 'Service name cannot exceed 100 characters',
        'any.required': 'Service name is required'
    }),
    description: Joi.string().min(10).max(500).required().messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description cannot exceed 500 characters',
        'any.required': 'Description is required'
    }),
    price: Joi.number().positive().required().messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required'
    }),
    durationInDays: Joi.number().integer().positive().required().messages({
        'number.integer': 'Duration must be a whole number',
        'number.positive': 'Duration must be positive',
        'any.required': 'Duration is required'
    }),
    planType: Joi.string().valid('basic', 'premium', 'family', 'enterprise').required().messages({
        'any.only': 'Plan type must be one of: basic, premium, family, enterprise',
        'any.required': 'Plan type is required'
    }),
    originalPrice: Joi.number().positive().required().messages({
        'number.positive': 'Original price must be a positive number',
        'any.required': 'Original price is required'
    }),
    slotsAvailable: Joi.number().integer().min(0).required().messages({
        'number.integer': 'Slots available must be a whole number',
        'number.min': 'Slots available cannot be negative',
        'any.required': 'Slots available is required'
    }),
    totalSlots: Joi.number().integer().positive().required().messages({
        'number.integer': 'Total slots must be a whole number',
        'number.positive': 'Total slots must be positive',
        'any.required': 'Total slots is required'
    }),
    features: Joi.array().items(Joi.string().min(1)).min(1).required().messages({
        'array.min': 'At least one feature is required',
        'any.required': 'Features are required'
    }),
    iconImage: Joi.string().uri().required().messages({
        'string.uri': 'Icon image must be a valid URL',
        'any.required': 'Icon image is required'
    }),
    startDate: Joi.date().iso().required().messages({
        'date.format': 'Start date must be a valid date',
        'any.required': 'Start date is required'
    }),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
        'date.format': 'End date must be a valid date',
        'date.greater': 'End date must be after start date',
        'any.required': 'End date is required'
    }),
    isActive: Joi.boolean().default(true),
    createdBy: Joi.string().required().messages({
        'any.required': 'Created by is required'
    })
});

const updatePlanSchema = Joi.object({
    serviceName: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(10).max(500).optional(),
    price: Joi.number().positive().optional(),
    durationInDays: Joi.number().integer().positive().optional(),
    planType: Joi.string().valid('basic', 'premium', 'family', 'enterprise').optional(),
    originalPrice: Joi.number().positive().optional(),
    slotsAvailable: Joi.number().integer().min(0).optional(),
    totalSlots: Joi.number().integer().positive().optional(),
    features: Joi.array().items(Joi.string().min(1)).min(1).optional(),
    iconImage: Joi.string().uri().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    isActive: Joi.boolean().optional()
});

// Order validation schemas
const createOrderSchema = Joi.object({
    subscriptionId: Joi.string().required().messages({
        'any.required': 'Subscription ID is required'
    }),
    paymentMethod: Joi.string().valid('card', 'upi', 'cash').default('card').messages({
        'any.only': 'Payment method must be one of: card, upi, cash'
    })
});

const updateOrderSchema = Joi.object({
    paymentStatus: Joi.string().valid('pending', 'success', 'failed').optional(),
    status: Joi.string().valid('pending', 'active', 'cancelled', 'expired').optional(),
    paymentId: Joi.string().optional()
});

// User profile update schema
const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
        'string.pattern.base': 'Phone number must be 10 digits'
    }),
    profilePicture: Joi.string().uri().optional().messages({
        'string.uri': 'Profile picture must be a valid URL'
    })
});

// Get user details schema
const getUserDetailsSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required'
    })
});

// Update user details schema
const updateUserDetailsSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required'
    }),
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
        'string.pattern.base': 'Phone number must be 10 digits'
    }),
    profilePicture: Joi.string().uri().optional().messages({
        'string.uri': 'Profile picture must be a valid URL'
    })
});

// Update account type schema
const updateAccountTypeSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required'
    }),
    newAccountType: Joi.string().valid('user', 'admin').required().messages({
        'any.only': 'Account type must be either "user" or "admin"',
        'any.required': 'New account type is required'
    })
});

// Password reset schema
const resetPasswordSchema = Joi.object({
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    confirmPassword: Joi.string().min(6).required().messages({
        'string.min': 'Confirm password must be at least 6 characters long',
        'any.required': 'Confirm password is required'
    }),
    token: Joi.string().required().messages({
        'any.required': 'Token is required'
    })
});

// Review and Rating validation schemas

const reviewAndRatingSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot exceed 5'
    }),
    review: Joi.string().optional()
});

// Admin creation schema
const createAdminSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    adminSecret: Joi.string().required().messages({
        'any.required': 'Admin secret key is required'
    })
});

// Admin promotion schema
const promoteToAdminSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    adminSecret: Joi.string().required().messages({
        'any.required': 'Admin secret key is required'
    })
});

// Validation middleware function
const validateRequest = (schema) => {
    return (req, res, next) => {
        console.log("🔍 Validation middleware - Request body:", req.body);
        const { error, value } = schema.validate(req.body, { 
            abortEarly: false,
            stripUnknown: true 
        });
        
        if (error) {
            console.log("❌ Validation failed:", error.details);
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errorMessages
            });
        }
        
        console.log("✅ Validation passed, validated data:", value);
        // Replace req.body with validated data
        req.body = value;
        next();
    };
};

module.exports = { 
    userSchema, 
    loginSchema, 
    planSchema,
    updatePlanSchema,
    createOrderSchema,
    updateOrderSchema,
    updateUserSchema,
    changePasswordSchema,
    sendOtpSchema,
    verifyOtpSchema,
    resetPasswordSchema,
    createAdminSchema,
    promoteToAdminSchema,
    validateRequest,
    reviewAndRatingSchema,
    getUserDetailsSchema,
    updateUserDetailsSchema,
    updateAccountTypeSchema
};