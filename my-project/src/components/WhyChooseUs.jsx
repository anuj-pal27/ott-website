import React from 'react';

const WhyChooseUs = React.memo(function WhyChooseUs() {
  return (
    <section className="max-w-6xl mx-auto mt-16 mb-12 px-4">    
      <div className="text-center mb-8">
        <span className="dashboard-badge mb-2">💡 Key Features That Set Us Apart</span>
        <h2 className="dashboard-heading mb-2">Why Choose Us?</h2>
        <p className="dashboard-subheading max-w-2xl mx-auto">At our platform, we're dedicated to delivering quality, security, and value. Here's why smart shoppers prefer us:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">⚡</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Instant Access</h3>
          <p className="text-gray-700 text-sm">Get immediate access to your subscriptions with fast, hassle-free delivery. No delays, just instant activation.</p>
        </div>
        {/* Card 2 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">✅</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">100% Genuine</h3>
          <p className="text-gray-700 text-sm">We offer original products only—no GPL or cracked versions. All subscriptions come with authentic license keys. 🛡️</p>
        </div>
        {/* Card 3 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">🎯</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Expert Support</h3>
          <p className="text-gray-700 text-sm">Our expert team is always ready to assist, ensuring a smooth and seamless shopping experience.</p>
        </div>
        {/* Card 4 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">🔄</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Auto Updates</h3>
          <p className="text-gray-700 text-sm">Stay updated effortlessly with automatic updates for the latest features and security enhancements.</p>
        </div>
        {/* Card 5 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">📜</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Licensed Products</h3>
          <p className="text-gray-700 text-sm">Every subscription includes a legitimate license, giving you legal usage rights without worry.</p>
        </div>
        {/* Card 6 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">🛡️</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Advanced Security</h3>
          <p className="text-gray-700 text-sm">Strong security measures protect your data and privacy, keeping your information safe.</p>
        </div>
      </div>
    </section>
  );
});

export default WhyChooseUs; 