const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const sendEmail = require("../utils/sendEmail");
const PhonePe = require("../config/PhonePe");
const { randomUUID } = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

// Validate PhonePe environment variables
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/hermes';


// Create checkout session (PhonePe)
const checkout = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const cart = await Cart.findOne({ user: userId }).populate("items.subscriptionPlan");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        
        // Create orders for each cart item
        const orders = [];
        const items = cart.items.map(item => {
            const plan = item.subscriptionPlan;
            const selectedDuration = plan.durations.find(d => d.duration === item.duration);
            return {
                subscriptionPlan: plan._id,
                selectedDuration: selectedDuration ? {
                    duration: selectedDuration.duration,
                    description: selectedDuration.description,
                    price: selectedDuration.price,
                    originalPrice: selectedDuration.originalPrice
                } : null,
                priceAtPurchase: selectedDuration ? selectedDuration.price : 0
            };
        });

        const totalAmount = items.reduce((sum, item) => sum + item.priceAtPurchase, 0);

        // Create separate orders for each item
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const cartItem = cart.items[i];
            
            // Find durationInDays for the selected duration
            let endDate = null;
            if (item.selectedDuration && item.selectedDuration.duration) {
                const plan = cartItem.subscriptionPlan;
                const selectedDuration = plan.durations.find(d => d.duration === item.selectedDuration.duration);
                if (selectedDuration && selectedDuration.durationInDays) {
                    endDate = new Date(Date.now() + selectedDuration.durationInDays * 24 * 60 * 60 * 1000);
                } else if (item.selectedDuration.duration === 'Lifetime' || item.selectedDuration.duration === 'One-time') {
                    endDate = null;
                }
            }
            
            const order = new Order({
                userId: userId,
                subscriptionId: item.subscriptionPlan,
                selectedDuration: item.selectedDuration,
                payment: [],
                startDate: new Date(),
                endDate: endDate,
            });
            await order.save();
            orders.push(order);
        }
        
        const merchantOrderId = randomUUID();
        const amount = totalAmount; // Keep in rupees, PhonePe config will convert to paise
        
        // Creating PhonePe order
        
        const { mobileNumber, type } = req.body || {};

        let response;
        try {
            response = await PhonePe.initiatePhonePePayment(merchantOrderId, amount, userId, mobileNumber, type);
        } catch (phonepeError) {
            console.error('❌ PhonePe API Error:', phonepeError);
            
            // Log error response for debugging
            if (phonepeError.response) {
                console.error('❌ PhonePe API Error Response:', phonepeError.response.status, phonepeError.response.data);
            } else {
                console.error('❌ PhonePe API Error:', phonepeError.message);
            }
            
            return res.status(500).json({
                success: false,
                message: "Payment gateway error occurred",
                error: phonepeError.message,
                details: phonepeError.response ? phonepeError.response.data : null
            });
        }
        
        const paymentUrl = response?.data?.instrumentResponse?.redirectInfo?.url || response?.instrumentResponse?.redirectInfo?.url;
        if (!paymentUrl) {
            console.error('❌ No payment URL in PhonePe response');
            return res.status(500).json({ 
                success: false, 
                message: "Failed to get payment URL from PhonePe", 
                details: response 
            });
        }
        
        // Payment URL generated
        
        // Create payment record with reference to all orders
        const payment = new Payment({
            order: orders[0]._id, // Keep reference to first order for backward compatibility
            orders: orders.map(order => order._id), // Add reference to all orders
            paymentAmount: totalAmount,
            paymentId: merchantOrderId,
            paymentStatus: "pending",
            paymentMethod: "phonepe",
            itemCount: orders.length, // Add count of items
        });
        await payment.save();

        // Add payment reference to all orders
        for (const order of orders) {
            order.payment.push(payment._id);
            await order.save();
        }

        await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

        res.status(200).json({
            success: true,
            message: "Orders created successfully",
            orderIds: orders.map(order => order._id),
            paymentId: merchantOrderId,
            paymentUrl,
            amount: totalAmount,
            currency: "INR",
            itemCount: orders.length,
        });
        
        console.log('✅ Checkout process completed successfully');
        
    } catch (error) {
        console.error("❌ Error in checkout:", error);
        console.error("❌ Error stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Error in checkout",
            error: error.message
        });
    }
};

