import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SvgEffect from './SvgEffect';
import HeroSection from './HeroSection';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/cart', label: '', icon: <ShoppingCartIcon className="text-white" /> },
    // Show Admin Dashboard for admins, hide Admin button for regular users
    ...(user?.accountType === 'admin' ? [{ to: '/admin-dashboard', label: 'Admin Dashboard', icon: <DashboardIcon className="text-white" /> }] : []),
    user 
      ? { to: '/profile', label: '', icon: null, isAvatar: true }
      : { to: '/auth', label: '', icon: <PersonIcon className="text-white" /> },
  ];

  return (
    <nav className='fixed top-0 left-0 right-0 z-50'>
      {/* SVG Background */}
      <div className='absolute inset-0 w-full h-full'>
        <SvgEffect />
      </div>
      {/* Modern Glassmorphism Overlay */}
      <div className='absolute inset-0 bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-lg'></div>
      {/* Navbar Content - positioned absolutely over SVG */}
      <div className='relative z-10 flex flex-col'>
        {/* Top Navigation Bar */}
        <div className='flex justify-between items-center p-4 max-w-7xl mx-auto w-full'>
        <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-18 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 overflow-hidden'>
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          {/* Desktop Nav Links */}
          <div className='hidden md:flex items-center gap-6'>
            {navLinks.map((link, index) => (
              <Link key={link.to} to={link.to} className='text-white hover:text-gray-200 transition-all duration-300 font-medium relative group flex items-center gap-2'>
                {link.isAvatar ? (
                  <div className='w-8 h-8 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all duration-300'>
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className='w-full h-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm'>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                ) : (
                  <>
                    {link.icon}
                    {link.label && <span>{link.label}</span>}
                    {link.label && <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full'></span>}
                  </>
                )}
              </Link>
            ))}
            
            {/* Logout Button - Only show when user is logged in */}
            {user && (
              <button
                onClick={logout}
                className='bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-red-500/30 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2'
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
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
              {navLinks.map((link, index) => (
                <Link key={link.to} to={link.to} className='text-primary-700 hover:text-primary-900 transition-all duration-300 font-medium text-lg text-center flex items-center justify-center gap-2' onClick={() => setMobileOpen(false)}>
                  {link.isAvatar ? (
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-primary-300'>
                        {user?.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.name}
                            className='w-full h-full object-cover'
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className='w-full h-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-lg'>
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <span className='text-primary-700 font-medium'>{user?.name}</span>
                    </div>
                  ) : (
                    <>
                      {link.icon}
                      {link.label && <span>{link.label}</span>}
                    </>
                  )}
                </Link>
              ))}
              
              {/* Logout Button for Mobile - Only show when user is logged in */}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg text-center flex items-center justify-center gap-2'
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              )}
            </div>
            <button className='mt-8 text-white text-2xl' onClick={() => setMobileOpen(false)} aria-label='Close menu'>×</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

