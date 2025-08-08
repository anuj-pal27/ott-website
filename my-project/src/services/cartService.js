import { fetchWithAuth } from './authService';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const cartService = {
  async addToCart(subscriptionPlanId, duration) {
    const response = await fetchWithAuth(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ subscriptionPlan: subscriptionPlanId, duration: duration })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add to cart');
    return data;
  },

  async getCart() {
    const response = await fetchWithAuth(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch cart');
    return data;
  },

  async removeFromCart(itemId) {
    const response = await fetchWithAuth(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to remove from cart');
    return data;
  },

  async updateCartItem(itemId, duration) {
    const response = await fetchWithAuth(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ duration: duration })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update cart item');
    return data;
  }
};

export default cartService; 