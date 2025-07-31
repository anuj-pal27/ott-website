import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import SvgEffect from '../components/SvgEffect';
import ServiceCard from '../components/ServiceCard';
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]); // New state for categories
  const [isMobile, setIsMobile] = useState(false);
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

  // Check screen size and update mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // On mobile, set a default category since "All Services" is not available
    // On desktop, don't auto-select any category by default
    if (!selectedCategory && categories && categories.length > 0) {
      if (isMobile) {
        // Set to first available category on mobile
        setSelectedCategory(categories[0]);
      }
      // On desktop, no auto-selection - users see all services by default
    }
  }, [categories, selectedCategory, isMobile]);

  useEffect(() => {
    let filtered = plans;
    
    // If there's a search term, search across ALL plans regardless of category
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(plan => plan.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
    } else if (selectedCategory && selectedCategory !== '') {
      // If no search term but category is selected (and not "All Services"), filter by category
      filtered = filtered.filter(plan => plan.category === selectedCategory);
    }
    // If no search term and no category selected (or "All Services" selected), show all plans
    
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
    // This function is no longer needed as ServiceCard now navigates directly to checkout
    console.log('Plan selected:', plan);
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
        <div className="flex justify-center mb-6">
          <input
            type="text"
            className="dashboard-input w-full max-w-md"
            placeholder="Search all subscriptions..."
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

        {/* Search indicator */}
        {searchTerm.trim() !== '' && (
          <div className="text-center mb-4">
            <p className="text-white/80 text-sm">
              🔍 Searching across all categories for "{searchTerm}"
              {selectedCategory && selectedCategory !== '' && (
                <span className="ml-2 text-white/60">
                  (showing results from all categories, not just {selectedCategory})
                </span>
              )}
            </p>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">Loading services...</div>
        ) : error ? (
          <div className="dashboard-error-message">{error}</div>
        ) : (
          <>
            {filteredPlans.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm.trim() !== '' ? 'No services found for your search' : 'No services found'}
                </h3>
                <p className="text-white/70">
                  {searchTerm.trim() !== '' 
                    ? `No services match "${searchTerm}". Try different keywords or browse by category.`
                    : 'Try selecting a different category or check back later for new services.'
                  }
                </p>
              </div>
            ) : (
              <div className="dashboard-responsive-grid">
                {filteredPlans.map(plan => (
                  <ServiceCard key={plan._id} plan={plan} />
                ))}
              </div>
            )}
          </>
        )}
        
        {/* List of Services Info Box */}
        <div className="max-w-2xl mx-auto mt-12 mb-8 p-6 bg-white/90 rounded-xl shadow-lg border border-primary/20 text-center">
          <h2 className="text-xl font-bold mb-2 text-primary">LIST OF SERVICES WE DEAL IN ⭐</h2>
          <p className="mb-2 text-gray-800">Message here : <a href="https://wa.me/918250919483" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Wa.me/918250919483</a></p>
          <p className="text-xs text-gray-600 font-semibold mt-2">NOTE : All Our Services Are Genuine And 100% Legal, We Don&apos;t Provide 3rd Party Or Crack Services.</p>
        </div>
        
        {/* Delivery Information Section */}
        <div className="max-w-4xl mx-auto mb-12 p-8 rounded-3xl shadow-2xl border border-white/30 text-left flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group transition-all duration-300 hover:shadow-white/40 hover:scale-[1.01] backdrop-blur-md bg-white/5 ">
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-4 border-white/40 shadow-xl mr-0 md:mr-8 relative z-10">
            <span className="text-6xl md:text-7xl text-white drop-shadow-lg">🚚</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-wide drop-shadow-sm text-center md:text-left">How We Deliver Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/15 rounded-xl p-4 border border-white/25 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  Instant Processing
                </h4>
                <p className="text-white/90 text-sm leading-relaxed">As soon as you place your order and complete the payment, our system begins processing your request automatically within seconds.</p>
              </div>
              <div className="bg-white/15 rounded-xl p-4 border border-white/25 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">📱</span>
                  WhatsApp/SMS Delivery
                </h4>
                <p className="text-white/90 text-sm leading-relaxed">Your service details, activation codes, or access credentials are delivered directly to your registered mobile number via WhatsApp or SMS—usually within <span className="font-bold text-white">30 minutes</span> of your order.</p>
              </div>
              <div className="bg-white/15 rounded-xl p-4 border border-white/25 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">🔔</span>
                  Real-Time Updates
                </h4>
                <p className="text-white/90 text-sm leading-relaxed">You'll receive notifications at every step of the process, so you always know the status of your order and when to expect delivery.</p>
              </div>
              <div className="bg-white/15 rounded-xl p-4 border border-white/25 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">🔒</span>
                  Secure & Private
                </h4>
                <p className="text-white/90 text-sm leading-relaxed">All deliveries are handled securely with end-to-end encryption, and your personal information is kept completely confidential.</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-white/20 to-white/10 border-l-4 border-white/50 rounded-lg p-4 text-sm text-white/95 font-semibold backdrop-blur-sm mb-4">
              <div className="flex items-start gap-3">
                <span className="text-white font-bold text-lg">💬</span>
                <div>
                  <span className="text-white font-bold">24/7 Support:</span> If you have any questions or face any issues, our support team is available round the clock via WhatsApp: <a href="https://wa.me/918250919483" className="text-white hover:text-primary underline font-bold transition-colors">+91 8250919483</a>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-300/10 border-l-4 border-yellow-400 rounded-lg p-4 text-sm text-white/95 font-semibold italic shadow-sm backdrop-blur-sm">
              <span className="text-yellow-300 font-bold">Note:</span> In rare cases, delivery may take slightly longer due to high demand or technical issues, but we strive to fulfill every order as quickly as possible. Most orders are delivered within 30 minutes!
            </div>
          </div>
        </div>
      </div>
      

      
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