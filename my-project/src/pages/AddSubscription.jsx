import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import SvgEffect from '../components/SvgEffect';
import { useAuth } from '../context/AuthContext';

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

const initialForm = {
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
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
    }
  ],
  planType: 'basic',
  category: 'other', // Set a default category
  features: [''],
  iconImage: '',
  sampleLink: '',
  isActive: true,
};

const PLAN_TYPES = ['basic', 'premium', 'family', 'enterprise'];

function AddSubscription() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);

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
  }, [navigate, isAuthenticated, user]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
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
      await adminService.addSubscriptionPlan(planData);
      setFormSuccess('Subscription plan added successfully!');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1200);
    } catch (err) {
      setFormError(err.message || 'Failed to add plan');
    } finally {
      setFormLoading(false);
    }
  };

  // Ensure 'other' and 'featured' are always present in the categories list for the dropdown
  let categoriesWithFeatured = categories.includes('featured') ? categories : [...categories, 'featured'];
  const categoriesWithOtherAndFeatured = categoriesWithFeatured.includes('other') ? categoriesWithFeatured : [...categoriesWithFeatured, 'other'];

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
            <h1 className="dashboard-form-title ml-4">Add Subscription Plan</h1>
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
                {categoriesWithOtherAndFeatured.map(cat => (
                  <option key={cat} value={cat} className='text-black'>{CATEGORY_ICON_MAP[cat]?.name || cat}</option>
                ))}
              </select>
            </div>
            <div className="dashboard-form-group">
              <label className="dashboard-form-label">Icon Image URL</label>
              <input
                type="text"
                name="iconImage"
                value={form.iconImage}
                onChange={handleFormChange}
                className="dashboard-input"
                placeholder="https://example.com/image.jpg"
                required
              />
              <p className="text-xs text-white/60 mt-1">
                Enter a valid image URL (e.g., https://picsum.photos/300/200)
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
            <button
              type="submit"
              disabled={formLoading}
              className="dashboard-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? 'Adding Plan...' : 'Add Subscription Plan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSubscription; 