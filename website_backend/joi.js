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
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
    }),
    otp: Joi.string().length(6).required().messages({
        'any.required': 'OTP is required'
    }),
    accountType: Joi.string().valid('user', 'admin').default('user')
});

const loginSchema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
    }),
    otp: Joi.string().length(6).required().messages({
        'any.required': 'OTP is required'
    })
});

// OTP validation schemas
const sendOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    })
});

const sendPhoneOtpSchema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
    })
});

const sendSignupOtpSchema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required'
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
    description: Joi.string().min(1).required().messages({
        'string.min': 'Description must be at least 1 character long',
        'any.required': 'Description is required'
    }),
    durations: Joi.array().items(Joi.object({
        duration: Joi.string().valid('1 Month', '3 Months', '6 Months', '1 Year', 'Lifetime', 'One-time').required().messages({
            'any.only': 'Duration must be one of: 1 Month, 3 Months, 6 Months, 1 Year, Lifetime, One-time',
            'any.required': 'Duration is required'
        }),
        description: Joi.string().min(1).required().messages({
            'string.min': 'Duration description must be at least 1 character long',
            'any.required': 'Duration description is required'
        }),
        price: Joi.number().positive().required().messages({
            'number.positive': 'Duration price must be a positive number',
            'any.required': 'Duration price is required'
        }),
        originalPrice: Joi.number().positive().required().messages({
            'number.positive': 'Duration original price must be a positive number',
            'any.required': 'Duration original price is required'
        }),
        slotsAvailable: Joi.number().integer().min(0).default(0).messages({
            'number.integer': 'Slots available must be a whole number',
            'number.min': 'Slots available cannot be negative'
        }),
        totalSlots: Joi.number().integer().min(0).default(0).messages({
            'number.integer': 'Total slots must be a whole number',
            'number.min': 'Total slots cannot be negative'
        }),
        isActive: Joi.boolean().default(true),
        startDate: Joi.date().iso().required().messages({
            'date.format': 'Start date must be a valid date',
            'any.required': 'Start date is required'
        }),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
            'date.format': 'End date must be a valid date',
            'date.greater': 'End date must be after start date',
            'any.required': 'End date is required'
        })
    })).min(1).required().messages({
        'array.min': 'At least one duration option is required',
        'any.required': 'Durations are required'
    }),
    planType: Joi.string().valid('basic', 'premium', 'family', 'enterprise').required().messages({
        'any.only': 'Plan type must be one of: basic, premium, family, enterprise',
        'any.required': 'Plan type is required'
    }),
    category: Joi.string().valid(
        'subscriptions',
        'software',
        'websites',
        'tools',
        'music',
        'design',
        'marketing',
        'hosting',
        'other',
        'AI TOOLS',
        'GRAPHICS AND VIDEO EDITING SERVICES',
        'WRITING TOOLS SERVICES',
        'PRODUCTIVITY AND OFFICE MANAGEMENT SERVICES',
        'ONLINE MARKETING And SOFTWARE',
        'DATA EXTRACTER SERVICES',
        'DATING SUBSCRIPTION',
        'ONLINE ENTERTAINMENT SERVICES',
        'featured' // Added featured as a category
    ).required().messages({
        'any.only': 'Category must be one of: subscriptions, software, websites, tools, music, design, marketing, hosting, other, AI TOOLS, GRAPHICS AND VIDEO EDITING SERVICES, WRITING TOOLS SERVICES, PRODUCTIVITY AND OFFICE MANAGEMENT SERVICES, ONLINE MARKETING And SOFTWARE, DATA EXTRACTER SERVICES, DATING SUBSCRIPTION, ONLINE ENTERTAINMENT SERVICES, featured',
        'any.required': 'Category is required'
    }),

    features: Joi.array().items(Joi.string().min(1)).min(1).required().messages({
        'array.min': 'At least one feature is required',
        'any.required': 'Features are required'
    }),
    iconImage: Joi.string().uri().required().messages({
        'string.uri': 'Icon image must be a valid URL',
        'any.required': 'Icon image is required'
    }),
    sampleLink: Joi.string().uri().optional().messages({
        'string.uri': 'Sample link must be a valid URL'
    }),
    isActive: Joi.boolean().default(true),
    createdBy: Joi.string().optional().messages({
        'string.base': 'Created by must be a string'
    })
});

