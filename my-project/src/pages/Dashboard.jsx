import React, { useEffect, useState, Suspense } from 'react';
import SvgEffect from '../components/SvgEffect';
import ServiceCard from '../components/ServiceCard';
import DurationSelectionModal from '../components/DurationSelectionModal';
// Lazy load heavy/static sections
const WhyChooseUs = React.lazy(() => import('../components/WhyChooseUs'));
const CustomerFeedback = React.lazy(() => import('../components/CustomerFeedback'));
const Footer = React.lazy(() => import('../components/Footer'));
const API_BASE_URL = 'http://localhost:8080/api';

function Dashboard() {
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
        const res = await fetch(`${API_BASE_URL}/plans/public`);
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
  }, []);

  const handleAddToCart = (plan) => {
    // Show duration selection modal
    setSelectedPlan(plan);
    setShowDurationModal(true);
  };

  const handleDurationSelected = (planWithDuration) => {
    // Here you would implement the actual add to cart logic
    console.log('Adding to cart:', planWithDuration);
    alert(`Added ${planWithDuration.serviceName} (${planWithDuration.selectedDuration.duration}) to cart for ₹${planWithDuration.selectedDuration.price}!`);
    
    // Close modal
    setShowDurationModal(false);
    setSelectedPlan(null);
  };

  const handleCloseModal = () => {
    setShowDurationModal(false);
    setSelectedPlan(null);
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
      <div className="dashboard-content" id="products-section">
        <div className="text-center mb-10">
          <span className="dashboard-badge mb-2">🌟 Top-Rated Subscriptions</span>
          <h1 className="dashboard-heading mb-2">Customer Favorites, Just for You!</h1>
          <p className="dashboard-subheading max-w-2xl mx-auto">Explore our best-selling subscriptions, loved by thousands! we've got the hottest deals waiting for you.</p>
        </div>
        {loading ? (
          <div className="dashboard-loading">Loading subscriptions...</div>
        ) : error ? (
          <div className="dashboard-error-message">{error}</div>
        ) : (
          <div className="dashboard-responsive-grid">
            {plans.map(plan => (
              <ServiceCard key={plan._id} plan={plan} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
      
      {/* Duration Selection Modal */}
      <DurationSelectionModal
        plan={selectedPlan}
        isOpen={showDurationModal}
        onClose={handleCloseModal}
        onAddToCart={handleDurationSelected}
      />
      
      {/* Lazy load heavy/static sections */}
      <Suspense fallback={<div className="dashboard-loading">Loading sections...</div>}>
        <WhyChooseUs />
        <CustomerFeedback />
        <Footer />
      </Suspense>
    </div>
  );
}

export default Dashboard;