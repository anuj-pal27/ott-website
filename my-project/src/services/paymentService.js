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
