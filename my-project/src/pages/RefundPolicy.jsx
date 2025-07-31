import React, { Suspense } from 'react';
const Footer = React.lazy(() => import('../components/Footer'));

const RefundPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-primary text-white py-16 px-4 md:px-24">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-emerald-300">Refund Policy</h1>
      <p className="mb-8 text-xl leading-relaxed">We strive to provide the best service and customer satisfaction. If you are not satisfied with your purchase, please review our refund policy below.</p>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">How to Request a Refund</h2>
      <p className="mb-8 text-lg leading-relaxed">To request a refund, you must contact our support team directly. Please call us at <span className='text-emerald-300 font-semibold'>+91-9876543210</span> with your order details. Our team will review your request and respond as soon as possible.</p>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">Eligibility for Refunds</h2>
      <ul className="list-disc ml-8 mb-8 text-lg space-y-2">
        <li>Refunds are only applicable for purchases made within the last 7 days.</li>
        <li>Refunds will not be provided for services already delivered or used.</li>
        <li>All refund requests are subject to review and approval by our team.</li>
      </ul>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">Contact Us</h2>
      <p className="mb-8 text-lg leading-relaxed">For any questions about our refund policy, please contact us at <span className="text-emerald-300">support@vyapaar360.com</span> or call <span className='text-emerald-300 font-semibold'>+91-9876543210</span>.</p>
    </div>
    
    {/* Footer */}
    <Suspense fallback={<div className="dashboard-loading">Loading footer...</div>}>
      <Footer />
    </Suspense>
  </div>
);

export default RefundPolicy; 