const updatePlanSchema = Joi.object({
    serviceName: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(1).optional(),
    durations: Joi.array().items(Joi.object({
        duration: Joi.string().valid('1 Month', '3 Months', '6 Months', '1 Year', 'Lifetime', 'One-time').required(),
        description: Joi.string().min(1).required(),
        price: Joi.number().positive().required(),
        originalPrice: Joi.number().positive().required(),
        slotsAvailable: Joi.number().integer().min(0).default(0),
        totalSlots: Joi.number().integer().min(0).default(0),
        isActive: Joi.boolean().default(true),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
    })).min(1).optional(),
    planType: Joi.string().valid('basic', 'premium', 'family', 'enterprise').optional(),
    category: Joi.string().valid(
        'subscriptions',
        'software',
        'websites',
        'tools',
        'music',
        'design',
        'marketing',
        'hosting',
        'other',
        'AI TOOLS',
        'GRAPHICS AND VIDEO EDITING SERVICES',
        'WRITING TOOLS SERVICES',
        'PRODUCTIVITY AND OFFICE MANAGEMENT SERVICES',
        'ONLINE MARKETING And SOFTWARE',
        'DATA EXTRACTER SERVICES',
        'DATING SUBSCRIPTION',
        'ONLINE ENTERTAINMENT SERVICES',
        'featured' // Added featured as a category
    ).optional().messages({
        'any.only': 'Category must be one of: subscriptions, software, websites, tools, music, design, marketing, hosting, other, AI TOOLS, GRAPHICS AND VIDEO EDITING SERVICES, WRITING TOOLS SERVICES, PRODUCTIVITY AND OFFICE MANAGEMENT SERVICES, ONLINE MARKETING And SOFTWARE, DATA EXTRACTER SERVICES, DATING SUBSCRIPTION, ONLINE ENTERTAINMENT SERVICES, featured'
    }),
    features: Joi.array().items(Joi.string().min(1)).min(1).optional(),
    iconImage: Joi.string().uri().optional(),
    sampleLink: Joi.string().uri().optional().messages({
        'string.uri': 'Sample link must be a valid URL'
    }),
    sampleImages: Joi.array().items(Joi.string().uri()).optional().messages({
        'string.uri': 'Sample image must be a valid URL'
    }),
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
});

// Get user details schema
const getUserDetailsSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required'
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

// Review and Rating validation schemas

const reviewAndRatingSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot exceed 5'
    }),
    review: Joi.string().optional()
});


//Admin Login Schema
const loginAdminSchema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
    }),
    otp: Joi.string().length(6).required().messages({
        'any.required': 'OTP is required'
    })
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
    otp: Joi.string().length(6).required().messages({
        'any.required': 'OTP is required'
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

const sendAdminSignupOtpSchema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required'
    }),
    adminSecret: Joi.string().required().messages({
        'any.required': 'Admin secret is required'
    })
});

const sendAdminLoginOtpSchema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
    })
});

const cartAddSchema = Joi.object({
    subscriptionPlan: Joi.string().required().messages({
        'any.required': 'Subscription plan is required'
    }),
    duration: Joi.string().valid('1 Month', '3 Months', '6 Months', '1 Year', 'Lifetime', 'One-time').required().messages({
        'any.only': 'Duration must be one of: 1 Month, 3 Months, 6 Months, 1 Year, Lifetime, One-time',
        'any.required': 'Duration is required'
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
    sendOtpSchema,
    sendPhoneOtpSchema,
    sendSignupOtpSchema,
    verifyOtpSchema,
    createAdminSchema,
    promoteToAdminSchema,
    validateRequest,
    reviewAndRatingSchema,
    getUserDetailsSchema,
    updateAccountTypeSchema,
    loginAdminSchema,
    sendAdminSignupOtpSchema,
    sendAdminLoginOtpSchema,
    cartAddSchema
};