import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SvgEffect from './SvgEffect';
import HeroSection from './HeroSection';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';
import CartSidePanel from './CartSidePanel';
import { useCart } from '../context/CartContext';

const CATEGORY_ICON_MAP = {
  'AI TOOLS': { name: 'AI Tools', icon: '🤖' },
  'GRAPHICS AND VIDEO EDITING SERVICES': { name: 'Graphics & Video', icon: '🎬' },
  'WRITING TOOLS SERVICES': { name: 'Writing Tools', icon: '✍️' },
  'PRODUCTIVITY AND OFFICE MANAGEMENT SERVICES': { name: 'Productivity & Office', icon: '📈' },
  'ONLINE MARKETING And SOFTWARE': { name: 'Marketing & Software', icon: '📢' },
  'DATA EXTRACTER SERVICES': { name: 'Data Extractor', icon: '📊' },
  'DATING SUBSCRIPTION': { name: 'Dating', icon: '💖' },
  'ONLINE ENTERTAINMENT SERVICES': { name: 'Entertainment', icon: '🎥' },
  'subscriptions': { name: 'Streaming', icon: '📺' },
  'software': { name: 'Software', icon: '💻' },
  'websites': { name: 'Websites', icon: '🌐' },
  'tools': { name: 'Tools', icon: '🛠️' },
  'music': { name: 'Music', icon: '🎵' },
  'other': { name: 'Other', icon: '📦' },
  'featured': { name: 'Featured', icon: '⭐' },
};

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart, clearCart } = useCart();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/plans/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Remove 'All Services' from allCategories
  const allCategories = categories.map(cat => ({
    label: CATEGORY_ICON_MAP[cat]?.name || cat,
    to: `/categories/${encodeURIComponent(cat)}`
  }));

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    // Categories button will be handled separately
    { to: '/cart', label: '', icon: <ShoppingCartIcon className="text-white" /> },
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
            {/* Categories Dropdown */}
            <div className='relative group' onMouseEnter={() => setCategoriesOpen(true)} onMouseLeave={() => setCategoriesOpen(false)}>
              <button
                className='text-white hover:text-gray-200 transition-all duration-300 font-medium flex items-center gap-1 px-2 py-1 rounded-lg focus:outline-none'
                type='button'i
                aria-haspopup='true'
                aria-expanded={categoriesOpen}
              >
                Categories <KeyboardArrowDownIcon style={{ fontSize: 20 }} />
              </button>
              {categoriesOpen && (
                <div className='absolute left-0 mt-2 w-56 bg-white/95 rounded-xl shadow-lg py-4 z-50 border border-white/30'>
                  {allCategories.map((cat) => (
                    <Link
                      key={cat.to}
                      to={cat.to}
                      className='block px-5 py-3 text-gray-800 hover:bg-primary/10 hover:text-primary font-medium rounded-lg transition-all duration-200'
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Other nav links */}
            {navLinks.map((link, index) => (
              link.to === '/cart' ? (
                <button
                  key="cart-btn"
                  onClick={() => setCartOpen(true)}
                  className="relative flex items-center justify-center"
                  aria-label="Open cart"
                  type="button"
                >
                  <ShoppingCartIcon className="text-white" />
                  {cart && cart.items && cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cart.items.length}
                    </span>
                  )}
                </button>
              ) : (
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
              )
            ))}
            {/* Payment History & Orders link */}
            {user && (
              <Link to="/payment-history" className='text-white hover:text-gray-200 transition-all duration-300 font-medium relative group flex items-center gap-2'>
                <span>Payment History & Orders</span>
              </Link>
            )}
            
            {/* Logout Button - Only show when user is logged in */}
            {user && (
              <button
                onClick={() => {
                  logout();
                  clearCart();
                }}
                className='bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-red-500/30 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2'
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            )}
          </div>
          {/* Hamburger/Close Icon */}
          <button
            className='md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50'
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            ) : (
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div className='fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-start pt-24 md:hidden'>
            <div className='bg-white/90 rounded-2xl shadow-xl w-11/12 max-w-xs p-6 flex flex-col gap-4'>
              {/* Mobile Categories Dropdown */}
              <div>
                <button
                  className='w-full flex items-center justify-between text-primary-700 font-medium text-lg px-3 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200'
                  onClick={() => setMobileCategoriesOpen((open) => !open)}
                  aria-haspopup='true'
                  aria-expanded={mobileCategoriesOpen}
                  type='button'
                >
                  Categories 
                  <KeyboardArrowDownIcon 
                    style={{ 
                      fontSize: 22,
                      transform: mobileCategoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease-in-out'
                    }} 
                  />
                </button>
                {mobileCategoriesOpen && (
                  <div className='mt-1 bg-white/95 rounded-xl shadow-lg py-2 border border-primary/20'>
                    {allCategories.map((cat) => (
                      <Link
                        key={cat.to}
                        to={cat.to}
                        className='block px-5 py-3 text-primary-700 hover:bg-primary/10 font-medium rounded-lg transition-all duration-200'
                        onClick={() => {
                          setMobileCategoriesOpen(false);
                          setMobileOpen(false);
                        }}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {/* Other mobile nav links */}
              {navLinks.map((link, index) => (
                link.to === '/cart' ? (
                  <button
                    key="mobile-cart-btn"
                    onClick={() => {
                      setCartOpen(true);
                      setMobileOpen(false);
                    }}
                    className='text-primary-700 hover:text-primary-900 transition-all duration-300 font-medium text-lg text-center flex items-center justify-center gap-2 w-full'
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCartIcon className="text-primary-700" />
                      {cart && cart.items && cart.items.length > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {cart.items.length}
                        </span>
                      )}
                    </div>
                    <span>Cart</span>
                  </button>
                ) : (
                  <Link key={link.to} to={link.to} className='text-primary-700  hover:text-primary-900 transition-all duration-300 font-medium text-lg text-center flex items-center justify-center gap-2' onClick={() => setMobileOpen(false)}>
                    {link.isAvatar ? (
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-primary-300 '>
                          {user?.profilePicture ? (
                            <img 
                              src={user.profilePicture} 
                              alt={user.name}
                              className='w-full  h-full object-cover'
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
                        {link.to === '/admin-dashboard' ? (
                          <DashboardIcon className="text-primary-700" />
                        ) : link.to === '/auth' ? (
                          <PersonIcon className="text-primary-700" />
                        ) : null}
                        {link.label && <span>{link.label}</span>}
                      </>
                    )}
                  </Link>
                )
              ))}
              {/* Payment History & Orders link */}
              {user && (
                <Link to="/payment-history" className='text-primary-700 hover:text-primary-900 transition-all duration-300 font-medium text-lg text-center flex items-center justify-center gap-2' onClick={() => setMobileOpen(false)}>
                  Payment History & Orders
                </Link>
              )}
              
              {/* Logout Button for Mobile - Only show when user is logged in */}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    clearCart();
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
            {/* Bottom Close Button - More Visible */}
            <button 
              className='mt-6 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-white/30 shadow-lg' 
              onClick={() => setMobileOpen(false)} 
              aria-label='Close menu'
            >
              ×
            </button>
          </div>
        )}
      </div>
      {/* Cart Side Panel */}
      <CartSidePanel isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
}

export default Navbar;

