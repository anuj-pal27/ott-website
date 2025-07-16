import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await cartService.getCart();
      setCart(data.cart);
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshCart();
      setError('');
    } else {
      setCart({ items: [] });
      setError('');
    }
  }, [user, refreshCart]);

  const addToCart = async (planId, duration) => {
    await cartService.addToCart(planId, duration);
    await refreshCart();
  };

  const removeFromCart = async (itemId) => {
    await cartService.removeFromCart(itemId);
    await refreshCart();
  };

  // Add clearCart function
  const clearCart = () => {
    setCart({ items: [] });
    setError('');
  };

  return (
    <CartContext.Provider value={{ cart, loading, error, addToCart, removeFromCart, refreshCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); 