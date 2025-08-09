import React, { useState, Suspense } from 'react';
import SvgEffect from '../components/SvgEffect';
import { FaWhatsapp } from 'react-icons/fa';
const Footer = React.lazy(() => import('../components/Footer'));

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSuccess('Thank you for contacting us! We will get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    }, 1200);
  };

  const handleWhatsAppClick = (event) => {
    const phoneNumber = '9353690229';
    const message = `Hello! 👋 I'm interested in your subscription services at Vyapaar360. Could you please provide me with more information about your available plans and pricing? Thank you!`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Optional: Add a small delay to show user feedback
    const button = event.target.closest('button');
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    }
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="dashboard-theme min-h-screen relative overflow-hidden">
      {/* SVG Background */}
      <div className="absolute inset-0 w-full h-full">
        <SvgEffect />
      </div>
      {/* Additional gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-green-50/50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50/30 via-transparent to-transparent"></div>
      {/* Clean Overlay */}
      <div className="absolute inset-0 bg-white/80"></div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h1 className="dashboard-heading mb-2 text-center">Contact Us</h1>
          <p className="dashboard-subheading mb-8 text-center">We'd love to hear from you! Fill out the form below and our team will get in touch.</p>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">{success}</div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="dashboard-form-label">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="dashboard-input"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="dashboard-form-label">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="dashboard-input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="dashboard-form-label">Message <span className="text-red-500">*</span></label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="dashboard-input min-h-[120px] resize-y"
                placeholder="Type your message here..."
                required
              />
            </div>
            <button
              type="submit"
              className="dashboard-button-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          {/* Contact Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-gray-600 mb-4">
              <div className="mb-3 text-lg font-semibold text-gray-900">Or reach us directly:</div>
              <div className="space-y-2">
                <div className="font-semibold text-gray-700">sales@vyapaar360.in</div>
                <div className="text-lg font-bold text-gray-900">+91 9353690229</div>
              </div>
            </div>
            
            {/* WhatsApp Contact Button */}
            <div className="mt-6 text-center">
              <div className="mb-3 text-gray-600">Quick contact via WhatsApp:</div>
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                aria-label="Contact us on WhatsApp"
              >
                <FaWhatsapp className="text-2xl" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
            
            {/* Additional Contact Options */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-2xl mb-2">📧</div>
                <div className="text-sm font-semibold text-gray-900">Email</div>
                <div className="text-xs text-gray-600">sales@vyapaar360.in</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-2xl mb-2">📱</div>
                <div className="text-sm font-semibold text-gray-900">Phone</div>
                <div className="text-xs text-gray-600">+91 9353690229</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-2xl mb-2">⏰</div>
                <div className="text-sm font-semibold text-gray-900">Support</div>
                <div className="text-xs text-gray-600">24/7 Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 animate-pulse"
          aria-label="Quick contact on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <FaWhatsapp className="text-3xl" />
        </button>
      </div>
      
      {/* Footer */}
      <Suspense fallback={<div className="dashboard-loading">Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default Contact;