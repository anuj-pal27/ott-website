import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CartSidePanel = ({ isOpen, onClose }) => {
  const { cart, loading, error, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/cart-checkout');
  };

  const getDurationDetails = (item) => {
    if (!item.subscriptionPlan || !item.subscriptionPlan.durations) return null;
    return item.subscriptionPlan.durations.find(d => d.duration === item.duration);
  };

  const total = cart && cart.items
    ? cart.items.reduce((sum, item) => {
        const duration = getDurationDetails(item);
        return sum + (duration ? duration.price : 0);
      }, 0)
    : 0;

  return (
    <div className={`fixed inset-0 z-50 transition-all ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Side Panel */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          {!user ? (
            <div className="text-gray-500 text-center">Your cart is empty.</div>
          ) : loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
            <div className="text-gray-500 text-center">Your cart is empty.</div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => {
                const plan = item.subscriptionPlan;
                const duration = getDurationDetails(item);
                return (
                  <div key={item._id} className="flex items-center gap-4 border-b pb-4">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                      {plan && plan.iconImage ? (
                        <img src={plan.iconImage} alt={plan.serviceName || 'Service'} className="object-contain w-full h-full" />
                      ) : (
                        <div className="text-2xl font-bold text-primary">{plan && plan.serviceName ? plan.serviceName.charAt(0).toUpperCase() : 'S'}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{plan && plan.serviceName ? plan.serviceName : 'Service'}</div>
                      {duration && (
                        <div className="text-xs text-gray-700 mt-1">{duration.duration} &bull; ₹{duration.price}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="p-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-primary">₹{total}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-xl font-bold text-lg transition-all duration-300"
            disabled={!cart || !cart.items || cart.items.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidePanel; 