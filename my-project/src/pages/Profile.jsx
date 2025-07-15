import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SvgEffect from '../components/SvgEffect';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import LockIcon from '@mui/icons-material/Lock';
import authService from '../services/authService';

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
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">Profile</h1>
            <p className="text-white/80">Manage your account information</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 mx-auto mb-4">
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
                      <div className="w-full h-full bg-white/20 flex items-center justify-center text-white font-bold text-4xl">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="mt-4">
                        <input
                          type="text"
                          name="profilePicture"
                          value={formData.profilePicture}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300"
                          placeholder="Profile picture URL"
                        />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                  <p className="text-white/80 mb-4">{user.email}</p>
                  
                  <div className="space-y-2 text-sm text-white/70">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${user.isEmailVerified ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      Email {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${user.isPhoneVerified ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      Phone {user.isPhoneVerified ? 'Verified' : 'Not Verified'}
                    </div>
                    <div className="text-primary-300 font-medium">
                      {user.accountType === 'admin' ? 'Administrator' : 'User'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Personal Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center gap-2"
                    >
                      <EditIcon className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="bg-green-500/20 hover:bg-green-500/30 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-green-500/30 flex items-center gap-2 disabled:opacity-50"
                      >
                        <SaveIcon className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-red-500/30 flex items-center gap-2"
                      >
                        <CancelIcon className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-white font-medium text-sm">Full Name</label>
                      <div className="relative">
                        <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300 disabled:opacity-50"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-white font-medium text-sm">Email Address</label>
                      <div className="relative">
                        <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/60 backdrop-blur-sm opacity-50 cursor-not-allowed"
                          placeholder="Email address"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-white font-medium text-sm">Phone Number</label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300 disabled:opacity-50"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-white font-medium text-sm">Country</label>
                      <div className="relative">
                        <LocationOnIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 focus:bg-white/30 transition-all duration-300 disabled:opacity-50"
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
      </div>
    </div>
  );
}

export default Profile; 