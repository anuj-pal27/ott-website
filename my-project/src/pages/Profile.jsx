import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SvgEffect from '../components/SvgEffect';
import Navbar from '../components/Navbar';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import LockIcon from '@mui/icons-material/Lock';
import authService from '../services/authService';
const Footer = React.lazy(() => import('../components/Footer'));

function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    profilePicture: ''
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.updateUserDetails({
        email: user.email,
        ...formData
      });

      // Update local user data
      updateUser(response.user);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    // This function is no longer needed as password change is removed
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      country: user.country || '',
      profilePicture: user.profilePicture || ''
    });
    setError('');
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="dashboard-theme">
      {/* Navbar */}
      <Navbar />
      
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
      <div className="dashboard-content py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="dashboard-heading">Profile</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <PersonIcon className="w-5 h-5 text-white" />
            </div>
            <p className="dashboard-subheading text-lg font-medium">Manage your account information and preferences</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="dashboard-error mb-8">
            {error}
          </div>
        )}
        {success && (
          <div className="dashboard-success mb-8">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="dashboard-card">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mx-auto mb-6">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-4xl">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-6">
                      <input
                        type="text"
                        name="profilePicture"
                        value={formData.profilePicture}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="Profile picture URL"
                      />
                    </div>
                  )}
                </div>
                
                <h2 className="dashboard-heading text-2xl mb-3">{user.name}</h2>
                <p className="dashboard-subheading mb-6">{user.email}</p>
                
                <div className="space-y-3 text-sm dashboard-text-muted">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.isEmailVerified ? 'bg-orange-400' : 'bg-red-400'}`}></span>
                    Email {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.isPhoneVerified ? 'bg-orange-400' : 'bg-red-400'}`}></span>
                    Phone {user.isPhoneVerified ? 'Verified' : 'Not Verified'}
                  </div>
                  <div className="text-primary font-medium pt-2">
                    {user.accountType === 'admin' ? 'Administrator' : 'User'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-8">
                <h3 className="dashboard-heading text-xl">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="dashboard-button-secondary flex items-center gap-2"
                  >
                    <EditIcon className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="dashboard-button-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      <SaveIcon className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="dashboard-button-danger flex items-center gap-2"
                    >
                      <CancelIcon className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="dashboard-form-label text-base">Full Name</label>
                    <div className="relative">
                      <PersonIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 disabled:opacity-50 disabled:bg-gray-50"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="dashboard-form-label text-base">Email Address</label>
                    <div className="relative">
                      <EmailIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-300 rounded-xl text-gray-500 opacity-50 cursor-not-allowed"
                        placeholder="Email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="dashboard-form-label text-base">Phone Number</label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 disabled:opacity-50 disabled:bg-gray-50"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="dashboard-form-label text-base">Country</label>
                    <div className="relative">
                      <LocationOnIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 disabled:opacity-50 disabled:bg-gray-50"
                        placeholder="Enter your country"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Suspense fallback={<div className="dashboard-loading">Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default Profile; 