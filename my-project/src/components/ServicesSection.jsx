import React, { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';

const ServicesSection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/plans/get-plans');
        const data = await res.json();
        if (data.success) {
          setPlans(data.plans);
        } else {
          setError(data.message || 'Failed to fetch plans');
        }
      } catch (err) {
        setError('Failed to fetch plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <section className="py-16 bg-white min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-10">
          <span className="inline-block bg-primary-600 text-white font-semibold px-4 py-1 rounded-full mb-2 text-sm shadow">🌟 Top-Rated Subscriptions</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 text-center">Customer Favorites, Just for You!</h2>
          <p className="text-gray-600 text-center max-w-2xl">
            Explore our best-selling subscriptions, loved by thousands! From powerful software tools 💻 to must-read eBooks 📚, we've got the hottest deals waiting for you.
          </p>
        </div>
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">Loading services...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {plans.map(plan => (
              <ServiceCard
                key={plan._id}
                serviceName={plan.serviceName}
                iconImage={plan.iconImage}
                price={plan.price}
                originalPrice={plan.originalPrice}
                description={plan.description}
                // rating and ratingCount can be added if available
                onAddToCart={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection; 