import React, { Suspense } from 'react';
import { FaShieldAlt, FaEye, FaLock, FaUserShield, FaDatabase, FaCookieBite, FaExclamationTriangle, FaCheckCircle, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import SvgEffect from '../components/SvgEffect';
const Footer = React.lazy(() => import('../components/Footer'));

const PrivacyPolicy = () => (
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
        <h1 className="dashboard-heading mb-6">Privacy Policy</h1>
        <p className="dashboard-subheading text-lg max-w-3xl mx-auto">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
        </p>
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-orange-700 font-semibold">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Information We Collect */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaDatabase className="text-2xl text-primary" />
            Information We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Personal Information</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Full name and contact details</li>
                <li>Email address and phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely)</li>
                <li>Account credentials and preferences</li>
                <li>Communication history with support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Technical Information</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Device information and IP addresses</li>
                <li>Browser type and version</li>
                <li>Operating system details</li>
                <li>Usage data and analytics</li>
                <li>Cookies and session data</li>
                <li>Error logs and performance data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaEye className="text-2xl text-primary" />
            How We Use Your Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Service Provision</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Process and fulfill your orders</li>
                <li>Deliver services and credentials</li>
                <li>Provide customer support</li>
                <li>Send order confirmations</li>
                <li>Handle payment processing</li>
                <li>Manage your account</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Platform Improvement</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Analyze usage patterns</li>
                <li>Improve user experience</li>
                <li>Develop new features</li>
                <li>Ensure platform security</li>
                <li>Prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaUserShield className="text-2xl text-primary" />
            Information Sharing and Disclosure
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">We Do NOT Share</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Your personal information with unauthorized third parties</li>
                <li>Your payment details with anyone</li>
                <li>Your account credentials with external services</li>
                <li>Your communication history without consent</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Limited Sharing (When Required)</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>With trusted service providers (payment processors, SMS services)</li>
                <li>To comply with legal obligations and court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>With your explicit consent for specific purposes</li>
                <li>In case of business transfer or merger (with notice)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaLock className="text-2xl text-primary" />
            Data Security
          </h2>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed dashboard-text">
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Security Measures</h3>
                <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                  <li>End-to-end encryption for all data</li>
                  <li>Secure SSL/TLS connections</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Data backup and recovery systems</li>
                  <li>24/7 security monitoring</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Your Role in Security</h3>
                <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                  <li>Use strong, unique passwords</li>
                  <li>Keep your login credentials secure</li>
                  <li>Log out from shared devices</li>
                  <li>Report suspicious activities</li>
                  <li>Update your contact information</li>
                  <li>Enable two-factor authentication if available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Cookies and Tracking */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaCookieBite className="text-2xl text-primary" />
            Cookies and Tracking Technologies
          </h2>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed dashboard-text">
              We use cookies and similar tracking technologies to enhance your browsing experience and provide personalized services.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Essential Cookies</h3>
                <p className="text-sm dashboard-text-muted">Required for basic platform functionality, security, and authentication.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Analytics Cookies</h3>
                <p className="text-sm dashboard-text-muted">Help us understand how users interact with our platform to improve services.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Preference Cookies</h3>
                <p className="text-sm dashboard-text-muted">Remember your settings and preferences for a personalized experience.</p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-semibold mb-2">Cookie Management:</p>
              <p className="text-sm dashboard-text-muted">You can control cookie settings through your browser preferences. However, disabling essential cookies may affect platform functionality.</p>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaCheckCircle className="text-2xl text-green-600" />
            Your Privacy Rights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Access and Control</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Access your personal information</li>
                <li>Update or correct your data</li>
                <li>Request deletion of your account</li>
                <li>Export your data in portable format</li>
                <li>Withdraw consent for data processing</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">How to Exercise Rights</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Contact our support team directly</li>
                <li>Use account settings in your dashboard</li>
                <li>Send email to our privacy team</li>
                <li>We will respond within 30 days</li>
                <li>No fees for reasonable requests</li>
                <li>We may verify your identity first</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Data Retention</h2>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed dashboard-text">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Retention Periods</h3>
                <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                  <li>Account data: Until account deletion</li>
                  <li>Transaction records: 7 years (legal requirement)</li>
                  <li>Support communications: 3 years</li>
                  <li>Analytics data: 2 years</li>
                  <li>Log files: 1 year</li>
                  <li>Marketing data: Until opt-out</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Data Deletion</h3>
                <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                  <li>Automatic deletion after retention period</li>
                  <li>Manual deletion upon request</li>
                  <li>Secure destruction methods</li>
                  <li>Backup data also deleted</li>
                  <li>Third-party data removal</li>
                  <li>Confirmation of deletion provided</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaExclamationTriangle className="text-2xl text-red-600" />
            Children's Privacy
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold mb-2">Important:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>You must be at least 18 years old to use our services</li>
                <li>If we discover we have collected data from a child under 18, we will delete it immediately</li>
                <li>Parents or guardians should contact us if they believe their child has provided personal information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* International Transfers */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">International Data Transfers</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">Safeguards Include:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>Standard contractual clauses</li>
                <li>Adequacy decisions by relevant authorities</li>
                <li>Certification schemes and codes of conduct</li>
                <li>Regular security assessments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Changes to Privacy Policy */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Changes to This Privacy Policy</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-semibold mb-2">Notification of Changes:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>We will notify you of significant changes via email or SMS</li>
                <li>Updated policy will be posted on our platform</li>
                <li>Continued use constitutes acceptance of changes</li>
                <li>You can review the current policy anytime</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="dashboard-card text-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Privacy Questions?</h2>
          <p className="dashboard-subheading text-lg mb-6">
            If you have any questions about this Privacy Policy or our data practices, please contact our privacy team.
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

export default PrivacyPolicy; 