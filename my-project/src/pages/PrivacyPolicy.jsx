import React, { Suspense } from 'react';
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
      <div className="text-center mb-8">
        <h1 className="dashboard-heading">Privacy Policy</h1>
        <p className="dashboard-subheading max-w-3xl mx-auto mt-2">Your privacy is important to us. Please read this policy to understand how we handle your data.</p>
      </div>

      <div className="dashboard-card space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Data Aggregation</h2>
          <p className="dashboard-text">Vyapaar360 collects information with elements for business and consumers alike. All information is acquired from reliable sources and quality control measures are taken to ensure the accuracy of the database.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Where Do We Collect Prospect Data?</h2>
          <ul className="list-disc ml-6 dashboard-text-muted space-y-1">
            <li>Web-based registrations and offers</li>
            <li>Government records</li>
            <li>Transactional data</li>
            <li>Newsletter subscription offers</li>
            <li>Business tradeshow attendee lists</li>
            <li>Public record information</li>
            <li>Business trade magazine subscription offers</li>
            <li>Sign-up data from email campaigns</li>
            <li>B2B directories</li>
            <li>Annual reports, SEC filings</li>
            <li>Phone surveys with businesses</li>
            <li>Registration process for subscription sites</li>
            <li>Community postings</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Community Postings</h2>
          <p className="dashboard-text">Vyapaar360 gathers information by prioritizing its quality. We do not collect or engage generic email addresses entered by individuals. Vyapaar360 collects Personal Information (name and email address) through contact forms on our site because it helps us contact individuals likely to become our paying customers. We may also acquire information from our affiliates and co-branded sites.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Sharing Of Information And Disclosure</h2>
          <p className="dashboard-text">Vyapaar360 does not share any collected Personal Information with third-party affiliates or partners. We value the privacy of information filled by users, and no information shall be used in any manner other than disclosed in this Privacy Policy. Vyapaar360 may roll out promotional offers to help its clients discover value. Hence, any Personal Information of the subscriber shall only be disclosed to a third party where:</p>
          <ul className="list-disc ml-6 dashboard-text-muted space-y-1 mt-2">
            <li>Vyapaar360 is confident about the benefits that favor its customers.</li>
            <li>The recipients acknowledge receiving communications.</li>
            <li>Law enforcers and judicial authorities urge to furnish information.</li>
          </ul>
          <p className="dashboard-text mt-2">Should you wish to stop receiving any marketing communications from Vyapaar360, unsubscribe by following the link provided at the footer of our promotional emails. We shall remove unsubscribed users from the mailing database to cease future marketing communications from reaching their mailbox.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Privacy And Security</h2>
          <p className="dashboard-text">Vyapaar360 carries its positive reputation for taking utmost care in managing Personal Information collected from site visitors and customers. We may share your contact information with our affiliates only if some offerings are relevant to your interest. Your Personal Information helps us serve better and improve the user experience on our site. We also use the information to identify legitimate users. We identify the site visitors by tracking information such as domain name, IP address, and other information that distinctively identifies one user from another. We also collect information obtained through surveys, form fill-outs, and tracking pages visited by users. The purpose of tapping such information is to provide seamless delivery of customized promotions such as email alerts, e‑newsletters, promotional emails, and product information. Vyapaar360 may also use the information to build our internal database of interest-based users.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">The Policy Of Data Usage</h2>
          <p className="dashboard-text">The Personal Information that we collect is primarily used for our B2B transactions. However, we may also use the same for notifying updates and validating sales transactions. We do not share your information with third-party marketers who may have an interest in communicating with you. If you no longer wish to receive marketing communication from Vyapaar360, follow the link to unsubscribe provided at the footer of every email. Vyapaar360 will remove your information from our mailing database preventing any future communications from reaching your mailbox.</p>
          <p className="dashboard-text mt-2">When you access an external link from our site, your information may be collected by third-party sites to identify you personally. Vyapaar360 is not liable to mediate any disputes or cover for damages that users endure by visiting an external site. Vyapaar360 requests its users to refrain from divulging any personal information on our site. Information such as account details and passwords are sensitive data that are vulnerable to misuse and loss. Despite the exhaustive measures taken by our security experts to safeguard your data, you will be solely held responsible for any data acquired from us.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">How Vyapaar360 Protects User Information?</h2>
          <p className="dashboard-text">Our in-house security experts deploy advanced digital tactics to secure every database. Some of the latest strategies are used to prevent mismanagement and unauthorized access to sensitive data. Vyapaar360 does not furnish Personal Information to its affiliates and partners without prior consent from individuals. Since Vyapaar360 is a technologically driven brand, we take stringent measures to protect data integrity. Our updated data security mechanism checks the pulse of every database and Personal Information to prevent unauthorized access and misuse. However, in the wake of technological evolution, it is impossible to assure a 100% safety of any digital data. Hence, Vyapaar360 does not guarantee a 100% safety of any client information. By using our services, you acknowledge the passive risks of sharing digital data.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">What Information Do We Collect?</h2>
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
          <p className="dashboard-text">Personal Information such as email, name, and address offered to us through form fill-outs by users interested in our services. Should you choose not to submit complete information, you may not enjoy full benefits offered by us.</p>
          <h3 className="font-semibold text-gray-900 mt-3">Tracking Information</h3>
          <p className="dashboard-text">Vyapaar360 may collect your IP address to identify users personally. It is part of our effort to encourage effective interaction with legitimate users alone.</p>
          <h3 className="font-semibold text-gray-900 mt-3">Cookies</h3>
          <p className="dashboard-text">Vyapaar360 uses cookies to track fundamental interactions made by users on our site. It helps us to improve the user experience. You reserve the right to accept or decline our cookies. Note: Any third-party links leading away from our website may use cookies to track visitors, and the use of such is not covered under this Policy.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Protection Of Information</h2>
          <p className="dashboard-text">The user behavior information such as cookies, click-throughs, opened acknowledgments, and email conversations collected from users will not be shared with any third party in any manner other than otherwise indicated in this Privacy Policy. Vyapaar360 collaborates with third-party sources for closure of sales transactions. We take extraordinary measures to prevent retaining or storing the transaction details and are a subject matter of solicitation.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Marketing Emails</h2>
          <p className="dashboard-text">It is prohibited to use Vyapaar360 resources for illicit reasons, and we advise users to remain compliant with respective laws (state, federal, or international) while using our service features. This Privacy Policy is presented to promulgate the ethical use of digital data and to brief users how we handle the information submitted to us. Your information and feedback help us enhance the quality of service and the security of digital data. When you are using the features of our services, you are agreeing to the terms of this Policy and acknowledging the data handling ethics.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Marketing Content</h2>
          <p className="dashboard-text">At Vyapaar360, we take particular care to ensure that subscribers receive relevant content fully compliant with the laws. Our content algorithm is capable of serving the right content based on the Personal Information submitted by individuals.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Unsubscribe</h2>
          <p className="dashboard-text">Every email that we send has an unsubscribe link prominently displayed in the footer. If you choose not to be contacted, click the link and you will be automatically removed from all our future email campaigns, newsletters, and promotions. We are bound to respect the interest of our valuable clients and will commit to abide by rules of the industry. Note: When recipients unsubscribe from our marketing campaigns, they may stop receiving any future communications. However, some residual information may remain in our database, which could be due to data being deleted multiple times.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Modification Of Personal Information</h2>
          <p className="dashboard-text">If you wish to update the Personal Information submitted to us, reach us at <a className="text-primary underline" href="mailto:Gowtham@vyapaar360.in">Gowtham@vyapaar360.in</a> or call <a className="text-primary underline" href="tel:+919353690229">+91 9353690229</a>. We shall get back to you in 24 hours.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Emendation Of Privacy Policy</h2>
          <p className="dashboard-text">Vyapaar360 may modify this Privacy Policy without prior intimation. To stay updated on recent revisions on data usage, please refer to this Policy periodically. Alternatively, you may receive email communication from us when changes are amended to this policy. Nevertheless, by using our site or services you acknowledge the terms of this Privacy Policy unconditionally.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Disclaimer</h2>
          <p className="dashboard-text">Users may visit any external links within our website at their own risk. Vyapaar360 is not liable for any information submitted by visitors on third-party links.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Queries And Concerns</h2>
          <p className="dashboard-text">If you have doubts regarding the use of our services, reach us now!</p>
          <ul className="list-disc ml-6 dashboard-text-muted space-y-1 mt-2">
            <li>Email: <a className="text-primary underline" href="mailto:sales@vyapaar360.in">sales@vyapaar360.in</a></li>
            <li>Phone: <a className="text-primary underline" href="tel:+919353690229">+91 9353690229</a></li>
            <li>Address: 1955, H V HALL RR NAGARA , BENGALURU, Karnataka, India - 560098.</li>
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

export default PrivacyPolicy; 