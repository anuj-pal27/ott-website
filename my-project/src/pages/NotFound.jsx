import React, { Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import SvgEffect from '../components/SvgEffect';

const Footer = React.lazy(() => import('../components/Footer'));

const NotFound = () => {
  const navigate = useNavigate();

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
        {/* Back to Dashboard Button */}
        <button
          className="dashboard-button-secondary absolute top-4 left-4 z-20 px-4 py-2 text-sm"
          onClick={() => navigate('/')}
          style={{ minWidth: 0, width: 'auto' }}
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-2xl text-center">
            {/* 404 Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-red-500/20 rounded-full mb-6">
                <FaExclamationTriangle className="text-4xl sm:text-6xl text-red-500" />
              </div>
            </div>

            {/* 404 Text */}
            <div className="mb-8">
              <h1 className="dashboard-heading text-6xl sm:text-8xl font-bold mb-4 text-red-500">
                404
              </h1>
              <h2 className="dashboard-heading text-2xl sm:text-3xl mb-4">
                Page Not Found
              </h2>
              <p className="dashboard-subheading text-lg sm:text-xl max-w-md mx-auto">
                Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => navigate('/')}
                className="dashboard-button-primary inline-flex items-center gap-2 px-6 py-3 text-lg"
              >
                <FaHome className="text-lg" />
                Go to Home
              </button>
              <button
                onClick={() => navigate(-1)}
                className="dashboard-button-secondary inline-flex items-center gap-2 px-6 py-3 text-lg"
              >
                <FaArrowLeft className="text-lg" />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="dashboard-card max-w-lg mx-auto">
              <h3 className="dashboard-heading text-xl mb-4">Popular Pages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/services"
                  className="dashboard-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <FaSearch className="text-sm" />
                  Browse Services
                </Link>
                <Link
                  to="/contact"
                  className="dashboard-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <FaSearch className="text-sm" />
                  Contact Support
                </Link>
                <Link
                  to="/about"
                  className="dashboard-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <FaSearch className="text-sm" />
                  About Us
                </Link>
                <Link
                  to="/auth"
                  className="dashboard-button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <FaSearch className="text-sm" />
                  Login
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 max-w-lg mx-auto">
              <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-gray-600 text-sm mb-4">
                If you believe this is an error, please contact our support team.
              </p>
              <a
                href="https://wa.me/919353690229"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Suspense fallback={<div className="dashboard-loading">Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default NotFound; 