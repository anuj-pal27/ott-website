import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTimes, FaCheck, FaExternalLinkAlt, FaArrowLeft, FaShieldAlt, FaHeadset, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import paymentService from '../services/paymentService';
import SvgEffect from '../components/SvgEffect';
const Footer = React.lazy(() => import('../components/Footer'));

function Checkout() {
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    phone: '',
    email: ''
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  
  // Get plan from location state (passed from ServiceCard)
  const plan = location.state?.plan;

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

  // Redirect if no plan is provided
  useEffect(() => {
    if (!plan) {
      navigate('/');
    }
  }, [plan, navigate]);

  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!plan || !activeDurations[selectedDuration]) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Add to cart first
      await addToCart(plan._id, activeDurations[selectedDuration].duration);
      
      // Then proceed to payment
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

  if (!plan) {
    return null;
  }

  const activeDurations = plan.durations ? plan.durations.filter(d => d.isActive) : [];
  const selectedDurationData = activeDurations[selectedDuration];

  const CATEGORY_LABELS = {
    music: 'Music Premium',
    ott: 'OTT Platforms',
    professional: 'Professional Subscriptions',
    others: 'Others',
    'AI TOOLS': 'AI Tools',
    'GRAPHICS AND VIDEO EDITING SERVICES': 'Graphics & Video Editing',
    'WRITING TOOLS SERVICES': 'Writing Tools',
    'PRODUCTIVITY AND OFFICE MANAGEMENT SERVICES': 'Productivity & Office',
    'ONLINE MARKETING And SOFTWARE': 'Online Marketing & Software',
    'DATA EXTRACTER SERVICES': 'Data Extractor Services',
    'DATING SUBSCRIPTION': 'Dating Subscription',
    'featured': 'Featured Services',
    'other': 'Other Services'
  };

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
      <div className="dashboard-content">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleClose}
            className="dashboard-button-back"
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="dashboard-heading">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Card */}
            <div className="dashboard-card">
              <div className="flex items-start gap-4">
                {/* Service Icon */}
                <div className="w-24 h-24 flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden border border-white/20">
                  {plan.iconImage ? (
                    <img 
                      src={plan.iconImage} 
                      alt={plan.serviceName} 
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-secondary/20 to-primary/20">
                      <div className="text-2xl font-bold text-secondary">
                        {plan.serviceName ? plan.serviceName.charAt(0).toUpperCase() : 'S'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Service Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold dashboard-text">{plan.serviceName}</h2>
                    {plan.category && (
                      <span className="inline-block bg-secondary/20 text-secondary font-semibold px-3 py-1 rounded-full text-xs border border-secondary/30">
                        {CATEGORY_LABELS[plan.category] || plan.category}
                      </span>
                    )}
                  </div>
                  
                  {plan.sampleLink && (
                    <div className="mb-3">
                      <a
                        href={plan.sampleLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border-2 border-secondary text-secondary bg-white/10 hover:bg-secondary hover:text-white transition-all shadow focus:outline-none focus:ring-2 focus:ring-secondary backdrop-blur-sm"
                        title="Open sample link in a new tab"
                      >
                        <FaExternalLinkAlt className="text-base" />
                        <span>View Sample</span>
                      </a>
                      <span className="text-xs dashboard-text-muted ml-2">(Google Drive, etc.)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Duration Selection */}
            <div className="dashboard-card">
              <h3 className="dashboard-heading text-2xl mb-4">Select Duration</h3>
              <div className="space-y-3">
                {activeDurations.map((duration, idx) => (
                  <div 
                    key={idx}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedDuration === idx 
                        ? 'border-secondary bg-secondary/10' 
                        : 'border-white/30 hover:border-secondary/50 bg-white/5'
                    }`}
                    onClick={() => setSelectedDuration(idx)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedDuration === idx 
                          ? 'border-secondary bg-secondary' 
                          : 'border-white/50'
                      }`}>
                        {selectedDuration === idx && (
                          <FaCheck size={10} className="text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold dashboard-text text-lg">{duration.duration}</div>
                        <div className="text-sm dashboard-text-muted mt-1">{duration.description}</div>
                      </div>
                      </div>
                      <div className="text-right">
                        {duration.originalPrice && duration.originalPrice !== duration.price && (
                          <div className="line-through text-white/40 text-sm">
                            ₹{duration.originalPrice}
                          </div>
                        )}
                        <div className="font-bold text-secondary text-xl">
                          ₹{duration.price}
                        </div>
                      </div>
                    </div>
                    
                    {/* Stock Status */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm">
                        {duration.slotsAvailable > 0 ? (
                          <span className="text-green-400 flex items-center gap-1">
                            <FaCheckCircle size={12} />
                            In Stock ({duration.slotsAvailable} available)
                          </span>
                        ) : (
                          <span className="text-red-400">✗ Out of Stock</span>
                        )}
                      </div>
                      {duration.originalPrice && duration.originalPrice !== duration.price && (
                        <div className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full font-medium border border-green-500/30">
                          {Math.round(((duration.originalPrice - duration.price) / duration.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {plan.description && (
              <div className="dashboard-card">
                <h3 className="dashboard-heading text-2xl mb-4 text-center">Service Description</h3>
                <ul className="list-disc list-inside dashboard-text text-base leading-relaxed space-y-2 pl-4">
                  {plan.description.split(/[\n\r\.]|\u2022/).map((desc, idx) => {
                    const trimmed = desc.trim();
                    return trimmed ? <li key={idx}>{trimmed}</li> : null;
                  })}
                </ul>
              </div>
            )}

            {/* Features */}
            {plan.features && plan.features.length > 0 && (
              <div className="dashboard-card">
                <h3 className="dashboard-heading text-2xl mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                      <span className="dashboard-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How We Deliver */}
            <div className="dashboard-card">
              <h3 className="dashboard-heading text-2xl mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-secondary" />
                How We Deliver Our Services
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold dashboard-text">Instant Delivery</h4>
                    <p className="dashboard-text-muted text-sm">Receive your credentials immediately after successful payment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold dashboard-text">24/7 Support</h4>
                    <p className="dashboard-text-muted text-sm">Get help anytime via WhatsApp: <a href="https://wa.me/918250919483" className="text-secondary hover:text-primary transition-colors">+91 8250919483</a></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold dashboard-text">100% Genuine & Legal</h4>
                    <p className="dashboard-text-muted text-sm">All our services are genuine and 100% legal. We don't provide 3rd party or crack services.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold dashboard-text">Warranty & Replacement</h4>
                    <p className="dashboard-text-muted text-sm">Full warranty with instant replacement if any issues arise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary & Checkout */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="dashboard-card">
              <h3 className="dashboard-heading text-2xl mb-4">Order Summary</h3>
              <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                    <span className="dashboard-text-muted">Service:</span>
                    <span className="font-medium dashboard-text">{plan.serviceName}</span>
                  </div>
                {selectedDurationData && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="dashboard-text-muted">Duration:</span>
                      <span className="font-medium dashboard-text">{selectedDurationData.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="dashboard-text-muted">Price:</span>
                      <div className="text-right">
                        {selectedDurationData.originalPrice && selectedDurationData.originalPrice !== selectedDurationData.price && (
                          <div className="line-through text-gray-400 text-sm">
                            ₹{selectedDurationData.originalPrice}
                          </div>
                        )}
                        <span className="font-bold text-primary text-lg">
                          ₹{selectedDurationData.price}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold dashboard-text">Total:</span>
                    <span className="font-bold text-secondary text-xl">
                      ₹{selectedDurationData?.price || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="dashboard-card">
              <h3 className="dashboard-heading text-2xl mb-4">Billing Information</h3>
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
                  disabled={loading || !selectedDurationData || selectedDurationData.slotsAvailable === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    selectedDurationData && selectedDurationData.slotsAvailable > 0 && !loading
                      ? 'dashboard-button-primary'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                {loading
                  ? 'Processing...'
                  : selectedDurationData && selectedDurationData.slotsAvailable > 0
                    ? `Proceed to Payment - ₹${selectedDurationData.price}`
                    : 'Out of Stock'
                }
              </button>
              {error && (
                <div className="dashboard-error text-center mt-3">{error}</div>
              )}
            </div>

            {/* Support Info */}
            <div className="dashboard-card bg-gradient-to-r from-primary/20 to-secondary/20">
              <h4 className="dashboard-heading text-xl mb-3 flex items-center gap-2">
                <FaHeadset className="text-secondary" />
                Need Help?
              </h4>
              <p className="dashboard-text-muted text-sm mb-3">
                Contact us anytime for support or questions about your order.
              </p>
              <a
                href="https://wa.me/918250919483"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-secondary hover:text-primary font-medium text-sm transition-colors"
              >
                <FaHeadset />
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="dashboard-card max-w-sm w-full text-center">
            <h2 className="dashboard-heading mb-4">Login Required</h2>
            <p className="mb-6 dashboard-text-muted">You need to be logged in to proceed with checkout. Please login or sign up to continue.</p>
            <button
              className="dashboard-button-primary w-full mb-3"
              onClick={() => navigate('/auth')}
            >
              Login / Signup
            </button>
            <button
              className="dashboard-button-secondary w-full"
              onClick={() => setShowAuthModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Suspense fallback={<div className="dashboard-loading">Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default Checkout; 