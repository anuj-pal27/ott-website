import React, { useState, useRef, useEffect } from 'react';

const FEEDBACKS = [
  {
    name: 'Emily Lewis',
    role: 'Web Developer',
    avatar: 'E',
    feedback: 'A reliable service that helped me scale my store effortlessly. Fast delivery 🚀, secure products 🛡️, and zero licensing worries. Perfect combo!',
  },
  {
    name: 'John Smith',
    role: 'E-commerce Entrepreneur',
    avatar: 'J',
    feedback: "Knowing I'm getting original licensed products gives me peace of mind. ✅ Plus, the affordable prices are just unbeatable! 💰",
  },
  {
    name: 'Rajesh Gupta',
    role: 'Tech Enthusiast',
    avatar: 'R',
    feedback: "I appreciate this platform's commitment to authenticity. Knowing that I'm getting original licenses for plugins and themes gives me peace of mind. The low cost is just the cherry on top!",
  },
  {
    name: 'Sara Kim',
    role: 'Digital Marketer',
    avatar: 'S',
    feedback: "The support team is super responsive and helpful. I got my subscription instantly and everything works as promised. Highly recommended!",
  },
  {
    name: 'Alex Turner',
    role: 'Startup Founder',
    avatar: 'A',
    feedback: "The best place for affordable, genuine subscriptions. The auto-updates and security features are a huge plus for my business.",
  },
];

function useResponsiveCardsPerSlide() {
  const [cardsPerSlide, setCardsPerSlide] = useState(3);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setCardsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(3);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return cardsPerSlide;
}

const CustomerFeedback = React.memo(function CustomerFeedback() {
  const cardsPerSlide = useResponsiveCardsPerSlide();
  const [windowStart, setWindowStart] = useState(0);
  const numCards = FEEDBACKS.length;

  // Move window right (next)
  const slideNext = () => {
    setWindowStart((prev) => (prev + 1) % numCards);
  };
  // Move window left (prev)
  const slidePrev = () => {
    setWindowStart((prev) => (prev - 1 + numCards) % numCards);
  };

  // Get the visible cards for current window
  const getVisibleCards = () => {
    return Array.from({ length: cardsPerSlide }).map((_, offset) => FEEDBACKS[(windowStart + offset) % numCards]);
  };
  const visibleCards = getVisibleCards();
  const cardWidth = cardsPerSlide === 1 ? 320 : cardsPerSlide === 2 ? 300 : 340;
  const containerMaxWidth = cardWidth * cardsPerSlide + 32;

  return (
    <section className="max-w-6xl mx-auto my-16 px-2 sm:px-4">
      
      <div className="text-center mb-8 relative">
        <span className="dashboard-badge mb-2">💬 Real Voices, Real Experiences </span>
        <h2 className="dashboard-heading mb-2 mt-2 ">What Our Customers Say</h2>
        <p className="dashboard-subheading max-w-2xl mx-auto">
          Discover how our affordable subscriptions have transformed the online journeys of our valued customers. Check out their genuine feedback:
        </p>
      </div>
      {/* Simple window carousel */}
      <div
        className="relative overflow-hidden mb-6 mx-auto"
        style={{ maxWidth: containerMaxWidth }}
      >
        <div className="flex" style={{ width: '100%' }}>
          {visibleCards.map((fb, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 px-1 sm:px-2 ${cardsPerSlide === 1 ? 'w-[320px]' : cardsPerSlide === 2 ? 'w-[300px]' : 'w-[340px]'}`}
            >
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col items-center text-center hover:shadow-xl transition mx-1 sm:mx-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border border-primary/20">
                    {fb.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{fb.name}</div>
                    <div className="text-primary text-xs font-medium">{fb.role}</div>
                  </div>
                </div>
                <div className="text-gray-600 text-sm flex-1 mb-2">
                  <span className="block font-medium text-lg text-yellow-500 mb-1">★★★★★</span>
                  <span>"{fb.feedback}"</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Arrows */}
        <button
          onClick={slidePrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/40 border border-gray-200"
          style={{ minWidth: 36, minHeight: 36 }}
          aria-label="Previous"
        >&#8592;</button>
        <button
          onClick={slideNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/40 border border-gray-200"
          style={{ minWidth: 36, minHeight: 36 }}
          aria-label="Next"
        >&#8594;</button>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: numCards }).map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${i === windowStart ? 'bg-primary' : 'bg-gray-300'} transition`}
            onClick={() => setWindowStart(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
});

export default CustomerFeedback; 