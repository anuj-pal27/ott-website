import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SvgEffect from '../components/SvgEffect';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

function Auth() {
  const navigate = useNavigate();
  const { login, signup, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const RESEND_INTERVAL = 60; // seconds

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    otp: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);

  const handleSendSignupOtp = async () => {
    if (!formData.phone || !formData.email || !formData.name) {
      setError('Please enter your phone number, email, and name');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      await authService.sendSignupOtp(formData.phone, formData.email, formData.name);
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
      await authService.sendLoginOtp(formData.phone);
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
        // Handle phone-based login
        if (!otpSent) {
          setError('Please send OTP first');
          setLoading(false);
          return;
        }

        const response = await login({
          phone: formData.phone,
          otp: formData.otp
        });

        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Handle phone-based signup
        if (!otpSent) {
          setError('Please send OTP first');
          setLoading(false);
          return;
        }

        const signupData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          otp: formData.otp
        };

        const response = await signup(signupData);

        setSuccess('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setOtpSent(false);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      otp: ''
    });
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
          onClick={() => navigate(user ? '/profile' : '/')}
          style={{ minWidth: 0, width: 'auto' }}
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center border border-primary/20">
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
                <h2 className="dashboard-heading text-3xl">Logo</h2>
              </Link>
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
                  Login
                </button>
                <button
                  onClick={() => isLogin && handleToggleMode()}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    !isLogin
                      ? 'bg-white text-primary shadow-lg'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Sign Up
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0"></div>
                      <label className="dashboard-label">
                        Full Name
                      </label>
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
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex-shrink-0"></div>
                    <label className="dashboard-label">
                      Phone Number
                    </label>
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
                      <label className="dashboard-label">
                        Email Address
                      </label>
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
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {!otpSent && (
                  <button
                    type="button"
                    onClick={isLogin ? handleSendLoginOtp : handleSendSignupOtp}
                    disabled={otpLoading || resendTimer > 0}
                    className="dashboard-button-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                )}

                {otpSent && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0"></div>
                      <label className="dashboard-label">
                        OTP Code
                      </label>
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
                        {loading ? 'Verifying...' : (isLogin ? 'Login' : 'Sign Up')}
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
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="dashboard-text-muted">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={handleToggleMode}
                    className="text-primary hover:text-secondary font-medium transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
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

export default Auth;