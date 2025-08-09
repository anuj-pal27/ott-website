import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-gray-50 pt-12 pb-4 px-4 md:px-0 relative overflow-hidden text-gray-800 border-t border-gray-200">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 relative z-10">
      {/* Left: Why We Are Best */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Why We Are Best?</h3>
        <p className="text-gray-600 mb-4 max-w-xs">
          Your ultimate digital services platform! From streaming subscriptions to professional software, 
          instant websites to development tools - we provide everything you need at unbeatable prices. 
          Quality, affordability, and reliability all in one place! 🚀
        </p>
        <div className="flex gap-3 mt-4">
          <a href="https://www.facebook.com/profile.php?id=61556896286817&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-secondary rounded-full p-2 transition" aria-label="Facebook"><FaFacebookF className="text-white text-xl" /></a>
          <a href="https://x.com/Hillborntech" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-secondary rounded-full p-2 transition" aria-label="Twitter / X"><FaTwitter className="text-white text-xl" /></a>
          <a href="https://www.instagram.com/hillborn_technologies?igsh=MWxnY3MyMjU1aHV0OA==" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-secondary rounded-full p-2 transition" aria-label="Instagram"><FaInstagram className="text-white text-xl" /></a>
        </div>
      </div>
      {/* Center: Best Selling */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">BEST SELLING</h3>
        <ul className="space-y-2">
          <li><Link to="/" className="hover:text-primary text-gray-600 transition">Home</Link></li>
          <li><Link to="/services" className="hover:text-primary text-gray-600 transition">Services</Link></li>
          <li><Link to="/services" className="hover:text-primary text-gray-600 transition">Shop</Link></li>
          <li><Link to="/contact" className="hover:text-primary text-gray-600 transition">Contact Us</Link></li>
          <li><Link to="/profile" className="hover:text-primary text-gray-600 transition">My account</Link></li>
        </ul>
      </div>
      {/* Right: Useful Links */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">USEFUL LINKS</h3>
        <ul className="space-y-2">
          <li><Link to="/about" className="hover:text-primary text-gray-600 transition">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-primary text-gray-600 transition">Contact Us</Link></li>
          <li><Link to="/privacy-policy" className="hover:text-primary text-gray-600 transition">Privacy Policy</Link></li>
          <li><Link to="/refund-policy" className="hover:text-primary text-gray-600 transition">Refunds Policy</Link></li>
          <li><Link to="/terms-and-conditions" className="hover:text-primary text-gray-600 transition">Terms & Conditions</Link></li>
        </ul>
      </div>
    </div>
    {/* Divider */}
    <div className="max-w-7xl mx-auto mt-10 mb-4 border-t border-gray-300"></div>
    {/* Bottom bar */}
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-gray-600 text-sm px-2">
      <div>©Copyright 2025 | <a href="#" className="hover:underline text-primary">vyapaar360</a></div>
      {/* WhatsApp */}
      <div className="flex items-center gap-3">
        <a href="https://wa.me/919353690229" target="_blank" rel="noopener noreferrer" className="ml-1 bg-green-500 hover:bg-green-600 rounded-full p-2 transition" aria-label="WhatsApp">
          <FaWhatsapp className="text-white text-2xl" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer; 