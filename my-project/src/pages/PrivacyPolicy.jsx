import React from 'react';

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-primary text-white py-12 px-4 md:px-16">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-emerald-300">Privacy Policy</h1>
      <p className="mb-4 text-lg">Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-200">Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Personal identification information (Name, email address, phone number, etc.)</li>
        <li>Usage data and cookies</li>
        <li>Payment and transaction details</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-200">How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To provide and maintain our service</li>
        <li>To notify you about changes to our service</li>
        <li>To allow you to participate in interactive features</li>
        <li>To provide customer support</li>
        <li>To monitor usage and improve our platform</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-200">Your Rights</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Access, update, or delete your personal information</li>
        <li>Withdraw consent at any time</li>
        <li>Request a copy of your data</li>
      </ul>
      <p className="mt-8">For any questions about this Privacy Policy, please contact us at <span className="text-emerald-300">support@vyapaar360.com</span>.</p>
    </div>
  </div>
);

export default PrivacyPolicy; 