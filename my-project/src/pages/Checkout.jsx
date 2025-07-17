import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import paymentService from '../services/paymentService';

function Checkout() {
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    phone: '',
    email: ''
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, error } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayNow = async e => {
    e.preventDefault();
    setPaying(true);
    setSuccess('');
    try {
      const response = await paymentService.checkout();
      const paymentId = response.orderId; // orderId is used as paymentId in backend
      navigate(`/payment-status?paymentId=${paymentId}`);
      setSuccess('Order created! Proceed to payment.');
      console.log(response);
    } catch (err) {
      // handle error if needed
    } finally {
      setPaying(false);
    }
  };

  const getDurationDetails = item => {
    if (!item.subscriptionPlan || !item.subscriptionPlan.durations) return null;
    const found = item.subscriptionPlan.durations.find(d => d.duration === item.duration);
    if (!found) {
      console.warn('No matching duration found for cart item:', item);
    }
    return found;
  };

  const total = cart && cart.items
    ? cart.items.reduce((sum, item) => {
        const duration = getDurationDetails(item);
        return sum + (duration ? duration.price : 0);
      }, 0)
    : 0;

  return (
    <div className="dashboard-theme min-h-screen py-10 px-2 relative">
      {/* Go to Dashboard Button - Top Left */}
      <button
        className="absolute top-4 left-4 z-20 dashboard-button-secondary px-4 py-2 rounded-xl font-semibold text-base shadow-md hover:bg-secondary hover:text-white transition-all"
        onClick={() => navigate('/')}
        style={{ minWidth: 0, width: 'auto' }}
      >
        ← Go to Dashboard
      </button>
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-primary">Login Required</h2>
            <p className="mb-6 text-gray-700">You need to be logged in to proceed to checkout. Please login or sign up to continue.</p>
            <button
              className="dashboard-button-primary w-full mb-2"
              onClick={() => navigate('/auth')}
            >
              Login / Signup
            </button>
            <button
              className="w-full py-2 mt-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
      <div className="dashboard-content max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Billing Details */}
        <form className="flex-1 dashboard-form-container space-y-6" onSubmit={handlePayNow} style={{ filter: showAuthModal ? 'blur(2px)' : 'none', pointerEvents: showAuthModal ? 'none' : 'auto' }}>
          <h2 className="dashboard-heading mb-4">Billing Details</h2>
          <div className="dashboard-form-grid">
            <div>
              <label className="dashboard-form-label">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleInputChange}
                className="dashboard-input"
                placeholder="Name"
                required
              />
            </div>
            <div>
              <label className="dashboard-form-label">Last Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleInputChange}
                className="dashboard-input"
                placeholder="Last Name"
                required
              />
            </div>
          </div>
          <div>
            <label className="dashboard-form-label">Country / Region <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleInputChange}
              className="dashboard-input"
              placeholder="Country or Region"
              required
            />
          </div>
          <div>
            <label className="dashboard-form-label">Phone <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              className="dashboard-input"
              placeholder="Phone"
              required
            />
          </div>
          <div>
            <label className="dashboard-form-label">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="dashboard-input"
              placeholder="Email Address"
              required
            />
          </div>
          <button
            type="submit"
            className="dashboard-button-primary w-full mt-4"
            disabled={paying}
          >
            {paying ? 'Processing...' : 'Pay Now'}
          </button>
          {success && <div className="dashboard-success mt-2">{success}</div>}
        </form>

        {/* Order Summary */}
        <div className="w-full md:w-96 flex-shrink-0 dashboard-card">
          <h2 className="dashboard-heading mb-4">Your Order</h2>
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <div className="flex justify-between font-medium mb-2">
              <span className='text-white'>Product</span>
              <span className='text-white'>Subtotal</span>
            </div>
            <div className="border-b border-white/20 mb-2"></div>
            {cart && cart.items && cart.items.map((item, idx) => {
              const plan = item.subscriptionPlan;
              const duration = getDurationDetails(item);
              return (
                <div key={item._id || idx} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                  <span className='text-white'  >
                    {plan.serviceName} - {duration?.duration}
                  </span>
                  <span className='text-white'>
                    ₹{duration?.price}
                  </span>
                </div>
              );
            })}
            <div className="flex justify-between font-semibold mt-4">
              <span className='text-white'>Total</span>
              <span className='text-white'>₹{total}</span>
            </div>
          </div>

 
        </div>
      </div>

    </div>
  );
}

export default Checkout; 