// Verify payment (PhonePe)
const verifyPayment = async (req, res) => {
    try {
        const { paymentId } = req.body; // paymentId is merchantOrderId
        
        console.log('📤 Checking PhonePe payment status for:', paymentId);
        
        let statusResponse;
        try {
            statusResponse = await PhonePe.verifyPhonePePayment(paymentId);
            console.log('📥 PhonePe status response received:', JSON.stringify(statusResponse, null, 2));
        } catch (phonepeError) {
            console.error('❌ PhonePe status check error:', phonepeError);
            
            if (phonepeError.response) {
                console.error('❌ PhonePe API Error Response:', phonepeError.response.status, phonepeError.response.data);
            }
            
            return res.status(500).json({
                success: false,
                message: "Failed to check payment status",
                error: phonepeError.message
            });
        }
        
        const paymentStatus = statusResponse.code === 'PAYMENT_SUCCESS' ? 'COMPLETED' : 
                             statusResponse.code === 'PAYMENT_PENDING' ? 'PENDING' : 'FAILED';
        const payment = await Payment.findOne({ paymentId });
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }
        
        let user = null;
        let order = null;
        
        if (paymentStatus === 'COMPLETED') {
            payment.paymentStatus = "success";
            payment.paymentDate = new Date();
            
            // Update order
            order = await Order.findById(payment.order);
            if (order) {
                user = await User.findById(order.userId);
                
                // Calculate end date based on selected duration
                const subscriptionPlan = await require("../models/SubscriptionPlan").findById(order.subscriptionId);
                let durationInDays = null;
                if (subscriptionPlan && order.selectedDuration && order.selectedDuration.duration) {
                    const planDuration = subscriptionPlan.durations.find(
                        d => d.duration.trim().toLowerCase() === order.selectedDuration.duration.trim().toLowerCase()
                    );
                    durationInDays = planDuration ? planDuration.durationInDays : null;
                }
                if (durationInDays) {
                    order.endDate = new Date(order.startDate.getTime() + (durationInDays * 24 * 60 * 60 * 1000));
                } else if (order.selectedDuration.duration === 'Lifetime' || order.selectedDuration.duration === 'One-time') {
                    order.endDate = null; // or set to a far-future date if you prefer
                }
                await order.save();
                
                // Update user's subscription plans
                user = await User.findByIdAndUpdate(order.userId, { $push: { subscriptionPlan: order.subscriptionId } }, { new: true });
            }
        } else if (paymentStatus === 'PENDING') {
            payment.paymentStatus = "pending";
        } else {
            payment.paymentStatus = "failed";
        }
        
        await payment.save();
        
        if (payment.paymentStatus === 'success' && user && order) {
            // Handle multiple orders if this is a cart purchase
            const ordersToUpdate = payment.orders && payment.orders.length > 0 ? payment.orders : [order._id];
            
            // Update all orders and user subscriptions
            for (const orderId of ordersToUpdate) {
                const currentOrder = await Order.findById(orderId);
                if (currentOrder) {
                    // Calculate end date based on selected duration
                    const subscriptionPlan = await require("../models/SubscriptionPlan").findById(currentOrder.subscriptionId);
                    let durationInDays = null;
                    if (subscriptionPlan && currentOrder.selectedDuration && currentOrder.selectedDuration.duration) {
                        const planDuration = subscriptionPlan.durations.find(
                            d => d.duration.trim().toLowerCase() === currentOrder.selectedDuration.duration.trim().toLowerCase()
                        );
                        durationInDays = planDuration ? planDuration.durationInDays : null;
                    }
                    if (durationInDays) {
                        currentOrder.endDate = new Date(currentOrder.startDate.getTime() + (durationInDays * 24 * 60 * 60 * 1000));
                    } else if (currentOrder.selectedDuration.duration === 'Lifetime' || currentOrder.selectedDuration.duration === 'One-time') {
                        currentOrder.endDate = null;
                    }
                    await currentOrder.save();
                    
                    // Update user's subscription plans
                    user = await User.findByIdAndUpdate(currentOrder.userId, { $push: { subscriptionPlan: currentOrder.subscriptionId } }, { new: true });
                }
            }
            
            // Create email template for successful payment
            const orderPlacedEmailTemplate = require("../utils/orderPlacedEmailTemplate");
            const adminEmailTemplate = require("../utils/adminEmailTemplate");
            
            // Populate subscription details for email
            const subscriptionPlan = await require("../models/SubscriptionPlan").findById(order.subscriptionId);
            const subscriptionName = subscriptionPlan ? subscriptionPlan.serviceName : 'N/A';
            
            // Customer email details
            let orderDetails = '';
            if (payment.itemCount > 1) {
                // Multiple items - show summary
                orderDetails = `
                    <strong>Items Purchased:</strong> ${payment.itemCount} items<br/>
                    <strong>Total Amount:</strong> ₹${payment.paymentAmount}<br/>
                    <strong>Payment Date:</strong> ${new Date().toLocaleDateString()}
                `;
            } else {
                // Single item - show details
                orderDetails = `
                    <strong>Subscription:</strong> ${subscriptionName}<br/>
                    <strong>Duration:</strong> ${order.selectedDuration?.duration || 'N/A'}<br/>
                    <strong>Amount:</strong> ₹${payment.paymentAmount}<br/>
                    <strong>Start Date:</strong> ${order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'}<br/>
                    <strong>End Date:</strong> ${order.endDate ? new Date(order.endDate).toLocaleDateString() : 'Lifetime/One-time'}
                `;
            }
            
            const customerEmailHtml = orderPlacedEmailTemplate({
                userName: user.name,
                orderId: payment.paymentId,
                orderDetails: orderDetails,
                orderDate: new Date().toLocaleDateString()
            });
            
            // Admin email details
            const adminOrderDetails = `
                <strong>Customer Name:</strong> ${user.name}<br/>
                <strong>Customer Email:</strong> ${user.email}<br/>
                <strong>Customer Phone:</strong> ${user.phone}<br/>
                <strong>Items Purchased:</strong> ${payment.itemCount} items<br/>
                <strong>Total Amount:</strong> ₹${payment.paymentAmount}<br/>
                <strong>Payment ID:</strong> ${payment.paymentId}<br/>
                <strong>Payment Date:</strong> ${new Date().toLocaleDateString()}
            `;
            
            const adminEmailHtml = adminEmailTemplate({
                orderDetails: adminOrderDetails,
                orderDate: new Date().toLocaleDateString()
            });
            
            // Send emails
            try {
                // Send email to customer
                await sendEmail(
                    user.email, 
                    user.name, 
                    user.phone, 
                    customerEmailHtml, 
                    'Payment Successful - Vyapaar360'
                );
                console.log('✅ Success email sent to customer:', user.email);
                
                // Send email to admin
                await sendEmail(
                    'anujpal27669@gmail.com', 
                    'Admin', 
                    '', 
                    adminEmailHtml, 
                    '🆕 New Order - Customer Details - Vyapaar360'
                );
                console.log('✅ Admin notification email sent to: anujpal27669@gmail.com');
            } catch (emailError) {
                console.error('❌ Error sending emails:', emailError);
                // Don't fail the payment verification if email fails
            }
            
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                paymentId
            });
        } else if (payment.paymentStatus === 'pending') {
            return res.status(200).json({
                success: false,
                message: "Payment is still pending",
                paymentId,
                status: paymentStatus
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "Payment failed or cancelled",
                paymentId,
                status: paymentStatus
            });
        }
    } catch (error) {
        console.error("Error in verifyPayment:", error);
        res.status(500).json({
            success: false,
            message: "Error in payment verification"
        });
    }
};

