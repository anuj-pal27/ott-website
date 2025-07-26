import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import ServiceCard from '../components/ServiceCard';
import SvgEffect from '../components/SvgEffect';
import { useAuth } from '../context/AuthContext';
import CategoryFilter from '../components/CategoryFilter';

function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredPlans, setFilteredPlans] = useState([]);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated() || !user || user.accountType !== 'admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/admin');
      return;
    }
    
    fetchPlans();
  }, [navigate, isAuthenticated, user]);

  useEffect(() => {
    setFilteredPlans(plans);
  }, [plans]);

  useEffect(() => {
    let filtered = plans;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plan => plan.category === selectedCategory);
    }
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(plan => plan.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredPlans(filtered);
  }, [selectedCategory, plans, searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchPlans = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getAllSubscriptionPlans();
      setPlans(data.plans || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  // Edit plan logic
  const handleEditPlan = (plan) => {
    navigate(`/admin-dashboard/edit/${plan._id}`);
  };

  // Delete plan
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await adminService.deleteSubscriptionPlan(planId);
      fetchPlans();
    } catch (err) {
      alert(err.message || 'Failed to delete plan');
    }
  };

  // Logout function
  const handleLogout = () => {
    logout();
    navigate('/admin');
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
      <div className="dashboard-content-scrollable px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <h1 className="dashboard-heading">Admin Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <button
              className="dashboard-button-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
              onClick={() => navigate('/admin-dashboard/add')}
            >
              + Add Subscription
            </button>
            <button
              className="dashboard-button-danger text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              onClick={() => navigate('/')}
              className="dashboard-button-back text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              ← Back to Home
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            className="dashboard-input w-full max-w-md"
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        {loading ? (
          <div className="dashboard-loading">Loading subscriptions...</div>
        ) : error ? (
          <div className="dashboard-error-message">{error}</div>
        ) : (
          <div className="dashboard-responsive-grid">
            {filteredPlans.map(plan => (
              <div key={plan._id} className="relative group">
                <ServiceCard plan={plan} onAddToCart={() => {}} showCartButton={false} />
                <div className="absolute top-2 right-2 flex gap-1 sm:gap-2 opacity-90 group-hover:opacity-100">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs font-bold shadow transition-all duration-200"
                    onClick={() => handleEditPlan(plan)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg text-xs font-bold shadow transition-all duration-200"
                    onClick={() => handleDeletePlan(plan._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;