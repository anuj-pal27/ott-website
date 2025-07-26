import React from 'react';

const WhyChooseUs = React.memo(function WhyChooseUs() {
  return (
    <section className="max-w-6xl mx-auto mt-16 mb-12 px-4">    
      <div className="text-center mb-8">
        <span className="dashboard-badge mb-2">💡 Why Choose Our Digital Services Platform</span>
        <h2 className="dashboard-heading mb-2">Your One-Stop Digital Solution</h2>
        <p className="dashboard-subheading max-w-3xl mx-auto">
          From streaming services to professional software, instant websites to development tools - 
          we provide everything you need for your digital lifestyle and business at unbeatable prices!
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">⚡</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Instant Access</h3>
          <p className="text-gray-700 text-sm">Get immediate access to all services - streaming, software, websites, and tools. No delays, just instant activation.</p>
        </div>
        {/* Card 2 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">✅</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">100% Genuine</h3>
          <p className="text-gray-700 text-sm">We offer original products only—no cracked versions. All software and services come with authentic licenses. 🛡️</p>
        </div>
        {/* Card 3 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">🎯</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Expert Support</h3>
          <p className="text-gray-700 text-sm">Our expert team provides support for all services - from software installation to website setup and troubleshooting.</p>
        </div>
        {/* Card 4 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">💰</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Best Prices</h3>
          <p className="text-gray-700 text-sm">Save up to 70% on premium software, get websites at fraction of market cost, and enjoy discounted streaming services.</p>
        </div>
        {/* Card 5 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">🌐</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Complete Solutions</h3>
          <p className="text-gray-700 text-sm">From entertainment to productivity, development to design - we cover all your digital needs in one platform.</p>
        </div>
        {/* Card 6 */}
        <div className="bg-white/40 border border-emerald-200 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center backdrop-blur-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <span className="text-5xl mb-3">🛡️</span>
          <h3 className="font-bold text-xl text-slate-900 mb-1">Secure & Reliable</h3>
          <p className="text-gray-700 text-sm">Strong security measures protect your data and transactions, ensuring safe and reliable service delivery.</p>
        </div>
      </div>
    </section>
  );
});

export default WhyChooseUs; 