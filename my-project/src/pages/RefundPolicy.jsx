import React, { Suspense } from 'react';
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
      <div className="text-center mb-8">
        <h1 className="dashboard-heading">Refund Policy</h1>
      </div>

      <div className="dashboard-card space-y-6">
        <p className="dashboard-text">At Vyapaar360, we strive to ensure customer satisfaction. Please review our Refund Policy below:</p>

        <div>
          <h2 className="text-xl font-bold mb-2">1. Eligibility for Refunds</h2>
          <p className="dashboard-text mb-2">1.1 Refunds are applicable only under the following conditions:</p>
          <ul className="list-disc ml-6 dashboard-text-muted space-y-1">
            <li>The payment was made in error (e.g., duplicate transactions).</li>
            <li>The service/product was not delivered as promised.</li>
            <li>Cancellation of services within the specified time frame (if applicable).</li>
          </ul>
          <p className="dashboard-text mt-2">1.2 Refund requests must be submitted within 7 days of the transaction date.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">2. Non-Refundable Transactions</h2>
          <p className="dashboard-text mb-2">2.1 Certain services/products are non-refundable. These include:</p>
          <ul className="list-disc ml-6 dashboard-text-muted space-y-1">
            <li>Custom software development projects after the commencement of work.</li>
            <li>Subscription-based services after the service period has started.</li>
            <li>Services explicitly marked as non-refundable.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">3. Refund Process</h2>
          <p className="dashboard-text mb-2">3.1 To initiate a refund, please contact our support team at <a className="text-primary underline" href="mailto:Gowtham@vyapaar360.in">Gowtham@vyapaar360.in</a> or <a className="text-primary underline" href="tel:+919353690229">+91 9353690229</a>.</p>
          <p className="dashboard-text mb-2">3.2 Provide the following details:</p>
          <ul className="list-disc ml-6 dashboard-text-muted space-y-1">
            <li>Transaction ID or receipt</li>
            <li>Reason for the refund request</li>
            <li>Any supporting documents (if applicable)</li>
          </ul>
          <p className="dashboard-text mt-2">3.3 Once your request is reviewed and approved, the refund will be processed within 7-10 business days.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">4. Mode of Refund</h2>
          <p className="dashboard-text mb-2">4.1 Refunds will be issued to the original payment method used during the transaction.</p>
          <p className="dashboard-text">4.2 Vyapaar360 is not responsible for delays caused by your financial institution or third-party payment processors.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">5. Dispute Resolution</h2>
          <p className="dashboard-text mb-2">5.1 If you are not satisfied with the refund outcome, you may escalate the issue to <a className="text-primary underline" href="mailto:sales@vyapaar360.in">sales@vyapaar360.in</a> or <a className="text-primary underline" href="tel:+919353690229">+91 9353690229</a>.</p>
          <p className="dashboard-text">5.2 Disputes will be resolved in accordance with applicable laws.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">6. Changes to Refund Policy</h2>
          <p className="dashboard-text">6.1 Vyapaar360 reserves the right to modify this Refund Policy at any time. Updated policies will be posted on our website.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Contact Us</h2>
          <p className="dashboard-text">For any inquiries or support, please contact us at:</p>
          <ul className="list-disc ml-6 dashboard-text-muted space-y-1">
            <li>Email: <a className="text-primary underline" href="mailto:sales@vyapaar360.in">sales@vyapaar360.in</a></li>
            <li>Phone: <a className="text-primary underline" href="tel:+919353690229">+91 9353690229</a></li>
            <li>1955, H V HALL RR NAGARA , BENGALURU, Karnataka, India - 560098.</li>
          </ul>
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