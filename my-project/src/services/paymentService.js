const API_BASE_URL = 'http://localhost:8080/api';
import { fetchWithAuth } from './authService';

const paymentService = {
    async checkout() {
        const response = await fetchWithAuth(`${API_BASE_URL}/payment/checkout`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to checkout');
        return data;
    },
    async getPaymentDetails(paymentId) {
        const response = await fetchWithAuth(`${API_BASE_URL}/payment/payment-details/${paymentId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch payment details');
        return data.payment;
    },
    async getPaymentHistory() {
        const response = await fetchWithAuth(`${API_BASE_URL}/payment/payment-history`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch payment history');
        return data.payments;
    },
    async verifyPayment(paymentId) {
        const response = await fetchWithAuth(`${API_BASE_URL}/payment/verify-payment`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ paymentId })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to verify payment');
        return data;
    }
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export default paymentService;
