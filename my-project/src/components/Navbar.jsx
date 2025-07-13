import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SvgEffect from './SvgEffect';
import HeroSection from './HeroSection';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/cart', label: '', icon: <ShoppingCartIcon className="text-white" /> },
    { to: '/admin', label: 'Admin' },
    { to: '/login', label: '', icon: <PersonIcon className="text-white" /> },

  ];

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 h-screen border-b-4 border-white/30'>
      {/* SVG Background */}
      <div className='absolute inset-0 w-full h-full'>
        <SvgEffect />
      </div>
      {/* Modern Glassmorphism Overlay */}
      <div className='absolute inset-0 bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-lg'></div>
      {/* Navbar Content - positioned absolutely over SVG */}
      <div className='relative z-10 flex flex-col h-full'>
        {/* Top Navigation Bar */}
        <div className='flex justify-between items-center p-4 max-w-7xl mx-auto w-full'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/30'>
                <span className='text-white font-bold text-lg'>L</span>
              </div>
              <h2 className='text-xl font-bold text-white drop-shadow-lg'>Logo</h2>
            </div>
          </div>
          {/* Desktop Nav Links */}
          <div className='hidden md:flex items-center gap-6'>
            {navLinks.map(link =>
              link.special ? (
                <Link key={link.to} to={link.to} className='bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl hover:scale-105'>
                  {link.label || link.icon}
                </Link>
              ) : (
                <Link key={link.to} to={link.to} className='text-white hover:text-gray-200 transition-all duration-300 font-medium relative group flex items-center'>
                  {link.label || link.icon}
                  {link.label && <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full'></span>}
                </Link>
              )
            )}
          </div>
          {/* Hamburger Icon */}
          <button
            className='md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50'
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label='Open menu'
          >
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
        </div>
        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div className='fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-start pt-24 md:hidden'>
            <div className='bg-white/90 rounded-2xl shadow-xl w-11/12 max-w-xs p-6 flex flex-col gap-4'>
              {navLinks.map(link =>
                link.special ? (
                  <Link key={link.to} to={link.to} className='bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl transition-all duration-300 font-medium shadow-lg text-center' onClick={() => setMobileOpen(false)}>
                    {link.label || link.icon}
                  </Link>
                ) : (
                  <Link key={link.to} to={link.to} className='text-primary-700 hover:text-primary-900 transition-all duration-300 font-medium text-lg text-center flex items-center justify-center' onClick={() => setMobileOpen(false)}>
                    {link.label || link.icon}
                  </Link>
                )
              )}
            </div>
            <button className='mt-8 text-white text-2xl' onClick={() => setMobileOpen(false)} aria-label='Close menu'>×</button>
          </div>
        )}
        {/* Hero Section */}
        <HeroSection />
      </div>
    </nav>
  );
}

export default Navbar;

