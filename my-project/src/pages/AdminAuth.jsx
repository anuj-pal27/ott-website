import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SvgEffect from '../components/SvgEffect';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import adminService from '../services/adminService';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

function AdminAuth() {
  const navigate = useNavigate();
  const { loginAdmin, createAdmin, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    adminSecret: '',
    otp: ''
  });
  const [resendTimer, setResendTimer] = useState(0);
  const RESEND_INTERVAL = 60; // seconds

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);

  const handleSendSignupOtp = async () => {
    if (!formData.phone || !formData.email || !formData.name || !formData.adminSecret) {
      setError('Please enter your phone number, email, name, and admin secret');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      await authService.sendAdminSignupOtp(formData.phone, formData.email, formData.name, formData.adminSecret);
      setOtpSent(true);
      setSuccess('OTP sent successfully to your phone!');
      setTimeout(() => setSuccess(''), 5000);
      setResendTimer(RESEND_INTERVAL);
    } catch (error) {
      setError(error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSendLoginOtp = async () => {
    if (!formData.phone) {
      setError('Please enter your phone number');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      await authService.sendAdminLoginOtp(formData.phone);
      setOtpSent(true);
      setSuccess('OTP sent successfully to your phone!');
      setTimeout(() => setSuccess(''), 5000);
      setResendTimer(RESEND_INTERVAL);
    } catch (error) {
      setError(error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        // Handle admin login with OTP
        if (!otpSent) {
          setError('Please send OTP first');
          setLoading(false);
          return;
        }

        // Use AuthContext to handle login (this will call the backend and handle session)
        await loginAdmin({
          phone: formData.phone,
          otp: formData.otp
        });
        
        setSuccess('Admin login successful! Redirecting...');
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1200);
      } else {
        // Handle admin signup with OTP
        if (!otpSent) {
          setError('Please send OTP first');
          setLoading(false);
          return;
        }

        const response = await createAdmin({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          adminSecret: formData.adminSecret,
          otp: formData.otp
        });
        
        setSuccess('Admin account created successfully! Redirecting to admin dashboard...');
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setOtpSent(false);
    setFormData({ name: '', email: '', phone: '', adminSecret: '', otp: '' });
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
        {/* Back to Dashboard Button */}
        <button
          className="dashboard-button-secondary absolute top-4 left-4 z-20 px-4 py-2 text-sm"
          onClick={() => navigate(user && user.accountType === 'admin' ? '/admin-dashboard' : '/')}
          style={{ minWidth: 0, width: 'auto' }}
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3">
                <img src={logo} alt="Vyapaar360" className="w-12 h-12 rounded-xl object-cover border border-primary/20" />
                <h2 className="dashboard-heading text-3xl">Vyapaar360 Admin</h2>
              </div>
            </div>

            {/* Auth Card */}
            <div className="dashboard-card">
              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                <button
                  onClick={() => !isLogin && handleToggleMode()}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    isLogin
                      ? 'bg-white text-primary shadow-lg'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Admin Login
                </button>
                <button
                  onClick={() => isLogin && handleToggleMode()}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    !isLogin
                      ? 'bg-white text-primary shadow-lg'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Admin Signup
                </button>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="dashboard-error-message mb-6">
                  {error}
                </div>
              )}
              {success && (
                <div className="dashboard-success-message mb-6">
                  {success}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex-shrink-0"></div>
                        <label className="dashboard-label">Full Name</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <PersonIcon className="text-gray-400 w-5 h-5 flex-shrink-0" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="dashboard-input"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex-shrink-0"></div>
                        <label className="dashboard-label">Admin Secret Key</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <PersonIcon className="text-gray-400 w-5 h-5 flex-shrink-0" />
                        <div className="relative flex-1">
                          <input
                            type={showAdminSecret ? 'text' : 'password'}
                            name="adminSecret"
                            value={formData.adminSecret}
                            onChange={handleInputChange}
                            className="dashboard-input pr-12"
                            placeholder="Enter admin secret key"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminSecret(!showAdminSecret)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showAdminSecret ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex-shrink-0"></div>
                    <label className="dashboard-label">Phone Number</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="text-gray-400 w-5 h-5 flex-shrink-0" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="dashboard-input"
                      placeholder="Enter your phone number"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                                    <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0"></div>
                      <label className="dashboard-label">Email Address</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <EmailIcon className="text-gray-400 w-5 h-5 flex-shrink-0" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="dashboard-input"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                )}

                {otpSent && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0"></div>
                      <label className="dashboard-label">OTP Code</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0"></div>
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        className="dashboard-input"
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading || !formData.otp || formData.otp.length !== 6}
                        className="dashboard-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : (isLogin ? 'Admin Login' : 'Create Admin Account')}
                      </button>
                      <button
                        type="button"
                        onClick={isLogin ? handleSendLoginOtp : handleSendSignupOtp}
                        disabled={otpLoading || resendTimer > 0}
                        className="dashboard-button-secondary disabled:opacity-50 disabled:cursor-not-allowed px-4"
                      >
                        {otpLoading ? '...' : resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                      </button>
                    </div>
                  </div>
                )}

                {!otpSent && (
                  <button
                    type="button"
                    onClick={isLogin ? handleSendLoginOtp : handleSendSignupOtp}
                    disabled={otpLoading || (isLogin ? !formData.phone : (!formData.phone || !formData.email || !formData.name || !formData.adminSecret))}
                    className="dashboard-button-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                )}
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="dashboard-text-muted">
                  {isLogin ? "Don't have an admin account? " : "Already an admin? "}
                  <button
                    onClick={handleToggleMode}
                    className="text-primary hover:text-secondary font-medium transition-colors"
                  >
                    {isLogin ? 'Sign up as Admin' : 'Sign in as Admin'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAuth; 