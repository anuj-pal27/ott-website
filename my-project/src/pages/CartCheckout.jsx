import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaTrash, FaTimes, FaCheck, FaEdit, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import paymentService from '../services/paymentService';
import SvgEffect from '../components/SvgEffect';
const Footer = React.lazy(() => import('../components/Footer'));

function CartCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingDuration, setEditingDuration] = useState(null);
  const [updatingDuration, setUpdatingDuration] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    phone: '',
    email: ''
  });
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, removeFromCart, updateCartItem } = useCart();

  // Track viewport to determine desktop vs mobile
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize collapsed sections (expand on desktop, collapse on mobile)
  useEffect(() => {
    if (cart && cart.items && cart.items.length > 0) {
      const initialCollapsedState = {};
      cart.items.forEach(item => {
        initialCollapsedState[`${item._id}-description`] = !isDesktop;
        initialCollapsedState[`${item._id}-features`] = !isDesktop;
        initialCollapsedState[`${item._id}-sample`] = true; // keep sample collapsed by default
      });
      setCollapsedSections(initialCollapsedState);
    }
  }, [cart, isDesktop]);

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        country: user.country || 'India',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Redirect if no cart items
  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (!cart || !cart.items || cart.items.length === 0) {
      setError('No items in cart');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Proceed to payment
      const response = await paymentService.checkout();
      window.location.href = response.paymentUrl;
    } catch (err) {
      setError(err.message || 'Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleDurationChange = async (itemId, newDuration) => {
    try {
      setUpdatingDuration(itemId);
      await updateCartItem(itemId, newDuration);
      setEditingDuration(null);
    } catch (err) {
      setError('Failed to update duration');
    } finally {
      setUpdatingDuration(null);
    }
  };

  const startEditingDuration = (itemId) => {
    setEditingDuration(itemId);
  };

  const cancelEditingDuration = () => {
    setEditingDuration(null);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (err) {
      setError('Failed to remove item from cart');
    }
  };

  const toggleSection = (itemId, section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [`${itemId}-${section}`]: !prev[`${itemId}-${section}`]
    }));
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  const total = cart.items.reduce((sum, item) => {
    const plan = item.subscriptionPlan;
    const duration = plan?.durations?.find(d => d.duration === item.duration);
    return sum + (duration?.price || 0);
  }, 0);

  const totalOriginalPrice = cart.items.reduce((sum, item) => {
    const plan = item.subscriptionPlan;
    const duration = plan?.durations?.find(d => d.duration === item.duration);
    return sum + (duration?.originalPrice || duration?.price || 0);
  }, 0);

  const totalSavings = totalOriginalPrice - total;

  return (
    <div className="dashboard-theme">
      {/* SVG Background */}
      <div className="dashboard-background">
        <SvgEffect />
      </div>
      {/* Additional gradient overlays for depth */}
      <div className="dashboard-gradient-overlay"></div>
      <div className="dashboard-gradient-top"></div>
      {/* Glassmorphism Overlay */}
      <div className="dashboard-glassmorphism"></div>
      
      {/* Content */}
      <div className="dashboard-content pb-24 lg:pb-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <button
            onClick={handleClose}
            className="dashboard-button-back w-full sm:w-auto"
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="dashboard-heading text-xl sm:text-2xl lg:text-3xl text-center sm:text-left">Cart Checkout</h1>
        </div>

        {/* Error Display */}
        {error && (
          <div className="dashboard-error mb-6">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content - Cart Items */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Cart Items */}
            <div className="dashboard-card">
              <h3 className="dashboard-heading text-lg sm:text-xl lg:text-2xl mb-4 flex items-center gap-2 justify-center sm:justify-start">
                <span>🛒</span>
                Cart Items ({cart.items.length})
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {cart.items.map((item) => {
                  const plan = item.subscriptionPlan;
                  const duration = plan?.durations?.find(d => d.duration === item.duration);
                  return (
                    <div key={item._id} className="border border-white/20 rounded-xl bg-white/5 overflow-hidden">
                      {/* Service Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-white/20 relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center overflow-hidden border border-white/20">
                          {plan?.iconImage ? (
                            <img 
                              src={plan.iconImage} 
                              alt={plan.serviceName} 
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-secondary/20 to-primary/20">
                              <div className="text-base sm:text-lg font-bold text-secondary">
                                {plan?.serviceName ? plan.serviceName.charAt(0).toUpperCase() : 'S'}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <div className="font-semibold dashboard-text text-base sm:text-lg truncate">{plan?.serviceName || 'Service'}</div>
                            {plan?.category && (
                              <span className="inline-block bg-secondary/20 text-secondary font-semibold px-2 py-1 rounded-full text-xs self-start sm:self-auto">
                                {plan.category === 'music' ? 'Music Premium' :
                                 plan.category === 'ott' ? 'OTT Platforms' :
                                 plan.category === 'professional' ? 'Professional' :
                                 plan.category === 'others' ? 'Others' :
                                 plan.category}
                              </span>
                            )}
                          </div>
                          
                          {/* Duration Selection */}
                          {editingDuration === item._id ? (
                            <div className="mt-3">
                              <div className="text-sm dashboard-text-muted mb-2">Select Duration:</div>
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {plan?.durations?.filter(d => d.isActive).map((dur, idx) => (
                                  <div 
                                    key={idx}
                                    className={`border-2 rounded-lg p-2 sm:p-3 transition-all ${
                                      updatingDuration === item._id 
                                        ? 'border-gray-400 bg-gray-400/10 cursor-not-allowed' 
                                        : item.duration === dur.duration 
                                          ? 'border-secondary bg-secondary/10 cursor-pointer' 
                                          : 'border-white/20 hover:border-secondary/50 cursor-pointer'
                                    }`}
                                    onClick={() => !updatingDuration && handleDurationChange(item._id, dur.duration)}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                          updatingDuration === item._id && item.duration === dur.duration
                                            ? 'border-gray-400 bg-gray-400'
                                            : item.duration === dur.duration 
                                              ? 'border-secondary bg-secondary' 
                                              : 'border-white/40'
                                        }`}>
                                          {updatingDuration === item._id && item.duration === dur.duration ? (
                                            <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin"></div>
                                          ) : item.duration === dur.duration && (
                                            <FaCheck size={8} className="text-white" />
                                          )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="font-semibold dashboard-text text-sm truncate">{dur.duration}</div>
                                          <div className="text-xs dashboard-text-muted truncate">{dur.description}</div>
                                        </div>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                       {dur.originalPrice && dur.originalPrice !== dur.price && (
                                         <div className="line-through text-gray-400 text-xs">
                                           ₹{dur.originalPrice}
                                         </div>
                                       )}
                                       <div className="font-bold text-secondary text-sm">
                                         ₹{dur.price}
                                       </div>
                                     </div>
                                   </div>
                                    {/* Stock Status */}
                                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                      <div className="text-xs text-gray-500">
                                        {dur.slotsAvailable > 0 ? (
                                          <span className="text-green-400">
                                            ✓ In Stock ({dur.slotsAvailable} available)
                                          </span>
                                        ) : (
                                          <span className="text-red-400">✗ Out of Stock</span>
                                        )}
                                      </div>
                                      {dur.originalPrice && dur.originalPrice !== dur.price && (
                                        <div className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full self-start sm:self-auto">
                                          {Math.round(((dur.originalPrice - dur.price) / dur.originalPrice) * 100)}% OFF
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <button
                                onClick={cancelEditingDuration}
                                className="mt-3 text-sm dashboard-text-muted hover:text-white transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
                              <div className="text-sm dashboard-text-muted">
                                {duration?.duration} • ₹{duration?.price || 0}
                                {duration?.originalPrice && duration.originalPrice !== duration.price && (
                                  <>
                                    <span className="line-through text-gray-400 ml-2">₹{duration.originalPrice}</span>
                                    <span className="ml-2 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                                      {Math.round(((duration.originalPrice - duration.price) / duration.originalPrice) * 100)}% OFF
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <button
                                  onClick={() => startEditingDuration(item._id)}
                                  className="flex items-center gap-1 text-sm bg-primary text-white hover:bg-secondary px-3 py-2 rounded-lg shadow transition-all"
                                  title="Change duration"
                                >
                                  <FaEdit size={12} />
                                  <span>Change Duration</span>
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(item._id)}
                                  className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1 rounded transition-all"
                                  title="Remove from cart"
                                >
                                  <FaTrash size={10} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Service Description */}
                      {plan?.description && (
                        <div className="border-b border-white/20">
                          {isDesktop ? (
                            <div className="flex items-center justify-between p-3 sm:p-4">
                              <h4 className="font-semibold dashboard-text">Description</h4>
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleSection(item._id, 'description')}
                              className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 transition-colors"
                            >
                              <h4 className="font-semibold dashboard-text">Description</h4>
                              {collapsedSections[`${item._id}-description`] ? (
                                <FaChevronDown className="text-secondary" />
                              ) : (
                                <FaChevronUp className="text-secondary" />
                              )}
                            </button>
                          )}
                          {(isDesktop || !collapsedSections[`${item._id}-description`]) && (
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                              <div className="dashboard-text-muted text-sm leading-relaxed">
                                {plan.description.split(/[\n\r\.]|\u2022/).map((desc, idx) => {
                                  const trimmed = desc.trim();
                                  return trimmed ? (
                                    <div key={idx} className="flex items-start gap-2 mb-1">
                                      <span className="text-secondary mt-1 flex-shrink-0">•</span>
                                      <span className="break-words">{trimmed}</span>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sample Link */}
                      {plan?.sampleLink && (
                        <div className="border-t border-white/20">
                          <button
                            onClick={() => toggleSection(item._id, 'sample')}
                            className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 transition-colors"
                          >
                            <h4 className="font-semibold dashboard-text">Sample</h4>
                            {collapsedSections[`${item._id}-sample`] ? (
                              <FaChevronDown className="text-secondary" />
                            ) : (
                              <FaChevronUp className="text-secondary" />
                            )}
                          </button>
                          {!collapsedSections[`${item._id}-sample`] && (
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                              <a
                                href={plan.sampleLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold border border-secondary text-secondary bg-white/5 hover:bg-secondary hover:text-white transition-all text-sm"
                                title="Open sample link in a new tab"
                              >
                                <span>🔗</span>
                                <span>View Sample</span>
                              </a>
                              <p className="text-xs dashboard-text-muted mt-1">(Google Drive, etc.)</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Service Features */}
                      {plan?.features && plan.features.length > 0 && (
                        <div className="border-t border-white/20">
                          {isDesktop ? (
                            <div className="flex items-center justify-between p-3 sm:p-4">
                              <h4 className="font-semibold dashboard-text">Features</h4>
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleSection(item._id, 'features')}
                              className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 transition-colors"
                            >
                              <h4 className="font-semibold dashboard-text">Features</h4>
                              {collapsedSections[`${item._id}-features`] ? (
                                <FaChevronDown className="text-secondary" />
                              ) : (
                                <FaChevronUp className="text-secondary" />
                              )}
                            </button>
                          )}
                          {(isDesktop || !collapsedSections[`${item._id}-features`]) && (
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                {plan.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0 mt-1.5"></div>
                                    <span className="dashboard-text-muted text-sm break-words">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How We Deliver */}
            <div className="dashboard-card">
              <h3 className="dashboard-heading text-lg sm:text-xl lg:text-2xl mb-4 flex items-center gap-2 justify-center sm:justify-start">
                <FaShieldAlt className="text-secondary" />
                How We Deliver Our Services
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-xs sm:text-sm">1</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold dashboard-text text-sm sm:text-base">Instant Delivery</h4>
                    <p className="dashboard-text-muted text-xs sm:text-sm">Receive your credentials immediately after successful payment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-xs sm:text-sm">2</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold dashboard-text text-sm sm:text-base">24/7 Support</h4>
                    <p className="dashboard-text-muted text-xs sm:text-sm">Get help anytime via WhatsApp: <a href="https://wa.me/919353690229" className="text-secondary hover:text-primary transition-colors break-all">+91 9353690229</a></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-xs sm:text-sm">3</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold dashboard-text text-sm sm:text-base">100% Genuine & Legal</h4>
                    <p className="dashboard-text-muted text-xs sm:text-sm">All our services are genuine and 100% legal. We don't provide 3rd party or crack services.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-xs sm:text-sm">4</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold dashboard-text text-sm sm:text-base">Warranty & Replacement</h4>
                    <p className="dashboard-text-muted text-xs sm:text-sm">Full warranty with instant replacement if any issues arise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary & Checkout */}
          <div className="space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <div className="dashboard-card">
              <h3 className="dashboard-heading text-lg sm:text-xl lg:text-2xl mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cart.items.map((item) => {
                  const plan = item.subscriptionPlan;
                  const duration = plan?.durations?.find(d => d.duration === item.duration);
                  const hasDiscount = duration?.originalPrice && duration.originalPrice !== duration.price;
                  const discountPercentage = hasDiscount ? Math.round(((duration.originalPrice - duration.price) / duration.originalPrice) * 100) : 0;
                  
                  return (
                    <div key={item._id} className="border-b border-white/20 pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="dashboard-text-muted text-sm">Service:</span>
                        <span className="font-medium dashboard-text text-sm text-right break-words">{plan?.serviceName || 'Service'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="dashboard-text-muted text-sm">Duration:</span>
                        <span className="font-medium dashboard-text text-sm">{item.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="dashboard-text-muted text-sm">Price:</span>
                        <div className="text-right">
                          {hasDiscount && (
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-green-500 text-xs font-semibold">↓{discountPercentage}%</span>
                              <span className="line-through text-gray-400 text-xs">₹{duration.originalPrice}</span>
                            </div>
                          )}
                          <span className="font-bold text-primary text-base sm:text-lg">
                            ₹{duration?.price || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {totalSavings > 0 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
                    <div className="text-green-500 text-sm font-semibold text-center">
                      You'll save ₹{totalSavings.toLocaleString()} on this order!
                    </div>
                  </div>
                )}
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold dashboard-text">Total:</span>
                    <div className="text-right">
                      {totalSavings > 0 && (
                        <div className="line-through text-gray-400 text-sm mb-1">
                          ₹{totalOriginalPrice.toLocaleString()}
                        </div>
                      )}
                      <span className="font-bold text-secondary text-lg sm:text-xl">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="dashboard-card">
              <h3 className="dashboard-heading text-lg sm:text-xl lg:text-2xl mb-4">Billing Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="dashboard-form-label">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    className="dashboard-input"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="dashboard-form-label">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="dashboard-input"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                <div>
                  <label className="dashboard-form-label">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="dashboard-input"
                    placeholder="Your email address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="dashboard-card">
              <button
                onClick={handleCheckout}
                disabled={loading || !cart || !cart.items || cart.items.length === 0}
                className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${
                  loading || !cart || !cart.items || cart.items.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-secondary text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                {loading ? 'Processing...' : `Proceed to Payment - ₹${total}`}
              </button>
              {error && <div className="text-red-500 mt-4 text-center text-sm">{error}</div>}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Suspense fallback={<div className="dashboard-loading">Loading footer...</div>}>
          <Footer />
        </Suspense>

        {/* Mobile Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-40 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {totalSavings > 0 && (
                <div className="text-green-600 text-sm font-semibold mb-1">
                  You'll save ₹{totalSavings.toLocaleString()} on this order!
                </div>
              )}
              <div className="flex items-center gap-2">
                {totalSavings > 0 && (
                  <span className="line-through text-gray-400 text-sm">
                    ₹{totalOriginalPrice.toLocaleString()}
                  </span>
                )}
                <span className="font-bold text-xl text-gray-900">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading || !cart || !cart.items || cart.items.length === 0}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                loading || !cart || !cart.items || cart.items.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-secondary shadow-lg'
              }`}
            >
              {loading ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-primary">Login Required</h2>
            <p className="mb-6 text-gray-700 text-sm sm:text-base">You need to be logged in to proceed with checkout. Please login or sign up to continue.</p>
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
  );
}

export default CartCheckout; 