// Get payment history for user
const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.userId;

        const payments = await Payment.find({})
            .populate({
                path: 'order',
                match: { userId: userId },
                populate: [
                  { path: 'subscriptionId', model: 'SubscriptionPlan' },
                  { path: 'userId', model: 'User' }
                ]
            })
            .populate({
                path: 'orders',
                match: { userId: userId },
                populate: [
                  { path: 'subscriptionId', model: 'SubscriptionPlan' },
                  { path: 'userId', model: 'User' }
                ]
            });

        // Filter out payments that don't belong to the user
        const userPayments = payments.filter(payment => {
            // Check if any order belongs to the user (either single order or multiple orders)
            return payment.order || (payment.orders && payment.orders.length > 0);
        });

        res.status(200).json({
            success: true,
            payments: userPayments
        });

    } catch (error) {
        console.error("Error in getPaymentHistory:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching payment history"
        });
    }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user.userId;
        const payment = await Payment.findOne({ paymentId })
            .populate({
                path: 'order',
                match: { userId: userId },
                populate: [
                  { path: 'subscriptionId', model: 'SubscriptionPlan' },
                  { path: 'userId', model: 'User' }
                ]
            })
            .populate({
                path: 'orders',
                match: { userId: userId },
                populate: [
                  { path: 'subscriptionId', model: 'SubscriptionPlan' },
                  { path: 'userId', model: 'User' }
                ]
            });
        console.log('📥 Payment:', payment);
        if (!payment || (!payment.order && (!payment.orders || payment.orders.length === 0))) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {
        console.error("Error in getPaymentById:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching payment"
        });
    }
};

module.exports = {
    checkout,
    verifyPayment,
    getPaymentHistory,
    getPaymentById
};