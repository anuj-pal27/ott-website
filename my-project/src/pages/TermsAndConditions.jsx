import React, { Suspense } from 'react';
const Footer = React.lazy(() => import('../components/Footer'));

const TermsAndConditions = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-primary text-white py-16 px-4 md:px-24">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-emerald-300">Terms & Conditions</h1>
      <p className="mb-8 text-xl leading-relaxed">Welcome to vyapaar360! By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.</p>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">1. Acceptance of Terms</h2>
      <p className="mb-8 text-lg leading-relaxed">By accessing or using our platform, you confirm that you have read, understood, and agree to be bound by these terms. If you do not agree, please do not use our services.</p>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">2. Use of Our Service</h2>
      <ul className="list-disc ml-8 mb-8 text-lg space-y-2">
        <li>You must be at least 18 years old to use our platform.</li>
        <li>You agree not to misuse the platform or help anyone else do so.</li>
        <li>All content is for personal, non-commercial use unless otherwise stated.</li>
        <li>You are responsible for your account and all activities under it.</li>
      </ul>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">3. Accounts and Security</h2>
      <ul className="list-disc ml-8 mb-8 text-lg space-y-2">
        <li>You are responsible for maintaining the confidentiality of your account and password.</li>
        <li>Notify us immediately of any unauthorized use of your account.</li>
        <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
      </ul>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">4. Intellectual Property</h2>
      <p className="mb-8 text-lg leading-relaxed">All content, trademarks, and data on this platform, including but not limited to software, databases, text, graphics, icons, and hyperlinks are the property of vyapaar360 or its licensors and are protected by law.</p>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">5. Limitation of Liability</h2>
      <ul className="list-disc ml-8 mb-8 text-lg space-y-2">
        <li>We are not liable for any indirect, incidental, or consequential damages.</li>
        <li>Our liability is limited to the maximum extent permitted by law.</li>
        <li>We do not guarantee uninterrupted or error-free service.</li>
      </ul>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">6. Changes to Terms</h2>
      <p className="mb-8 text-lg leading-relaxed">We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting. Continued use of the platform constitutes acceptance of the revised terms.</p>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">7. Governing Law</h2>
      <p className="mb-8 text-lg leading-relaxed">These terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts of India.</p>
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-emerald-200">8. Contact Us</h2>
      <p className="mb-8 text-lg leading-relaxed">For any questions about these Terms & Conditions, please contact us at <span className="text-emerald-300">support@vyapaar360.com</span>.</p>
    </div>
    
    {/* Footer */}
    <Suspense fallback={<div className="dashboard-loading">Loading footer...</div>}>
      <Footer />
    </Suspense>
  </div>
);

export default TermsAndConditions; 