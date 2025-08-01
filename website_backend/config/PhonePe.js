const crypto = require('crypto');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Placeholder credentials (replace with process.env usage in production)
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Utility to generate X-VERIFY header
function generateXVerify(payload, apiEndpoint) {
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const stringToHash = base64Payload + apiEndpoint + PHONEPE_SALT_KEY;
    const xVerify = crypto.createHash('sha256').update(stringToHash).digest('hex') + '###' + PHONEPE_SALT_KEY;
    // Debug logs for signature generation
    console.log('--- PhonePe Signature Debug ---');
    console.log('Payload:', JSON.stringify(payload));
    console.log('API Endpoint:', apiEndpoint);
    console.log('Base64 Payload:', base64Payload);
    console.log('String to Hash:', stringToHash);
    console.log('Generated X-VERIFY:', xVerify);
    console.log('------------------------------');
    return { base64Payload, xVerify };
}

// Create PhonePe payment order
async function createPhonePeOrder(orderId, amount, userId) {
    const apiEndpoint = '/pg/v1/pay';
    const payload = {
        merchantId: PHONEPE_MERCHANT_ID,
        merchantTransactionId: orderId,
        amount: amount * 100, // in paise
        merchantUserId: userId,
        redirectUrl: 'http://localhost:8080/api/payment/verify-payment',
        redirectMode: 'POST',
        paymentInstrument: {
            type: 'PAY_PAGE',
        },
    };
    // Debug log for payload before signature
    console.log('--- PhonePe Order Creation Debug ---');
    console.log('OrderId:', orderId);
    console.log('Amount:', amount);
    console.log('UserId:', userId);
    console.log('Payload:', JSON.stringify(payload));
    console.log('------------------------------');
    const { base64Payload, xVerify } = generateXVerify(payload, apiEndpoint);
    const url = `${PHONEPE_BASE_URL}${apiEndpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
    };
    const data = { request: base64Payload };
    // Debug log for request
    console.log('PhonePe API URL:', url);
    console.log('Headers:', headers);
    console.log('Request Data:', data);
    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        // Log error response for debugging
        if (error.response) {
            console.error('PhonePe API Error Response:', error.response.status, error.response.data);
        } else {
            console.error('PhonePe API Error:', error.message);
        }
        throw error;
    }
}

// Check PhonePe payment status
async function checkPhonePePaymentStatus(orderId) {
    const apiEndpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${orderId}`;
    const url = `${PHONEPE_BASE_URL}${apiEndpoint}`;
    const xVerify = crypto.createHash('sha256').update(apiEndpoint + PHONEPE_SALT_KEY).digest('hex') + '###' + PHONEPE_SALT_KEY;
    const headers = {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
    };
    const response = await axios.get(url, { headers });
    return response.data;
}

module.exports = {
    createPhonePeOrder,
    checkPhonePePaymentStatus,
}; 