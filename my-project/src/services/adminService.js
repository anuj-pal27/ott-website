import { fetchWithAuth } from './authService';
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

class AdminService {
  // Admin Signup
  async signup({ name, email, phone, password, adminSecret }) {
    const response = await fetch(`${API_BASE_URL}/admin/create-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, adminSecret })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Admin signup failed');
    return data;
  }

  // Admin Login
  async login({ email, password }) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Admin login failed');
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get all subscription plans
  async getAllSubscriptionPlans() {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/plans`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch plans');
      return data;
    } catch (error) {
      throw error;
    }
  }

  async addSubscriptionPlan(planData) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/plans`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(planData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add plan');
      console.log('Response from backend:', data);
      return data;
    } catch (error) {
      console.error('Error in addSubscriptionPlan:', error);
      throw error;
    }
  }

  async updateSubscriptionPlan(planId, planData) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/plans/${planId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(planData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update plan');
      return data;
    } catch (error) {
      console.error('Error in updateSubscriptionPlan:', error);
      throw error;
    }
  }

  async deleteSubscriptionPlan(planId) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete plan');
      return data;
    } catch (error) {
      console.error('Error in deleteSubscriptionPlan:', error);
      throw error;
    }
  }

  async getSubscriptionPlanById(planId) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/plans/${planId}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch plan');
      return data;
    } catch (error) {
      console.error('Error in getSubscriptionPlanById:', error);
      throw error;
    }
  }
  
}

const adminService = new AdminService();
export default adminService;
