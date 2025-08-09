import React, { Suspense } from 'react';
import { FaGavel, FaShieldAlt, FaUserShield, FaLock, FaExclamationTriangle, FaCheckCircle, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import SvgEffect from '../components/SvgEffect';
const Footer = React.lazy(() => import('../components/Footer'));

const TermsAndConditions = () => (
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
            <FaGavel className="text-4xl text-white" />
          </div>
        </div>
        <h1 className="dashboard-heading mb-6">Terms & Conditions</h1>
        <p className="dashboard-subheading text-lg max-w-3xl mx-auto">
          Welcome to Vyapaar360! By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
        </p>
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-orange-700 font-semibold">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* 1. Acceptance of Terms */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaCheckCircle className="text-2xl text-green-600" />
            1. Acceptance of Terms
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">By accessing or using our platform, you confirm that you have read, understood, and agree to be bound by these terms. If you do not agree with any part of these terms, please do not use our services.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">Key Points:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>These terms constitute a legally binding agreement between you and Vyapaar360</li>
                <li>Continued use of the platform after changes constitutes acceptance of new terms</li>
                <li>You must be at least 18 years old to use our services</li>
                <li>You are responsible for compliance with all applicable laws and regulations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Use of Our Service */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaShieldAlt className="text-2xl text-primary" />
            2. Use of Our Service
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Permitted Uses</h3>
              <ul className="list-disc ml-6 space-y-3 dashboard-text-muted">
                <li>Personal, non-commercial use of subscription services</li>
                <li>Accessing digital content and services as intended</li>
                <li>Contacting customer support for legitimate inquiries</li>
                <li>Making legitimate purchases and payments</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Prohibited Uses</h3>
              <ul className="list-disc ml-6 space-y-3 dashboard-text-muted">
                <li>Sharing account credentials with unauthorized users</li>
                <li>Attempting to circumvent security measures</li>
                <li>Using services for illegal or harmful purposes</li>
                <li>Reselling or redistributing our services without permission</li>
                <li>Attempting to reverse engineer or hack our platform</li>
                <li>Spamming or sending unsolicited communications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Accounts and Security */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaLock className="text-2xl text-primary" />
            3. Accounts and Security
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Account Responsibilities</h3>
                <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                  <li>Maintain confidentiality of your account credentials</li>
                  <li>Use strong, unique passwords</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Keep your contact information updated</li>
                  <li>Log out after each session on shared devices</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Security Measures</h3>
                <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                  <li>We implement industry-standard security protocols</li>
                  <li>All transactions are encrypted and secure</li>
                  <li>We monitor for suspicious activities</li>
                  <li>We may require additional verification for large transactions</li>
                  <li>We reserve the right to suspend accounts for security reasons</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Intellectual Property */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaUserShield className="text-2xl text-primary" />
            4. Intellectual Property
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">All content, trademarks, and data on this platform, including but not limited to software, databases, text, graphics, icons, and hyperlinks are the property of Vyapaar360 or its licensors and are protected by law.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">Protected Content Includes:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>Platform design, layout, and user interface</li>
                <li>Service descriptions and pricing information</li>
                <li>Customer support materials and documentation</li>
                <li>Brand names, logos, and trademarks</li>
                <li>Software code and technical implementations</li>
                <li>Customer data and usage analytics</li>
              </ul>
            </div>
            <p className="text-yellow-700 font-semibold">⚠️ Unauthorized use, reproduction, or distribution of our intellectual property is strictly prohibited and may result in legal action.</p>
          </div>
        </div>

        {/* 5. Payment Terms */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">5. Payment Terms</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Payment Methods</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>We accept UPI, PhonePe, Google Pay, credit/debit cards, and net banking</li>
                <li>All payments are processed securely through trusted payment gateways</li>
                <li>Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes</li>
                <li>We reserve the right to change pricing with prior notice</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Billing and Invoicing</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Payment is required at the time of service purchase</li>
                <li>Invoices will be sent to your registered email address</li>
                <li>All transactions are final unless a refund is approved</li>
                <li>Failed payments may result in service suspension</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. Service Delivery */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">6. Service Delivery</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Delivery Timeline</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Most services are delivered within 30 minutes of payment confirmation</li>
                <li>Delivery is made via WhatsApp or SMS to your registered number</li>
                <li>You will receive login credentials and setup instructions</li>
                <li>Service activation begins immediately upon delivery</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Service Quality</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>We guarantee the quality and authenticity of all services</li>
                <li>Services are sourced from official providers and partners</li>
                <li>We provide technical support for service setup and usage</li>
                <li>Service availability may vary based on provider policies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 7. Limitation of Liability */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaExclamationTriangle className="text-2xl text-yellow-600" />
            7. Limitation of Liability
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">Vyapaar360 and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our services.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">Limitations Include:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>Service interruptions or technical difficulties</li>
                <li>Data loss or corruption</li>
                <li>Third-party service provider issues</li>
                <li>Force majeure events beyond our control</li>
                <li>User errors or misuse of services</li>
                <li>Changes in third-party platform policies</li>
              </ul>
            </div>
            <p className="text-yellow-700 font-semibold">Our total liability shall not exceed the amount paid by you for the specific service in question.</p>
          </div>
        </div>

        {/* 8. Privacy and Data Protection */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">8. Privacy and Data Protection</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these terms by reference.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">Data Protection Measures:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>All personal data is encrypted and securely stored</li>
                <li>We do not share your information with unauthorized third parties</li>
                <li>You have the right to access, update, or delete your personal data</li>
                <li>We comply with applicable data protection laws and regulations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 9. Changes to Terms */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">9. Changes to Terms</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on our platform. Continued use of the platform constitutes acceptance of the revised terms.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-semibold mb-2">Important:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>We will notify users of significant changes via email or SMS</li>
                <li>It is your responsibility to review terms periodically</li>
                <li>Your continued use after changes constitutes acceptance</li>
                <li>If you disagree with changes, you must stop using our services</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 10. Governing Law */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">10. Governing Law</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">These terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts of India.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">Dispute Resolution:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>We encourage amicable resolution of disputes</li>
                <li>Contact our support team first for any issues</li>
                <li>Legal proceedings should be initiated only as a last resort</li>
                <li>All disputes will be resolved in Indian courts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="dashboard-card text-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Questions About These Terms?</h2>
          <p className="dashboard-subheading text-lg mb-6">
            If you have any questions about these Terms & Conditions, please contact our support team.
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

export default TermsAndConditions; 