import React, { Suspense } from 'react';
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
      <div className="text-center mb-8">
        <h1 className="dashboard-heading">Terms & Conditions</h1>
      </div>

      {/* Provided Content Only */}
      <div className="dashboard-card space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">1. General</h2>
          <p className="dashboard-text mb-2">1.1 These Terms and Conditions govern your use of the payment gateway services provided by Vyapaar360.</p>
          <p className="dashboard-text">1.2 By accessing or using the payment gateway, you acknowledge and agree to these Terms and Conditions. If you do not agree, please refrain from using our payment services.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">2. Payment Processing</h2>
          <p className="dashboard-text mb-2">2.1 We use secure third-party payment processors to handle transactions. By making a payment, you consent to the processing of your payment information by our payment partners.</p>
          <p className="dashboard-text mb-2">2.2 All payments must be made in the currency and method specified at the time of checkout.</p>
          <p className="dashboard-text">2.3 Any additional fees, such as taxes, currency conversion charges, or processing fees, will be displayed before confirming the payment.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">3. User Responsibilities</h2>
          <p className="dashboard-text mb-2">3.1 You are responsible for ensuring that the payment details you provide are accurate and complete.</p>
          <p className="dashboard-text mb-2">3.2 It is your responsibility to ensure sufficient funds or credit availability for the transaction.</p>
          <p className="dashboard-text">3.3 Any fraudulent use of the payment gateway will result in immediate termination of services and may involve legal action.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">4. Data Privacy</h2>
          <p className="dashboard-text mb-2">4.1 We adhere to strict data privacy guidelines to protect your payment and personal information.</p>
          <p className="dashboard-text">4.2 Please refer to our <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a> for detailed information on how we collect, use, and protect your data.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">5. Transaction Confirmation</h2>
          <p className="dashboard-text mb-2">5.1 Upon successful payment, you will receive a confirmation receipt via email.</p>
          <p className="dashboard-text">5.2 If you do not receive a confirmation email, please contact our support team immediately.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">6. Refunds and Cancellations</h2>
          <p className="dashboard-text mb-2">6.1 Our <a href="/refund-policy" className="text-primary underline">Refund Policy</a> outlines the conditions under which refunds are processed.</p>
          <p className="dashboard-text">6.2 Cancellations and refunds may be subject to additional fees as applicable.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">7. Liability</h2>
          <p className="dashboard-text mb-2">7.1 Vyapaar360 is not responsible for any delays, errors, or failures in payment processing due to technical issues or third-party service interruptions.</p>
          <p className="dashboard-text">7.2 In case of payment disputes, please reach out to our support team at <a href="mailto:Gowtham@vyapaar360.in" className="text-primary underline">Gowtham@vyapaar360.in</a> or <a href="tel:+919353690229" className="text-primary underline">+91 9353690229</a>.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">8. Modifications</h2>
          <p className="dashboard-text">8.1 Vyapaar360 reserves the right to modify these Terms and Conditions at any time. Changes will be effective upon posting to our website.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">9. Governing Law</h2>
          <p className="dashboard-text">9.1 These Terms and Conditions are governed by the laws of India. Any disputes will be resolved under the jurisdiction of the courts in Bengaluru, Karnataka.</p>
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