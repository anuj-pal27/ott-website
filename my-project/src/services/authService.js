const API_BASE_URL = 'http://localhost:8080/api';

// Global logout handler (set by AuthContext)
let onSessionExpired = null;
function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

async function fetchWithAuth(url, options = {}) {
  const response = await fetch(url, options);
  if (response.status === 401) {
    // Session expired or invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onSessionExpired) onSessionExpired();
    throw new Error('Session expired. Please log in again.');
  }
  return response;
}

class AuthService {
  // Send OTP for signup (phone-based)
  async sendSignupOtp(phone, email, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/send-signup-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, email, name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Send OTP for login (phone-based)
  async sendLoginOtp(phone) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/send-login-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Legacy email OTP (for backward compatibility)
  async sendOtp(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Phone-based signup
  async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Phone-based login
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Legacy email-based login (for backward compatibility)
  async loginWithEmail(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update user details
  async updateUserDetails(userData) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/user/update-user-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user details');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get user details
  async getUserDetails(email) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/user/get-user-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user details');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Logout (clear token from localStorage)
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear any other auth-related data
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get stored user data
  getUser() {
    const user = localStorage.getItem('user') ;
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Send OTP for admin signup (phone verification)
  async sendAdminSignupOtp(phone, email, name, adminSecret) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/send-admin-signup-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, email, name, adminSecret }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Send OTP for admin login (phone verification)
  async sendAdminLoginOtp(phone) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/send-admin-login-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Admin signup
  async createAdmin(adminData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Admin creation failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Admin login
  async loginAdmin(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
export { fetchWithAuth, setSessionExpiredHandler }; 