import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import SvgEffect from '../components/SvgEffect';
import ServiceCard from '../components/ServiceCard';
import DurationSelectionModal from '../components/DurationSelectionModal';
import CategoryFilter from '../components/CategoryFilter';
// Lazy load heavy/static sections
const WhyChooseUs = React.lazy(() => import('../components/WhyChooseUs'));
const CustomerFeedback = React.lazy(() => import('../components/CustomerFeedback'));
const Footer = React.lazy(() => import('../components/Footer'));
const API_BASE_URL = 'http://localhost:8080/api';

function Dashboard() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]); // New state for categories
  const debounceTimeout = useRef();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/plans/public`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch plans');
        setPlans(data.plans || []);
        setFilteredPlans(data.plans || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    // If no category is selected, set to 'featured' if available, else first available from CategoryFilter
    if (!selectedCategory && categories && categories.length > 0) {
      if (categories.includes('featured')) {
        setSelectedCategory('featured');
      } else {
        setSelectedCategory(categories[0]);
      }
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    let filtered = plans;
    if (selectedCategory) {
      filtered = filtered.filter(plan => plan.category === selectedCategory);
    }
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(plan => plan.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredPlans(filtered);
  }, [selectedCategory, plans, searchTerm]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
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
          <span className="dashboard-badge mb-2">🚀 Digital Services Platform</span>
          <h1 className="dashboard-heading mb-2">Premium Digital Services at Unbeatable Prices!</h1>
          <p className="dashboard-subheading max-w-3xl mx-auto">
            From streaming subscriptions to professional software, instant websites to development tools - 
            we've got everything you need to boost your digital lifestyle and business at the best prices!
          </p>
        </div>
        {/* Delivery Information Section */}
        <div className="max-w-3xl mx-auto mb-10 p-8 bg-gradient-to-br from-primary/20 via-white/95 to-primary/10 rounded-3xl shadow-2xl border border-primary/30 text-left flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group transition-all duration-300 hover:shadow-primary/30 hover:scale-[1.02]">
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/10 border-4 border-primary/30 shadow-lg mr-0 md:mr-8 relative z-10">
            <span className="text-6xl md:text-7xl text-primary/80 drop-shadow-lg">🚚</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 tracking-wide drop-shadow-sm text-center md:text-left">How We Deliver Our Services</h2>
            <ul className="list-disc list-inside text-gray-800 text-lg leading-relaxed space-y-3 pl-2 md:pl-6 mb-4">
              <li><span className="font-semibold text-primary">Instant Processing:</span> As soon as you place your order and complete the payment, our system begins processing your request automatically.</li>
              <li><span className="font-semibold text-primary">Delivery via WhatsApp/SMS:</span> Your purchased service details, activation codes, or access credentials are delivered directly to your registered mobile number via WhatsApp or SMS—usually within <span className="font-bold">30 minutes</span> of your order.</li>
              <li><span className="font-semibold text-primary">Real-Time Updates:</span> You’ll receive notifications at every step, so you always know the status of your order.</li>
              <li><span className="font-semibold text-primary">Secure & Private:</span> All deliveries are handled securely, and your personal information is kept confidential.</li>
              <li><span className="font-semibold text-primary">Support:</span> If you have any questions or face any issues, our support team is available to assist you promptly.</li>
            </ul>
            <div className="bg-primary/10 border-l-4 border-primary/40 rounded-lg p-3 text-sm text-gray-700 font-semibold italic shadow-sm">
              <span className="text-primary font-bold">Note:</span> In rare cases, delivery may take slightly longer due to high demand or technical issues, but we strive to fulfill every order as quickly as possible.
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            className="dashboard-input w-full max-w-md"
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
          setCategories={setCategories} // Pass setCategories to update categories from filter
        />

        {selectedCategory ? (
          loading ? (
            <div className="dashboard-loading">Loading services...</div>
        ) : error ? (
          <div className="dashboard-error-message">{error}</div>
          ) : (
            <>
              {filteredPlans.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No services found</h3>
                  <p className="text-white/70">Try selecting a different category or check back later for new services.</p>
                </div>
        ) : (
          <div className="dashboard-responsive-grid">
                  {filteredPlans.map(plan => (
              <ServiceCard key={plan._id} plan={plan} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
            </>
          )
        ) : null}
        {/* List of Services Info Box */}
        <div className="max-w-2xl mx-auto mt-12 mb-8 p-6 bg-white/90 rounded-xl shadow-lg border border-primary/20 text-center">
          <h2 className="text-xl font-bold mb-2 text-primary">LIST OF SERVICES WE DEAL IN ⭐</h2>
          <p className="mb-2 text-gray-800">Message here : <a href="https://wa.me/918250919483" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Wa.me/918250919483</a></p>
          <p className="text-xs text-gray-600 font-semibold mt-2">NOTE : All Our Services Are Genuine And 100% Legal, We Don&apos;t Provide 3rd Party Or Crack Services.</p>
        </div>
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