const crypto = require('crypto');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Placeholder credentials (replace with process.env usage in production)
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'YOUR_PHONEPE_MERCHANT_ID';
// const PHONEPE_MERCHANT_KEY = process.env.PHONEPE_MERCHANT_KEY || 'YOUR_PHONEPE_MERCHANT_KEY';
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || 'YOUR_PHONEPE_SALT_KEY';
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Utility to generate X-VERIFY header
function generateXVerify(payload, apiEndpoint) {
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const stringToHash = base64Payload + apiEndpoint + PHONEPE_SALT_KEY;
    const xVerify = crypto.createHash('sha256').update(stringToHash).digest('hex') + '###' + PHONEPE_SALT_KEY;
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
        redirectUrl: process.env.PHONEPE_REDIRECT_URL || 'http://localhost:8080/api/payment/verify-payment',
        redirectMode: 'POST',
        paymentInstrument: {
            type: 'PAY_PAGE',
        },
    };
    const { base64Payload, xVerify } = generateXVerify(payload, apiEndpoint);
    const url = `${PHONEPE_BASE_URL}${apiEndpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
    };
    const data = { request: base64Payload };
    const response = await axios.post(url, data, { headers });
    return response.data;
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