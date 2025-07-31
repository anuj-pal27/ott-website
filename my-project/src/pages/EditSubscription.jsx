import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../services/adminService';
import SvgEffect from '../components/SvgEffect';
import { useAuth } from '../context/AuthContext';
import { FaUpload, FaImage, FaLink } from 'react-icons/fa';

const CATEGORY_ICON_MAP = {
  'AI TOOLS': { name: 'AI Tools' },
  'GRAPHICS AND VIDEO EDITING SERVICES': { name: 'Graphics & Video' },
  'WRITING TOOLS SERVICES': { name: 'Writing Tools' },
  'PRODUCTIVITY AND OFFICE MANAGEMENT SERVICES': { name: 'Productivity & Office' },
  'ONLINE MARKETING And SOFTWARE': { name: 'Marketing & Software' },
  'DATA EXTRACTER SERVICES': { name: 'Data Extractor' },
  'DATING SUBSCRIPTION': { name: 'Dating' },
  'ONLINE ENTERTAINMENT SERVICES': { name: 'Entertainment' },
  'subscriptions': { name: 'Streaming' },
  'software': { name: 'Software' },
  'websites': { name: 'Websites' },
  'tools': { name: 'Tools' },
  'music': { name: 'Music' },
  'other': { name: 'Other', icon: '📦' },
};

const PLAN_TYPES = ['basic', 'premium', 'family', 'enterprise'];

