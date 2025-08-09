import React from 'react';
import { useNavigate } from 'react-router-dom';
import ottPlatform from '../assets/ott_platform.jpg';

const HeroSection = () => {
  const navigate = useNavigate();

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      if ('scrollBehavior' in document.documentElement.style) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Fallback for older browsers
        const elementPosition = element.offsetTop;
        window.scrollTo({
          top: elementPosition - 100, // Offset for navbar
          behavior: 'smooth'
        });
      }
    }
  };

  const handleExploreProducts = () => {
    // Navigate to services page
    navigate('/services');
  };

  const handleLearnMore = () => {
    // Navigate to about page or scroll to features section
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      smoothScrollTo('about-section');
    } else {
      navigate('/about');
    }
  };

  return (
    <div className="dashboard-theme flex items-center justify-center px-4 pt-6 pb-12 md:pt-10 md:pb-16 ">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <div className="text-left space-y-8">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 text-gray-700 text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
            Trusted by 5000+ users worldwide
          </div>
          <div className="space-y-6">
            <h1 className="dashboard-heading text-5xl md:text-6xl leading-tight">
              Affordable{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Subscriptions
              </span>
            </h1>
            <p className="dashboard-subheading text-2xl md:text-3xl leading-relaxed font-semibold">
              All in One Place
            </p>
          </div>
          <p className="dashboard-text-muted text-lg md:text-xl leading-relaxed max-w-2xl">
            Get Netflix, Prime, YouTube Premium & more — at unbeatable shared prices.
            <br />
            <span className="font-semibold text-gray-900">Instant Access, Global Availability, trusted by thousands.</span> 
          </p>
          {/* Feature highlights */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-sm">Instant Access</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm">Global Availability</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="dashboard-button-primary px-8 py-4 transform hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30"
              onClick={handleExploreProducts}
              aria-label="Explore our subscription products and services"
            >
              🚀 Explore Products
            </button>
            <button 
              className="dashboard-button-secondary px-8 py-4 transform hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30"
              onClick={handleLearnMore}
              aria-label="Learn more about our platform and services"
            >
              📖 Learn More
            </button>
          </div>
        </div>
        {/* Right Side - Image */}
        <div className="flex justify-center lg:justify-end">
          <div className="dashboard-card relative group p-2">
            {/* Multiple gradient layers for depth */}
            <div className="absolute -inset-6 bg-gradient-to-r from-primary-400 via-blue-400 to-secondary-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
            <div className="absolute -inset-4 bg-gradient-to-br from-white/20 via-transparent to-primary-300/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary-400 rounded-full opacity-60 group-hover:opacity-80 animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary-400 rounded-full opacity-60 group-hover:opacity-80 animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-blue-400 rounded-full opacity-60 group-hover:opacity-80 animate-ping" style={{animationDelay: '1.5s'}}></div>
            {/* Main image container with enhanced styling */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-2xl">
              <img 
                src={ottPlatform} 
                alt="OTT Platform Services" 
                className="relative w-full max-w-md h-auto rounded-xl shadow-2xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out"
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl pointer-events-none"></div>
              {/* Floating badge */}
              <div className="absolute -top-3 -left-3 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-110 transition-all duration-300">
                🔥 Hot Deals
              </div>
              {/* Bottom stats */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl px-6 py-3 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-4 text-gray-700 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg">50K+</div>
                    <div className="text-gray-500">Users</div>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="font-bold text-lg">24/7</div>
                    <div className="text-gray-500">Support</div>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="font-bold text-lg">99%</div>
                    <div className="text-gray-500">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
