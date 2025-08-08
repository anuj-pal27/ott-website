import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SvgEffect from '../components/SvgEffect';
import { FaUsers, FaChartLine, FaShoppingCart, FaStar, FaTruck, FaHeadset, FaShieldAlt, FaClock, FaWhatsapp, FaPhone } from 'react-icons/fa';
import { MdDashboard, MdAdd, MdLogout, MdHome } from 'react-icons/md';
// Lazy load footer
const Footer = React.lazy(() => import('../components/Footer'));

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [visitorCount, setVisitorCount] = useState(100000);
  const [isCounting, setIsCounting] = useState(true);

  // Simulate animated visitor count
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => {
        const increment = Math.floor(Math.random() * 10) + 1;
        return prev + increment;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    {
      title: 'Total Visitors',
      value: visitorCount.toLocaleString(),
      icon: <FaUsers className="text-3xl text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Orders',
      value: '1,247',
      icon: <FaShoppingCart className="text-3xl text-green-600" />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-600'
    },
    {
      title: 'Customer Rating',
      value: '4.9/5',
      icon: <FaStar className="text-3xl text-yellow-600" />,
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Revenue This Month',
      value: '₹2.4M',
      icon: <FaChartLine className="text-3xl text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-600'
    }
  ];

  const deliveryFeatures = [
    {
      icon: <FaTruck className="text-2xl text-primary" />,
      title: 'Instant Processing',
      description: 'Orders are processed automatically within seconds of payment confirmation.'
    },
    {
      icon: <FaClock className="text-2xl text-primary" />,
      title: '30-Minute Delivery',
      description: 'Most orders are delivered via WhatsApp/SMS within 30 minutes.'
    },
    {
      icon: <FaHeadset className="text-2xl text-primary" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support via WhatsApp and phone.'
    },
    {
      icon: <FaShieldAlt className="text-2xl text-primary" />,
      title: 'Secure & Private',
      description: 'End-to-end encryption ensures your data remains confidential.'
    }
  ];

  const reviews = [
    {
      name: 'Rahul Sharma',
      rating: 5,
      comment: 'Amazing service! Got my Netflix subscription within 15 minutes. Highly recommended!',
      date: '2 days ago'
    },
    {
      name: 'Priya Patel',
      rating: 5,
      comment: 'Best prices I\'ve found online. Delivery was super fast and customer support is excellent.',
      date: '1 week ago'
    },
    {
      name: 'Amit Kumar',
      rating: 5,
      comment: 'Legitimate service with great prices. Will definitely buy again!',
      date: '2 weeks ago'
    },
    {
      name: 'Neha Singh',
      rating: 5,
      comment: 'Quick delivery and excellent customer service. Very satisfied with my purchase.',
      date: '3 weeks ago'
    }
  ];

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
      <div className="dashboard-content">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div>
            <h1 className="dashboard-heading">Digital Services Platform</h1>
            <p className="dashboard-subheading">Your trusted partner for premium digital subscriptions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="dashboard-button-primary flex items-center gap-2"
              onClick={() => navigate('/services')}
            >
              <MdHome />
              Browse Services
            </button>
            {user?.accountType === 'admin' && (
              <button
                className="dashboard-button-secondary flex items-center gap-2"
                onClick={() => navigate('/admin-dashboard')}
              >
                <MdDashboard />
                Admin Panel
              </button>
            )}
            {user && (
              <button
                className="dashboard-button-danger flex items-center gap-2"
                onClick={handleLogout}
              >
                <MdLogout />
                Logout
              </button>
            )}
          </div>
        </div>

        {/* WhatsApp Community Banner */}
        <div className="dashboard-card mb-12 bg-gradient-to-r from-green-500 to-emerald-500 border-0">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <FaWhatsapp className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Join our WhatsApp Community</h2>
                <p className="text-white/90 text-sm md:text-base mt-1">
                  Get more updates about new services at prices lower than original and stay up to date.
                </p>
              </div>
            </div>
            <a
              href="https://chat.whatsapp.com/GFu9A0huDdS7gcyntNbyZD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold shadow transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/40"
              aria-label="Join our WhatsApp Community for updates"
            >
              <FaWhatsapp className="text-lg" />
              Join Community
            </a>
          </div>
        </div>
 
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className={`dashboard-card ${stat.color} border-2`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Contact Section */}
        <div className="dashboard-card mb-12 bg-gradient-to-r from-green-50 to-orange-50 border-green-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full mb-4">
              <FaWhatsapp className="text-lg sm:text-2xl text-white" />
            </div>
            <h2 className="dashboard-heading text-xl sm:text-2xl mb-2">Get Instant Support</h2>
            <p className="dashboard-subheading text-sm sm:text-base">Connect with us on WhatsApp for quick assistance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="text-center p-4 sm:p-6 bg-white rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
              <FaWhatsapp className="text-2xl sm:text-3xl text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">WhatsApp Support</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4">Get instant help via WhatsApp</p>
              <a 
                href="https://wa.me/919353690229" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                <FaWhatsapp className="text-sm sm:text-lg" />
                Chat on WhatsApp
              </a>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
              <FaPhone className="text-2xl sm:text-3xl text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Phone Support</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4">Call us directly for support</p>
              <a 
                href="tel:+919353690229"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                <FaPhone className="text-sm sm:text-lg" />
                Call Now
              </a>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600 text-center">
              <div className="flex items-center gap-1">
                <FaClock className="text-orange-500" />
                <span className="font-medium">Available 24/7</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>Instant Response</span>
              <span className="hidden sm:inline">•</span>
              <span>Multilingual Support</span>
            </div>
          </div>
        </div>
        
        {/* How We Deliver Section */}
        <div className="dashboard-card mb-12">
          <h2 className="dashboard-heading text-2xl mb-6 text-center">How We Deliver Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryFeatures.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {/* Enhanced Support Info */}
          <div className="mt-8 p-4 sm:p-8 bg-gradient-to-r from-orange-50 to-green-50 rounded-xl border border-orange-200">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                  <FaHeadset className="text-lg sm:text-2xl text-white" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">24/7 Customer Support</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-lg">
                  Need help? Our dedicated support team is available round the clock to assist you with any questions, orders, or technical issues. We're here to ensure you have the best experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a 
                    href="https://wa.me/919353690229" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    <FaWhatsapp className="text-sm sm:text-lg" />
                    WhatsApp Support
                  </a>
                  <a 
                    href="tel:+919353690229"
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    <FaPhone className="text-sm sm:text-lg" />
                    Call: +91 9353690229
                  </a>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 justify-center sm:justify-start">
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <FaClock className="text-orange-500" />
                    <span>24/7 Available</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <FaShieldAlt className="text-green-500" />
                    <span>Secure Support</span>
                  </div>
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <FaStar className="text-yellow-500" />
                    <span>Premium Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="dashboard-card">
          <h2 className="dashboard-heading text-2xl mb-6 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{review.name}</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="dashboard-card bg-gradient-to-r from-primary to-secondary text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-6 opacity-90">
              Browse our extensive collection of premium digital services at unbeatable prices.
            </p>
            <button
              className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300"
              onClick={() => navigate('/services')}
            >
              Explore Services
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Suspense fallback={<div className="dashboard-loading">Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default Dashboard;