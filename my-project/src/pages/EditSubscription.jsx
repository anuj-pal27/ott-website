import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../services/adminService';
import SvgEffect from '../components/SvgEffect';
import { useAuth } from '../context/AuthContext';

const PLAN_TYPES = ['basic', 'premium', 'family', 'enterprise'];

function EditSubscription() {
  const navigate = useNavigate();
  const { planId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({
    serviceName: '',
    description: '',
    price: '',
    durationInDays: '',
    durations: [
      {
        duration: '1 Month',
        description: '',
        price: '',
        originalPrice: '',
        slotsAvailable: 0,
        totalSlots: 0,
        isActive: true
      }
    ],
    planType: 'basic',
    originalPrice: '',
    slotsAvailable: '',
    totalSlots: '',
    features: [''],
    iconImage: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated() || !user || user.accountType !== 'admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/admin');
      return;
    }

    // Fetch plan data
    fetchPlanData();
  }, [navigate, planId, isAuthenticated, user]);

  const fetchPlanData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSubscriptionPlanById(planId);
      const plan = response.plan;
      
      // Format dates for input fields
      const startDate = plan.startDate ? new Date(plan.startDate).toISOString().split('T')[0] : '';
      const endDate = plan.endDate ? new Date(plan.endDate).toISOString().split('T')[0] : '';
      
      setForm({
        serviceName: plan.serviceName || '',
        description: plan.description || '',
        price: plan.price || '',
        durationInDays: plan.durationInDays || '',
        durations: plan.durations || [
          {
            duration: '1 Month',
            description: '',
            price: '',
            originalPrice: '',
            slotsAvailable: 0,
            totalSlots: 0,
            isActive: true
          }
        ],
        planType: plan.planType || 'basic',
        originalPrice: plan.originalPrice || '',
        slotsAvailable: plan.slotsAvailable || '',
        totalSlots: plan.totalSlots || '',
        features: plan.features && plan.features.length > 0 ? plan.features : [''],
        iconImage: plan.iconImage || '',
        startDate: startDate,
        endDate: endDate,
        isActive: plan.isActive !== undefined ? plan.isActive : true,
      });
    } catch (err) {
      setFormError(err.message || 'Failed to fetch plan data');
    } finally {
      setLoading(false);
    }
  };

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
    setForm({ ...form, durations: updated });
  };
  
  const addDurationField = () => {
    const newDuration = {
      duration: '1 Month',
      description: '',
      price: '',
      originalPrice: '',
      slotsAvailable: 0,
      totalSlots: 0,
      isActive: true
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
            <h1 className="dashboard-form-title">Edit Subscription Plan</h1>
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
                maxLength={500}
                required
              />
            </div>
            <div className="dashboard-form-grid">
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  className="dashboard-input"
                  required
                />
              </div>
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Original Price</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={form.originalPrice}
                  onChange={handleFormChange}
                  className="dashboard-input"
                  required
                />
              </div>
            </div>
            <div className="dashboard-form-grid">
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Duration (days)</label>
                <input
                  type="number"
                  name="durationInDays"
                  value={form.durationInDays}
                  onChange={handleFormChange}
                  className="dashboard-input"
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
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="dashboard-form-grid">
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Slots Available</label>
                <input
                  type="number"
                  name="slotsAvailable"
                  value={form.slotsAvailable}
                  onChange={handleFormChange}
                  className="dashboard-input"
                  required
                />
              </div>
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Total Slots</label>
                <input
                  type="number"
                  name="totalSlots"
                  value={form.totalSlots}
                  onChange={handleFormChange}
                  className="dashboard-input"
                  required
                />
              </div>
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
                          <option value="1 Month">1 Month</option>
                          <option value="3 Months">3 Months</option>
                          <option value="6 Months">6 Months</option>
                          <option value="1 Year">1 Year</option>
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
            <div className="dashboard-form-grid">
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleFormChange}
                  className="dashboard-input"
                  required
                />
              </div>
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleFormChange}
                  className="dashboard-input"
                  required
                />
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