function EditSubscription() {
  const navigate = useNavigate();
  const { planId } = useParams();
  const { isAuthenticated, user } = useAuth();
  

  const [form, setForm] = useState({
    serviceName: '',
    description: '',
    durations: [
      {
        duration: '1 Month',
        description: '',
        price: '',
        originalPrice: '',
        slotsAvailable: 0,
        totalSlots: 0,
        isActive: true,
        startDate: '',
        endDate: ''
      }
    ],
    planType: 'basic',
    features: [''],
    iconImage: '',
    isActive: true,
    category: 'others', // Added category field
    sampleLink: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/plans/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Optionally, fetch service types dynamically if you have an endpoint, or map them based on category
  // For now, just use category as serviceType for new categories
  useEffect(() => {
    if (form.category) {
      setForm(f => ({ ...f, serviceType: f.category }));
    }
  }, [form.category]);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated() || !user || user.accountType !== 'admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/admin');
      return;
    }

    // Check if planId exists
    if (!planId) {
      setFormError('Plan ID is missing');
      return;
    }

    // Fetch plan data
    fetchPlanData();
  }, [navigate, planId, isAuthenticated, user]);

  const fetchPlanData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSubscriptionPlanById(planId);
      
      if (!response.success || !response.subscriptionPlan) {
        throw new Error('Plan not found or failed to fetch');
      }
      
      const plan = response.subscriptionPlan;

      setForm({
        serviceName: plan.serviceName || '',
        description: plan.description || '',
        durations: plan.durations && plan.durations.length > 0
          ? plan.durations.map(d => ({
              duration: d.duration || '1 Month',
              description: d.description || '',
              price: d.price || '',
              originalPrice: d.originalPrice || '',
              slotsAvailable: d.slotsAvailable || 0,
              totalSlots: d.totalSlots || 0,
              isActive: d.isActive !== undefined ? d.isActive : true,
              startDate: d.startDate ? new Date(d.startDate).toISOString().split('T')[0] : '',
              endDate: d.endDate ? new Date(d.endDate).toISOString().split('T')[0] : ''
            }))
          : [{
              duration: '1 Month',
              description: '',
              price: '',
              originalPrice: '',
              slotsAvailable: 0,
              totalSlots: 0,
              isActive: true,
              startDate: '',
              endDate: ''
            }],
        planType: plan.planType || 'basic',
        features: plan.features && plan.features.length > 0 ? plan.features : [''],
        iconImage: plan.iconImage || '',
        isActive: plan.isActive !== undefined ? plan.isActive : true,
        category: plan.category || 'others', // Set category from fetched data
        sampleLink: plan.sampleLink || '',
      });
      // Set image preview for existing image
      if (plan.iconImage) {
        setImagePreview(plan.iconImage);
      }
    } catch (err) {
      console.error('Error fetching plan data:', err);
      setFormError(err.message || 'Failed to fetch plan data');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setImageUploadLoading(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:8080/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setForm(prev => ({ ...prev, iconImage: data.imageUrl }));
        setImagePreview(data.imageUrl);
        setFormSuccess(`Image uploaded successfully! Size: ${(data.size / 1024).toFixed(1)}KB`);
        setTimeout(() => setFormSuccess(''), 3000);
      } else {
        setFormError(data.message || 'Failed to upload image');
      }
    } catch (error) {
      setFormError('Error uploading image. Please try again.');
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setForm(prev => ({ ...prev, iconImage: url }));
    setImagePreview(url);
    setSelectedImage(null);
  };

  const clearImage = () => {
    setForm({ ...form, iconImage: '' });
    setImagePreview('');
    setSelectedImage(null);
  };

  // Dynamic features list handlers
  const handleFeatureChange = (idx, value) => {
    const updated = [...form.features];
    updated[idx] = value;
    setForm({ ...form, features: updated });
  };
  
  const addFeatureField = () => setForm({ ...form, features: [...form.features, ''] });
  
  const removeFeatureField = (idx) => {
    if (form.features.length === 1) return;
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  };

  // Dynamic duration options handlers
  const handleDurationChange = (idx, field, value) => {
    const updated = [...form.durations];
    updated[idx] = { ...updated[idx], [field]: value };
    
    // Auto-calculate end date when duration changes
    if (field === 'duration') {
      const startDate = updated[idx].startDate ? new Date(updated[idx].startDate) : new Date();
      const endDate = calculateEndDate(startDate, value);
      updated[idx] = {
        ...updated[idx],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    }
    
    // Auto-calculate end date when start date changes
    if (field === 'startDate') {
      const startDate = new Date(value);
      const endDate = calculateEndDate(startDate, updated[idx].duration);
      updated[idx] = {
        ...updated[idx],
        endDate: endDate.toISOString().split('T')[0]
      };
    }
    
    setForm({ ...form, durations: updated });
  };

  // Calculate end date based on duration
  const calculateEndDate = (startDate, duration) => {
    const endDate = new Date(startDate);
    
    switch (duration) {
      case '1 Month':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case '3 Months':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case '6 Months':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case '1 Year':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case 'Lifetime':
        // Set to a far future date (50 years from now)
        endDate.setFullYear(endDate.getFullYear() + 50);
        break;
      case 'One-time':
        // For one-time, set end date to same as start date
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }
    
    return endDate;
  };
  
  const addDurationField = () => {
    const today = new Date();
    const endDate = calculateEndDate(today, '1 Month');
    const newDuration = {
      duration: '1 Month',
      description: '',
      price: '',
      originalPrice: '',
      slotsAvailable: 0,
      totalSlots: 0,
      isActive: true,
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
    setForm({ ...form, durations: [...form.durations, newDuration] });
  };
  
  const removeDurationField = (idx) => {
    if (form.durations.length === 1) return;
    setForm({ ...form, durations: form.durations.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');
    try {
      const planData = {
        ...form,
        features: form.features.filter(f => f.trim() !== '')
      };
      await adminService.updateSubscriptionPlan(planId, planData);
      setFormSuccess('Subscription plan updated successfully!');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1200);
    } catch (err) {
      setFormError(err.message || 'Failed to update plan');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-theme">
        <div className="dashboard-background">
          <SvgEffect />
        </div>
        <div className="dashboard-gradient-overlay"></div>
        <div className="dashboard-gradient-top"></div>
        <div className="dashboard-glassmorphism"></div>
        <div className="dashboard-content">
          <div className="dashboard-loading">Loading plan data...</div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="dashboard-theme">
        <div className="dashboard-background">
          <SvgEffect />
        </div>
        <div className="dashboard-gradient-overlay"></div>
        <div className="dashboard-gradient-top"></div>
        <div className="dashboard-glassmorphism"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="dashboard-loading">Loading subscription plan...</div>
        </div>
      </div>
    );
  }

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
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 py-12 overflow-y-auto">
        <div className="dashboard-form-container">
          {/* Header with back button */}
          <div className="dashboard-form-header">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="dashboard-button-back"
            >
              ← Back to Dashboard
            </button>
            <h1 className="dashboard-form-title ml-4">Edit Subscription Plan</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
          {formError && (
            <div className="dashboard-error">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="dashboard-success">
              {formSuccess}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Service Name</label>
              <input
                type="text"
                name="serviceName"
                value={form.serviceName}
                onChange={handleFormChange}
                className="dashboard-input"
                required
              />
            </div>
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                className="dashboard-textarea"
                rows={2}
                minLength={10}
                required
              />
            </div>
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Plan Type</label>
              <select
                name="planType"
                value={form.planType}
                onChange={handleFormChange}
                className="dashboard-select"
                required
              >
                {PLAN_TYPES.map(type => (
                  <option className='text-black' key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="dashboard-select"
                required
              >
              
                {categories.map(cat => (
                  <option key={cat} value={cat} className='text-black'>{CATEGORY_ICON_MAP[cat]?.name || cat}</option>
                ))}
              </select>
            </div>
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Icon Image</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="iconImage"
                  value={form.iconImage}
                  onChange={handleImageUrlChange}
                  className="flex-1 dashboard-input"
                  placeholder="https://example.com/image.jpg (optional)"
                />
                <label htmlFor="iconImageUpload" className="dashboard-button-secondary cursor-pointer flex items-center gap-1">
                  <FaImage />
                  <span>Upload</span>
                  <input
                    type="file"
                    id="iconImageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageUploadLoading}
                  />
                </label>
                {selectedImage && (
                  <button
                    type="button"
                    className="dashboard-button-secondary text-red-500 hover:text-red-600"
                    onClick={clearImage}
                    disabled={imageUploadLoading}
                  >
                    Clear
                  </button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={imagePreview} alt="Icon Preview" className="w-10 h-10 object-cover rounded-full" />
                  <p className="text-xs text-white/60">Selected Image: {selectedImage?.name || 'No image selected'}</p>
                </div>
              )}
              <p className="text-xs text-white/60 mt-1">
                Enter a valid image URL (e.g., https://picsum.photos/300/200) or upload an image.
              </p>
            </div>
            {/* Sample Link Section */}
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Sample Link (Google Drive, etc.) - Optional</label>
              <input
                type="text"
                name="sampleLink"
                value={form.sampleLink}
                onChange={handleFormChange}
                className="dashboard-input"
                placeholder="https://drive.google.com/drive/folders/..."
              
              />
              <p className="text-xs text-white/60 mt-1">Provide a link to a folder or file (e.g., Google Drive) for clients to view samples. This field is optional.</p>
            </div>
            {/* Duration Options Section */}
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Duration Options</label>
              <div className="space-y-4">
                {form.durations.map((duration, idx) => (
                  <div key={idx} className="border border-white/20 rounded-lg p-4 bg-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-medium">Duration Option {idx + 1}</h4>
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-2 py-1 text-xs font-bold"
                        onClick={() => removeDurationField(idx)}
                        disabled={form.durations.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Duration</label>
                        <select
                          value={duration.duration}
                          onChange={e => handleDurationChange(idx, 'duration', e.target.value)}
                          className="dashboard-select"
                          required
                        >
                          <option className='text-black' value="1 Month">1 Month</option>
                          <option className='text-black' value="3 Months">3 Months</option>
                          <option className='text-black' value="6 Months">6 Months</option>
                          <option className='text-black' value="1 Year">1 Year</option>
                          <option className='text-black' value="Lifetime">Lifetime</option>
                          <option className='text-black' value="One-time">One-time</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Description</label>
                        <input
                          type="text"
                          value={duration.description}
                          onChange={e => handleDurationChange(idx, 'description', e.target.value)}
                          className="dashboard-input"
                          placeholder="e.g., 1 Screen Login with Full Guarantee"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Price</label>
                        <input
                          type="number"
                          value={duration.price}
                          onChange={e => handleDurationChange(idx, 'price', e.target.value)}
                          className="dashboard-input"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Original Price</label>
                        <input
                          type="number"
                          value={duration.originalPrice}
                          onChange={e => handleDurationChange(idx, 'originalPrice', e.target.value)}
                          className="dashboard-input"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Slots Available</label>
                        <input
                          type="number"
                          value={duration.slotsAvailable}
                          onChange={e => handleDurationChange(idx, 'slotsAvailable', e.target.value)}
                          className="dashboard-input"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Total Slots</label>
                        <input
                          type="number"
                          value={duration.totalSlots}
                          onChange={e => handleDurationChange(idx, 'totalSlots', e.target.value)}
                          className="dashboard-input"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={duration.startDate}
                          onChange={e => handleDurationChange(idx, 'startDate', e.target.value)}
                          className="dashboard-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={duration.endDate}
                          className="dashboard-input bg-gray-100 cursor-not-allowed"
                          readOnly
                        />
                        <p className="text-xs text-white/60 mt-1">
                          Automatically calculated based on duration and start date
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={duration.isActive}
                          onChange={e => handleDurationChange(idx, 'isActive', e.target.checked)}
                          className="w-4 h-4 text-primary bg-white/20 border-white/30 rounded focus:ring-white/50"
                        />
                        <span className="ml-2 text-white/80 text-sm">Active Duration</span>
                      </label>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="dashboard-button-secondary w-full"
                  onClick={addDurationField}
                >
                  + Add Duration Option
                </button>
              </div>
            </div>
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Features</label>
              <div className="space-y-2">
                {form.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={feature}
                      onChange={e => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 dashboard-input"
                      placeholder={`Feature #${idx + 1}`}
                      required
                    />
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-2 py-1 text-xs font-bold"
                      onClick={() => removeFeatureField(idx)}
                      disabled={form.features.length === 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="dashboard-button-secondary mt-2"
                  onClick={addFeatureField}
                >
                  + Add Feature
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-primary bg-white/20 border-white/30 rounded focus:ring-white/50"
                />
                <span className="ml-2 dashboard-text text-sm">Active Plan</span>
              </label>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin-dashboard')}
                className="dashboard-button-secondary flex-1"
                disabled={formLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="dashboard-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? 'Updating Plan...' : 'Update Subscription Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditSubscription; 