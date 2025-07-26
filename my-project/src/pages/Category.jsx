import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SvgEffect from '../components/SvgEffect';
import ServiceCard from '../components/ServiceCard';
import DurationSelectionModal from '../components/DurationSelectionModal';
const WhyChooseUs = React.lazy(() => import('../components/WhyChooseUs'));
const CustomerFeedback = React.lazy(() => import('../components/CustomerFeedback'));
const Footer = React.lazy(() => import('../components/Footer'));
const API_BASE_URL = 'http://localhost:8080/api';

const CATEGORY_LABELS = {
  music: 'Music Premium',
  ott: 'OTT Platforms',
  professional: 'Professional Subscriptions',
  others: 'Others',
};

function Category() {
  const { category } = useParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDurationModal, setShowDurationModal] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/plans/public?category=${category}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch plans');
        setPlans(data.plans || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [category]);

  const handleAddToCart = useCallback((plan) => {
    setSelectedPlan(plan);
    setShowDurationModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowDurationModal(false);
    setSelectedPlan(null);
  }, []);

  return (
    <div className="dashboard-theme">
      <div className="dashboard-background">
        <SvgEffect />
      </div>
      <div className="dashboard-gradient-overlay"></div>
      <div className="dashboard-gradient-top"></div>
      <div className="dashboard-glassmorphism"></div>
      <div className="dashboard-content">
        <div className="text-center mb-10">
          <span className="dashboard-badge mb-2">🎯 Category</span>
          <h1 className="dashboard-heading mb-2">{CATEGORY_LABELS[category] || 'Subscriptions'}</h1>
          <p className="dashboard-subheading max-w-2xl mx-auto">Browse all subscriptions under <b>{CATEGORY_LABELS[category] || category}</b>.</p>
        </div>
        {loading ? (
          <div className="dashboard-loading">Loading subscriptions...</div>
        ) : error ? (
          <div className="dashboard-error-message">{error}</div>
        ) : plans.length === 0 ? (
          <div className="dashboard-error-message">No subscriptions found in this category.</div>
        ) : (
          <div className="dashboard-responsive-grid">
            {plans.map(plan => (
              <ServiceCard key={plan._id} plan={plan} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
      <DurationSelectionModal
        plan={selectedPlan}
        isOpen={showDurationModal}
        onClose={handleCloseModal}
      />
      <Suspense fallback={<div className="dashboard-loading">Loading sections...</div>}>
        <WhyChooseUs />
        <CustomerFeedback />
        <Footer />
      </Suspense>
    </div>
  );
}

export default Category; 