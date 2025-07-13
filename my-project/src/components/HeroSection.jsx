import React from 'react';
import ottPlatform from '../assets/ott_platform.jpg';

const HeroSection = () => (
  <div className='flex-1 flex items-center justify-center px-4'>
    <div className='max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
      {/* Left Side - Content */}
      <div className='text-left space-y-8'>
        <h1 className='text-5xl md:text-6xl font-bold text-white drop-shadow-2xl leading-tight'>
          Affordable Subscriptions
        </h1>
        <p className='text-2xl md:text-3xl text-green-900 drop-shadow-xl leading-relaxed'>
          All in One Place
        </p>
        <p className='text-lg md:text-xl text-green-900 drop-shadow-lg leading-relaxed max-w-2xl'>
          Get Netflix, Prime, YouTube Premium & more — at unbeatable shared prices.
          <br />
          <span className='font-semibold text-green-900'>Instant Access, Global Availability,</span> trusted by thousands.
        </p>
        <button className='bg-primary hover:bg-secondary text-white px-8 py-4 rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border
         border-white/30 shadow-lg hover:shadow-xl hover:scale-105'>
          Explore Products
        </button>
      </div>
      {/* Right Side - Image */}
      <div className='flex justify-center lg:justify-end'>
        <div className='relative group'>
          <div className='absolute -inset-4 bg-gradient-to-r from-primary-400 to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300'></div>
          <img 
            src={ottPlatform} 
            alt="OTT Platform Services" 
            className='relative w-full max-w-md h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-300'
          />
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;
