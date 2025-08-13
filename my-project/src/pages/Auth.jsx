import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SvgEffect from '../components/SvgEffect';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

function Auth() {
  const navigate = useNavigate();
  const { login, signup, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Handle email/password login
        if (!formData.email || !formData.password) {
          setError('Please enter your email and password');
          setLoading(false);
          return;
        }

        const response = await login({
          email: formData.email,
          password: formData.password
        });

        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Handle email/password signup
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        const signupData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null
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
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: ''
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
                <img src={logo} alt="Vyapaar360" className="w-12 h-12 rounded-xl object-cover border border-primary/20" />
                <h2 className="dashboard-heading text-3xl">Vyapaar360</h2>
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
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0"></div>
                      <label className="dashboard-label">
                        Phone Number (Optional)
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
                        placeholder="Enter your phone number (optional)"
                        maxLength="10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex-shrink-0"></div>
                    <label className="dashboard-label">
                      Password
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <LockIcon className="text-gray-400 w-5 h-5 flex-shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="dashboard-input"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0"></div>
                      <label className="dashboard-label">
                        Confirm Password
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <LockIcon className="text-gray-400 w-5 h-5 flex-shrink-0" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="dashboard-input"
                        placeholder="Confirm your password"
                        required={!isLogin}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="dashboard-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
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