import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { setSessionExpiredHandler } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in on app start
    const token = authService.getToken();
    const userData = authService.getUser();
    
    if (token && userData) {
      setUser(userData);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    // Set up global session expired handler
    setSessionExpiredHandler(() => {
      setUser(null);
      alert('Session expired. Please log in again.');
      // Redirect based on user type
      if (user && user.accountType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/auth');
      }
    });
    // Cleanup on unmount
    return () => setSessionExpiredHandler(null);
    // eslint-disable-next-line
  }, [user, navigate]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      
      // If signup is successful and returns token/user data, automatically log in
      if (response.token && response.user) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const loginAdmin = async (credentials) => {
    try {
      const response = await authService.loginAdmin(credentials);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const createAdmin = async (adminData) => {
    try {
      const response = await authService.createAdmin(adminData);
      
      // If admin creation is successful and returns token/user data, automatically log in
      if (response.token && response.user) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    loginAdmin,
    createAdmin,
    logout,
    updateUser,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 