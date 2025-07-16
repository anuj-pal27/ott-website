import React, { useState } from 'react';
import SvgEffect from '../components/SvgEffect';

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

  return (
    <div className="dashboard-theme min-h-screen relative overflow-hidden">
      {/* SVG Background */}
      <div className="absolute inset-0 w-full h-full">
        <SvgEffect />
      </div>
      {/* Additional gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
          <h1 className="dashboard-heading mb-2 text-center">Contact Us</h1>
          <p className="dashboard-subheading mb-8 text-center">We'd love to hear from you! Fill out the form below and our team will get in touch.</p>
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 text-sm text-center">{success}</div>
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
          {/* Contact Info Placeholder */}
          <div className="mt-8 text-center text-white/80">
            <div className="mb-2">Or reach us at:</div>
            <div className="font-semibold">support@example.com</div>
            <div>+91 12345 67890</div>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;