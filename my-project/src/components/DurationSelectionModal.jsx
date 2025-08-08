import React, { useState } from 'react';
import { FaTimes, FaCheck, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const DurationSelectionModal = React.memo(({ plan, isOpen, onClose }) => {
  if (!isOpen || !plan) return null;
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Reset carousel index when plan changes
  React.useEffect(() => { }, [plan]);

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
      navigate('/cart-checkout');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{plan.serviceName}</h2>
            {plan.sampleLink && (
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <a
                  href={plan.sampleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white transition-all shadow focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  title="Open sample link in a new tab"
                >
                  <FaExternalLinkAlt className="text-sm sm:text-base" />
                  <span>View Sample</span>
                </a>
                <span className="text-xs text-gray-500">(Google Drive, etc.)</span>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-1">Select Duration Option</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0 p-1"
          >
            <FaTimes size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 border-b">
          <div className="w-full h-24 sm:h-32 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
            {plan.iconImage ? (
              <img 
                src={plan.iconImage} 
                alt={plan.serviceName} 
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {plan.serviceName ? plan.serviceName.charAt(0).toUpperCase() : 'S'}
                </div>
              </div>
            )}
          </div>
        </div>

        {plan.category && (
          <div className="px-4 sm:px-6 pt-4">
            <span className="inline-block bg-primary/10 text-primary font-semibold px-2 sm:px-3 py-1 rounded-full text-xs mb-2">
              {CATEGORY_LABELS[plan.category] || plan.category}
            </span>
          </div>
        )}

        {/* Duration Options */}
        <div className="p-4 sm:p-6">
          <div className="space-y-3">
            {activeDurations.map((duration, idx) => (
              <div 
                key={idx}
                className={`border-2 rounded-xl p-3 sm:p-4 cursor-pointer transition-all ${
                  selectedDuration === idx 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-primary/30'
                }`}
                onClick={() => setSelectedDuration(idx)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedDuration === idx 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300'
                      }`}>
                        {selectedDuration === idx && (
                          <FaCheck size={10} className="text-white sm:w-2 sm:h-2" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{duration.duration}</div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{duration.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {duration.originalPrice && duration.originalPrice !== duration.price && (
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-green-500 text-xs font-semibold">↓{Math.round(((duration.originalPrice - duration.price) / duration.originalPrice) * 100)}%</span>
                        <span className="line-through text-gray-400 text-xs">₹{duration.originalPrice}</span>
                      </div>
                    )}
                    <div className="font-bold text-primary text-base sm:text-lg">
                      ₹{duration.price}
                    </div>
                  </div>
                </div>
                {/* Stock Status */}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full self-start sm:self-auto">
                      {Math.round(((duration.originalPrice - duration.price) / duration.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {plan.description && (
              <div className="mt-4 mb-2">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-bold text-primary text-base sm:text-lg tracking-wide">Description</h3>
                  {showDescription ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                {showDescription && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <ul className="list-disc list-inside text-gray-800 text-sm sm:text-base leading-relaxed space-y-1 text-left pl-4">
                      {plan.description.split(/[\n\r\.]|\u2022/).map((desc, idx) => {
                        const trimmed = desc.trim();
                        return trimmed ? <li key={idx} className="break-words">{trimmed}</li> : null;
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          {/* Features */}
          {plan.features && plan.features.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Features</h3>
                {showFeatures ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>
              {showFeatures && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
                        <span className="text-xs sm:text-sm text-gray-600 break-words">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !activeDurations[selectedDuration] || activeDurations[selectedDuration].slotsAvailable === 0}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors text-sm sm:text-base ${
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-primary">Login Required</h2>
              <p className="mb-6 text-gray-700 text-sm sm:text-base">You need to be logged in to add this subscription to your cart and proceed to checkout. Please login or sign up to continue.</p>
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
});

export default DurationSelectionModal; 