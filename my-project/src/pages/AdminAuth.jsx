import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SvgEffect from '../components/SvgEffect';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import adminService from '../services/adminService';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-primary">
      {/* SVG Background */}
      <div className="absolute inset-0 w-full h-full">
        <SvgEffect />
      </div>
      {/* Additional gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        {/* Back to Dashboard Button */}
        <button
          className="absolute top-4 left-4 z-20 dashboard-button-secondary px-4 py-2 text-sm"
          onClick={() => navigate(user && user.accountType === 'admin' ? '/admin-dashboard' : '/')}
          style={{ minWidth: 0, width: 'auto' }}
        >
          ← Back to Dashboard
        </button>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Admin</h2>
            </div>
          </div>
          {/* Auth Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
            {/* Toggle Buttons */}
            <div className="flex bg-white/20 rounded-xl p-1 mb-8">
              <button
                onClick={() => !isLogin && handleToggleMode()}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${isLogin ? 'bg-white text-primary shadow-lg' : 'text-white hover:text-gray-200'}`}
              >
                Admin Login
              </button>
              <button
                onClick={() => isLogin && handleToggleMode()}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${!isLogin ? 'bg-white text-primary shadow-lg' : 'text-white hover:text-gray-200'}`}
              >
                Admin Signup
              </button>
            </div>
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 text-sm">{success}</div>
            )}
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="block text-white font-medium text-sm">Full Name</label>
                    <div className="relative">
                      <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-white font-medium text-sm">Admin Secret Key</label>
                    <div className="relative">
                      <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                      <input
                        type={showAdminSecret ? 'text' : 'password'}
                        name="adminSecret"
                        value={formData.adminSecret}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300"
                        placeholder="Enter admin secret key"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminSecret(!showAdminSecret)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showAdminSecret ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label className="block text-white font-medium text-sm">Phone Number</label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300"
                    placeholder="Enter your phone number"
                    maxLength="10"
                    required
                  />
                </div>
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-white font-medium text-sm">Email Address</label>
                  <div className="relative">
                    <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              )}

              {otpSent && (
                <div className="space-y-2">
                  <label className="block text-white font-medium text-sm">OTP Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300"
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading || !formData.otp || formData.otp.length !== 6}
                      className="flex-1 bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-white/30"
                    >
                      {loading ? 'Processing...' : (isLogin ? 'Admin Login' : 'Create Admin Account')}
                    </button>
                    <button
                      type="button"
                      onClick={isLogin ? handleSendLoginOtp : handleSendSignupOtp}
                      disabled={otpLoading || resendTimer > 0}
                      className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
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
                  className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
                >
                  {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              )}
            </form>
            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">
                {isLogin ? "Don't have an admin account? " : "Already an admin? "}
                <button
                  onClick={handleToggleMode}
                  className="text-white hover:text-secondary font-medium transition-colors"
                >
                  {isLogin ? 'Sign up as Admin' : 'Sign in as Admin'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAuth; 