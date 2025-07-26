const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const sendEmailOtp = require("../utils/sendEmailOtp");
const orderPlacedEmailTemplate = require("../utils/orderPlacedEmailTemplate");
// const PhonePe = require("../config/PhonePe");
const { StandardCheckoutClient, Env, StandardCheckoutPayRequest } = require('pg-sdk-node');
const { randomUUID } = require('crypto');
const dotenv = require('dotenv');

dotenv.config();    

// Validate environment variables
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;


const clientVersion = 1;
const env = Env.SANDBOX; // or Env.PRODUCTION

let client;
try {
    client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
} catch (error) {
    console.error('❌ Failed to initialize PhonePe SDK client:', error);
    process.exit(1);
}

// Create checkout session (PhonePe)
const checkout = async (req, res) => {
    try {
        console.log('🔄 Starting checkout process...');
        
        const userId = req.user.userId;
        console.log('👤 User ID:', userId);
        
        const cart = await Cart.findOne({ user: userId }).populate("items.subscriptionPlan");
        if (!cart || cart.items.length === 0) {
            console.log('❌ Cart is empty for user:', userId);
            return res.status(400).json({ message: "Cart is empty" });
        }

        console.log('🛒 Cart items found:', cart.items.length);
        
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
        console.log('💰 Total amount:', totalAmount);

        const firstItem = items[0];
        // Find durationInDays for the selected duration
        let endDate = null;
        if (firstItem.selectedDuration && firstItem.selectedDuration.duration) {
            const plan = cart.items[0].subscriptionPlan;
            const selectedDuration = plan.durations.find(d => d.duration === firstItem.selectedDuration.duration);
            if (selectedDuration && selectedDuration.durationInDays) {
                endDate = new Date(Date.now() + selectedDuration.durationInDays * 24 * 60 * 60 * 1000);
            } else if (firstItem.selectedDuration.duration === 'Lifetime' || firstItem.selectedDuration.duration === 'One-time') {
                endDate = null;
            }
        }
        const order = new Order({
            userId: userId,
            subscriptionId: firstItem.subscriptionPlan,
            selectedDuration: firstItem.selectedDuration,
            payment: [],
            startDate: new Date(),
            endDate: endDate,
        });
        await order.save();
        
        const merchantOrderId = randomUUID();
        const amount = totalAmount * 100; // in paise
        const redirectUrl = `http://localhost:5173/payment-status?paymentId=${merchantOrderId}`;

        console.log('🔗 Redirect URL:', redirectUrl);
        
        const request = StandardCheckoutPayRequest.builder()
            .merchantOrderId(merchantOrderId)
            .amount(amount)
            .redirectUrl(redirectUrl)
            .build();
            
        console.log('📤 Sending request to PhonePe...');
        const response = await client.pay(request);
        console.log('📥 PhonePe response received:', JSON.stringify(response, null, 2));
        
        const paymentUrl = response.redirectUrl;
         if (!paymentUrl) {
            console.error('❌ No payment URL in PhonePe response');
            return res.status(500).json({ 
                success: false, 
                message: "Failed to get payment URL from PhonePe", 
                details: response 
            });
         }
        
        console.log('🔗 Payment URL generated:', paymentUrl);
        
        const payment = new Payment({
            order: order._id,
            paymentAmount: totalAmount,
            paymentId: merchantOrderId,
            paymentStatus: "pending",
            paymentMethod: "phonepe",
        });
        await payment.save();
        console.log('💳 Payment record created:', payment._id);

        order.payment.push(payment._id);
        await order.save();

        await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
        console.log('🛒 Cart cleared for user:', userId);

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            orderId: order._id,
            paymentId: merchantOrderId,
            paymentUrl,
            amount: totalAmount,
            currency: "INR",
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
        const statusResponse = await client.getOrderStatus(paymentId);
        console.log('📥 PhonePe status response received:', statusResponse);
        const paymentStatus = statusResponse.state;
        console.log('📥 Payment status:', paymentStatus);
        const payment = await Payment.findOne({ paymentId });
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }
        if (paymentStatus === 'COMPLETED') {
        payment.paymentStatus = "success";
        payment.paymentDate = new Date();
        // Update order
        const order = await Order.findById(payment.order);
        if (order) {
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
            // Add subscription to user
            const user = await User.findByIdAndUpdate(order.userId, { $push: { subscriptionPlan: order.subscriptionId } }, { new: true });
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
        } else if (paymentStatus === 'PENDING') {
            payment.paymentStatus = "pending";
        } else {
            payment.paymentStatus = "failed";
        }
        await payment.save();
        if (payment.paymentStatus === 'success') {
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
            });

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
        const payment = await Payment.findOne({ paymentId })
            .populate({
                path: 'order',
                match: { userId: userId },
                populate: [
                  { path: 'subscriptionId', model: 'SubscriptionPlan' },
                  { path: 'userId', model: 'User' }
                ]
            });
        console.log('📥 Payment:', payment);
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