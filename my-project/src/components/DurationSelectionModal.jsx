import React, { useState } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const DurationSelectionModal = ({ plan, isOpen, onClose }) => {
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!isOpen || !plan) return null;

  const activeDurations = plan.durations ? plan.durations.filter(d => d.isActive) : [];

  const handleConfirm = async () => {
    if (!activeDurations[selectedDuration]) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addToCart(plan._id, activeDurations[selectedDuration].duration);
      navigate('/checkout');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDuration(0);
    onClose();
  };

  const CATEGORY_LABELS = {
    music: 'Music Premium',
    ott: 'OTT Platforms',
    professional: 'Professional Subscriptions',
    others: 'Others',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{plan.serviceName}</h2>
            <p className="text-sm text-gray-600 mt-1">Select Duration Option</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Plan Image */}
        <div className="p-6 border-b">
          <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
            {plan.iconImage ? (
              <img 
                src={plan.iconImage} 
                alt={plan.serviceName} 
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="text-3xl font-bold text-primary">
                  {plan.serviceName ? plan.serviceName.charAt(0).toUpperCase() : 'S'}
                </div>
              </div>
            )}
          </div>
        </div>

        {plan.category && (
          <div className="px-6 pt-4">
            <span className="inline-block bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-xs mb-2">
              {CATEGORY_LABELS[plan.category] || plan.category}
            </span>
          </div>
        )}

        {/* Duration Options */}
        <div className="p-6">
          <div className="space-y-3">
            {activeDurations.map((duration, idx) => (
              <div 
                key={idx}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedDuration === idx 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-primary/30'
                }`}
                onClick={() => setSelectedDuration(idx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedDuration === idx 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300'
                      }`}>
                        {selectedDuration === idx && (
                          <FaCheck size={8} className="text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{duration.duration}</div>
                        <div className="text-sm text-gray-600 mt-1">{duration.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {duration.originalPrice && duration.originalPrice !== duration.price && (
                      <div className="line-through text-gray-400 text-sm">
                        ₹{duration.originalPrice}
                      </div>
                    )}
                    <div className="font-bold text-primary text-lg">
                      ₹{duration.price}
                    </div>
                  </div>
                </div>
                {/* Stock Status */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {duration.slotsAvailable > 0 ? (
                      <span className="text-green-600">
                        ✓ In Stock ({duration.slotsAvailable} available)
                      </span>
                    ) : (
                      <span className="text-red-600">✗ Out of Stock</span>
                    )}
                  </div>
                  {duration.originalPrice && duration.originalPrice !== duration.price && (
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {Math.round(((duration.originalPrice - duration.price) / duration.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          {plan.features && plan.features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <div className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !activeDurations[selectedDuration] || activeDurations[selectedDuration].slotsAvailable === 0}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                activeDurations[selectedDuration] && activeDurations[selectedDuration].slotsAvailable > 0 && !loading
                  ? 'bg-primary hover:bg-secondary text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading
                ? 'Processing...'
                : activeDurations[selectedDuration] && activeDurations[selectedDuration].slotsAvailable > 0
                  ? `Checkout - ₹${activeDurations[selectedDuration].price}`
                  : 'Out of Stock'
              }
            </button>
          </div>
        </div>
        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-primary">Login Required</h2>
              <p className="mb-6 text-gray-700">You need to be logged in to add this subscription to your cart and proceed to checkout. Please login or sign up to continue.</p>
              <button
                className="dashboard-button-primary w-full mb-2"
                onClick={() => navigate('/auth')}
              >
                Login / Signup
              </button>
              <button
                className="w-full py-2 mt-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DurationSelectionModal; 