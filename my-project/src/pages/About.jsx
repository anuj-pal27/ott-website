import React from 'react';
import SvgEffect from '../components/SvgEffect';

function About() {
  return (
    <div className="dashboard-theme min-h-screen relative overflow-hidden">
      {/* SVG Background */}
      <div className="absolute inset-0 w-full h-full">
        <SvgEffect />
      </div>
      {/* Additional gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8" id="about-section">
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
          <h1 className="dashboard-heading mb-2 text-center">About Us</h1>
          <p className="dashboard-subheading mb-8 text-center">Learn more about our platform, our mission, and the team behind the vision.</p>
          {/* Platform Description */}
          <div className="mb-8 text-white/90 text-lg text-center">
            Welcome to <span className="font-bold text-white ">Vyapaar360</span>! We are dedicated to providing the best subscription services tailored to your needs. Our platform brings together top-rated plans, seamless checkout, and a user-friendly experience.
          </div>
          {/* Mission & Vision */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Our Mission</h2>
            <p className="text-white/80 text-center">To empower users with easy access to the best subscription services, making life simpler and more enjoyable.</p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Our Vision</h2>
            <p className="text-white/80 text-center">To be the leading platform for discovering, managing, and enjoying subscriptions worldwide.</p>
          </div>
          {/* Values or Team Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 rounded-xl p-6 text-center border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2 underline underline-offset-4 decoration-green-500">Customer Focus</h3>
              <p className="text-white/80">We put our users at the heart of everything we do, striving to exceed expectations.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2 underline underline-offset-4 decoration-green-500">Innovation</h3>
              <p className="text-white/80">We embrace new ideas and technologies to deliver the best experience possible.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2 underline underline-offset-4 decoration-green-500">Integrity</h3>
              <p className="text-white/80">We are committed to transparency, honesty, and building trust with our community.</p>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default About;