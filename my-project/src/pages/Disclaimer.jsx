import React, { Suspense } from 'react';
import { FaExclamationTriangle, FaShieldAlt, FaLink, FaUserTie, FaGavel, FaPhone, FaEnvelope, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import SvgEffect from '../components/SvgEffect';
const Footer = React.lazy(() => import('../components/Footer'));

const Disclaimer = () => (
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
            <FaExclamationTriangle className="text-4xl text-white" />
          </div>
        </div>
        <h1 className="dashboard-heading mb-6">Disclaimer</h1>
        <p className="dashboard-subheading text-lg max-w-3xl mx-auto">
          The information provided by Vyapaar360 on this platform is for general informational purposes only. Please read this disclaimer carefully before using our services.
        </p>
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-orange-700 font-semibold">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* General Disclaimer */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaShieldAlt className="text-2xl text-primary" />
            General Disclaimer
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">All information on this platform is provided in good faith. However, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-semibold mb-2">Important Notice:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>Information may be subject to change without notice</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>Service availability may vary based on provider policies</li>
                <li>Prices and offers are subject to change</li>
                <li>Technical issues may occur despite our best efforts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Service Disclaimer */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Service Disclaimer</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Service Quality</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>We strive to provide high-quality, authentic services</li>
                <li>All services are sourced from official providers and partners</li>
                <li>We do not provide cracked, pirated, or illegal services</li>
                <li>Service performance may vary based on user's device and internet connection</li>
                <li>We are not responsible for third-party platform changes or restrictions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Service Limitations</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Services are for personal, non-commercial use unless specified</li>
                <li>Sharing account credentials may result in service termination</li>
                <li>We do not guarantee specific features or content availability</li>
                <li>Service terms are subject to provider policies and changes</li>
                <li>We are not liable for service interruptions beyond our control</li>
              </ul>
            </div>
          </div>
        </div>

        {/* External Links Disclaimer */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaLink className="text-2xl text-primary" />
            External Links Disclaimer
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">The site may contain links to other websites or content belonging to or originating from third parties. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">Third-Party Links Include:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>Payment gateway providers (PhonePe, UPI, etc.)</li>
                <li>Service provider websites and platforms</li>
                <li>Social media platforms and communication tools</li>
                <li>External support and documentation resources</li>
                <li>Partner websites and affiliate links</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold mb-2">Important:</p>
              <p className="text-sm dashboard-text-muted">We have no control over the nature, content, and availability of external sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>
            </div>
          </div>
        </div>

        {/* Professional Disclaimer */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaUserTie className="text-2xl text-primary" />
            Professional Disclaimer
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">The site cannot and does not contain professional advice. Any information provided is for general informational and educational purposes only and is not a substitute for professional advice.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">Before Taking Action:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>Consult with appropriate professionals for technical advice</li>
                <li>Verify information with official sources</li>
                <li>Consider your specific circumstances and requirements</li>
                <li>Understand the terms and conditions of services</li>
                <li>Ensure compliance with applicable laws and regulations</li>
              </ul>
            </div>
            <p className="text-yellow-700 font-semibold">⚠️ Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.</p>
          </div>
        </div>

        {/* Financial Disclaimer */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Financial Disclaimer</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Payment and Pricing</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>All prices are displayed in Indian Rupees (INR)</li>
                <li>Prices are inclusive of applicable taxes</li>
                <li>We reserve the right to change pricing with prior notice</li>
                <li>Payment processing fees may apply</li>
                <li>Refunds are subject to our refund policy</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Investment Disclaimer</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Our services are not financial investments</li>
                <li>We do not provide financial advice or recommendations</li>
                <li>Past performance does not guarantee future results</li>
                <li>Consider your financial situation before making purchases</li>
                <li>We are not responsible for financial losses or gains</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Disclaimer */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Technical Disclaimer</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Platform Availability</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>We strive for 24/7 platform availability</li>
                <li>Scheduled maintenance may cause temporary downtime</li>
                <li>Technical issues may occur despite our best efforts</li>
                <li>We are not liable for service interruptions</li>
                <li>Backup systems are in place for critical functions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Compatibility</h3>
              <ul className="list-disc ml-6 space-y-2 dashboard-text-muted">
                <li>Platform works best on modern browsers and devices</li>
                <li>Some features may not work on older systems</li>
                <li>Mobile compatibility may vary by device</li>
                <li>Internet connection quality affects performance</li>
                <li>We recommend using supported browsers and devices</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
            <FaGavel className="text-2xl text-primary" />
            Legal Disclaimer
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">This disclaimer is governed by and construed in accordance with the laws of India. Any disputes arising from this disclaimer will be subject to the exclusive jurisdiction of the courts of India.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">Legal Provisions:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>This disclaimer constitutes a legally binding agreement</li>
                <li>Severability: If any provision is found invalid, others remain in effect</li>
                <li>Entire agreement: This disclaimer supersedes all prior agreements</li>
                <li>Amendments: Changes must be in writing and signed</li>
                <li>Waiver: Failure to enforce any provision is not a waiver</li>
              </ul>
            </div>
            <p className="text-yellow-700 font-semibold">⚠️ By using our platform, you acknowledge that you have read, understood, and agree to be bound by this disclaimer.</p>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Limitation of Liability</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">To the maximum extent permitted by applicable law, Vyapaar360 shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our platform.</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold mb-2">Exclusions Include:</p>
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

        {/* Indemnification */}
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Indemnification</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="dashboard-text">You agree to indemnify, defend, and hold harmless Vyapaar360 and its affiliates from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to your use of our platform or violation of these terms.</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">This includes:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm dashboard-text-muted">
                <li>Violation of terms of service</li>
                <li>Misuse of platform or services</li>
                <li>Infringement of intellectual property rights</li>
                <li>Violation of applicable laws or regulations</li>
                <li>Harm caused to other users or third parties</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="dashboard-card text-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Questions About This Disclaimer?</h2>
          <p className="dashboard-subheading text-lg mb-6">
            If you have any questions regarding this disclaimer or need clarification on any points, please contact our support team.
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

export default Disclaimer; 