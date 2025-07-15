import React, { useState } from 'react';
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
          className="absolute top-2 left-2 md:top-4 md:left-4 z-20 dashboard-button-secondary px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm"
          onClick={() => navigate(user ? '/profile' : '/')}
          style={{ minWidth: 0, width: 'auto' }}
        >
          ← Back to Dashboard
        </button>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Logo</h2>
            </Link>
          </div>

          {/* Auth Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
            {/* Toggle Buttons */}
            <div className="flex bg-white/20 rounded-xl p-1 mb-8">
              <button
                onClick={() => !isLogin && handleToggleMode()}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isLogin
                    ? 'bg-white text-primary shadow-lg'
                    : 'text-white hover:text-gray-200'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => isLogin && handleToggleMode()}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !isLogin
                    ? 'bg-white text-primary shadow-lg'
                    : 'text-white hover:text-gray-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 text-sm">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-white font-medium text-sm">
                    Full Name
                  </label>
                  <div className="relative">
                    <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-white font-medium text-sm">
                  Phone Number
                </label>
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
                  <label className="block text-white font-medium text-sm">
                    Email Address
                  </label>
                  <div className="relative">
                    <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300"
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
                  disabled={otpLoading || (isLogin ? !formData.phone : (!formData.phone || !formData.email || !formData.name))}
                  className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
                >
                  {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              )}

              {otpSent && (
                <div className="space-y-2">
                  <label className="block text-white font-medium text-sm">
                    OTP Code
                  </label>
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
                      className="flex-1 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
                    >
                      {loading ? 'Verifying...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                    <button
                      type="button"
                      onClick={isLogin ? handleSendLoginOtp : handleSendSignupOtp}
                      disabled={otpLoading}
                      className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
                    >
                      {otpLoading ? '...' : 'Resend'}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !otpSent}
                className="w-full bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-white/30"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-white/30"></div>
              <span className="px-4 text-white/60 text-sm">or</span>
              <div className="flex-1 border-t border-white/30"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={handleToggleMode}
                  className="text-white hover:text-secondary font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;