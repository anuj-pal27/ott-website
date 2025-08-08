import React, { Suspense } from 'react';
import { FaShieldAlt, FaClock, FaPhone, FaEnvelope, FaWhatsapp, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import SvgEffect from '../components/SvgEffect';
const Footer = React.lazy(() => import('../components/Footer'));

const RefundPolicy = () => (
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
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <FaShieldAlt className="text-4xl text-white" />
          </div>
        </div>
        <h1 className="dashboard-heading mb-6">Refund Policy</h1>
        <p className="dashboard-subheading text-lg max-w-3xl mx-auto">
          We strive to provide the best service and customer satisfaction. Our refund policy is designed to be fair and transparent for all our customers.
        </p>
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-orange-700 font-semibold">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Policy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <FaClock className="text-2xl text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">7-Day Window</h3>
          </div>
          <p className="dashboard-text-muted text-sm">Refunds are only applicable for purchases made within the last 7 days from the date of purchase.</p>
        </div>
        
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle className="text-2xl text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Usage Restrictions</h3>
          </div>
          <p className="dashboard-text-muted text-sm">Refunds will not be provided for services already delivered, activated, or used by the customer.</p>
        </div>
        
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <FaCheckCircle className="text-2xl text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Review Process</h3>
          </div>
          <p className="dashboard-text-muted text-sm">All refund requests are subject to review and approval by our support team within 24-48 hours.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* How to Request a Refund */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaPhone className="text-2xl text-primary" />
            How to Request a Refund
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">To request a refund, you must contact our support team directly through any of the following methods:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <FaPhone className="text-primary" />
                <div>
                  <div className="font-semibold text-gray-900">Phone Support</div>
                  <div className="dashboard-text-muted">+91 9353690229</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <FaWhatsapp className="text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">WhatsApp</div>
                  <div className="dashboard-text-muted">+91 9353690229</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <FaEnvelope className="text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">Email</div>
                  <div className="dashboard-text-muted">goutham4391@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <FaShieldAlt className="text-primary" />
                <div>
                  <div className="font-semibold text-gray-900">Live Chat</div>
                  <div className="dashboard-text-muted">Available on website</div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-700 font-semibold">Required Information:</p>
              <ul className="list-disc ml-6 mt-2 dashboard-text-muted space-y-1">
                <li>Order ID or Transaction ID</li>
                <li>Date of purchase</li>
                <li>Service purchased</li>
                <li>Reason for refund request</li>
                <li>Your registered email and phone number</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Eligibility for Refunds */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Eligibility for Refunds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                Eligible for Refund
              </h3>
              <ul className="list-disc ml-6 space-y-3 dashboard-text-muted">
                <li>Purchases made within the last 7 days</li>
                <li>Services not yet delivered or activated</li>
                <li>Technical issues preventing service delivery</li>
                <li>Duplicate payments or billing errors</li>
                <li>Service unavailability from our end</li>
                <li>Quality issues with delivered service</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                <FaTimesCircle className="text-red-600" />
                Not Eligible for Refund
              </h3>
              <ul className="list-disc ml-6 space-y-3 dashboard-text-muted">
                <li>Services already delivered and used</li>
                <li>Purchases older than 7 days</li>
                <li>Change of mind after service delivery</li>
                <li>Violation of terms of service</li>
                <li>Fraudulent or suspicious transactions</li>
                <li>Third-party service issues beyond our control</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Refund Process */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Refund Process</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-1">1</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Request</h3>
                <p className="dashboard-text-muted">Contact our support team with your order details and reason for refund.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-1">2</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Process</h3>
                <p className="dashboard-text-muted">Our team will review your request within 24-48 hours and verify eligibility.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-1">3</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Approval & Processing</h3>
                <p className="dashboard-text-muted">If approved, refund will be processed to your original payment method within 5-7 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-1">4</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmation</h3>
                <p className="dashboard-text-muted">You'll receive confirmation via email and SMS once the refund is processed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="dashboard-card bg-yellow-50 border-yellow-200">
          <h3 className="text-xl font-semibold mb-4 text-yellow-800 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-600" />
            Important Notes
          </h3>
          <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
            <li>Refund processing time may vary depending on your payment method and bank</li>
            <li>Bank charges or transaction fees are non-refundable</li>
            <li>Partial refunds may be offered in certain circumstances</li>
            <li>We reserve the right to modify this refund policy at any time</li>
            <li>All refund decisions are final and binding</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="dashboard-card text-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Need Help?</h2>
          <p className="dashboard-subheading text-lg mb-6">
            For any questions about our refund policy or to request a refund, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+919353690229"
              className="dashboard-button-primary inline-flex items-center gap-2"
            >
              <FaPhone />
              Call Us
            </a>
            <a 
              href="https://wa.me/919353690229"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-2"
            >
              <FaWhatsapp />
              WhatsApp
            </a>
            <a 
              href="mailto:goutham4391@gmail.com"
              className="dashboard-button-secondary inline-flex items-center gap-2"
            >
              <FaEnvelope />
              Email Us
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

export default RefundPolicy; 