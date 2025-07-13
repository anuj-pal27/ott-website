const razorpay = require("../config/razorpay");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const sendEmailOtp = require("../utils/sendEmailOtp");
const orderPlacedEmailTemplate = require("../utils/orderPlacedEmailTemplate");
const crypto = require('crypto');

// Create checkout session
const checkout = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const cart = await Cart.findOne({ user: userId }).populate("items.subscriptionPlan");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const items = cart.items.map(item => {
            return {
                subscriptionPlan: item.subscriptionPlan._id,
                priceAtPurchase: item.subscriptionPlan.price, 
                quantity: item.quantity,
            }
        });

        const totalAmount = items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);

        // Create Order in database first
        const order = new Order({
            userId: userId,
            subscriptionId: items[0].subscriptionPlan,
            payment: [],
            startDate: new Date(),
        });
        await order.save();

        // Create Razorpay Order
        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `order_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                orderId: order._id.toString(),
            }
        });

        // Create Payment record
        const payment = new Payment({
            order: order._id,
            paymentAmount: totalAmount,
            paymentId: razorpayOrder.id, // Use Razorpay order ID as payment ID
            paymentStatus: "pending",
            paymentMethod: "card", // Default, can be updated based on user selection
        });
        await payment.save();

        // Update order with payment reference
        order.payment.push(payment._id);
        await order.save();

        // Clear cart after successful order creation
        await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: totalAmount,
            currency: "INR",
            key: process.env.RAZORPAY_KEY_ID, // Frontend needs this for payment
        });

    } catch (error) {
        console.error("Error in checkout:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error in checkout" 
        });
    }
};

// Verify payment
const verifyPayment = async (req, res) => {
    try {
        const razorpaySignature = req.headers['x-razorpay-signature'];
        const expectedSignature = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }
        
        const {userId, orderId} = req.body.payload.payment.entity.notes;
        const paymentId = req.body.payload.payment.entity.id;
        
        // Find and update payment
        const payment = await Payment.findOne({ paymentId: paymentId});
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        // Update payment status
        payment.paymentStatus = "success";
        payment.paymentDate = new Date();
        await payment.save();

        // Update order
        const order = await Order.findById(payment.order);
        if (order) {
            // Calculate end date based on subscription duration
            const subscriptionPlan = await require("../models/SubscriptionPlan").findById(order.subscriptionId);
            if (subscriptionPlan && subscriptionPlan.durationInDays) {
                order.endDate = new Date(order.startDate.getTime() + (subscriptionPlan.durationInDays * 24 * 60 * 60 * 1000));
            }
            await order.save();
            
            // Add subscription to user
            const user = await User.findByIdAndUpdate(userId, {$push: {subscriptionPlan: order.subscriptionId}}, {new: true});
            
            // Send confirmation email
            if (user) {
                const emailHtml = orderPlacedEmailTemplate({
                    userName: user.name,
                    orderId: order._id,
                    orderDetails: `Subscription: ${subscriptionPlan?.serviceName || 'N/A'}`,
                    orderDate: order.createdAt
                });

                await sendEmailOtp(user.email, "Order Confirmation", emailHtml);
            }
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            paymentId: paymentId
        });

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
                match: { userId: userId }
            })
            .populate('order.subscriptionId');

        // Filter out payments that don't belong to the user
        const userPayments = payments.filter(payment => payment.order);

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

        const payment = await Payment.findById(paymentId)
            .populate({
                path: 'order',
                match: { userId: userId }
            })
            .populate('order.subscriptionId');

        if (!payment || !payment.order) {
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