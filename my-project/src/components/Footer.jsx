import React from 'react';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-gradient-to-r from-[#2C4974] via-[#2C4974] to-[#00665e] pt-12 pb-4 px-4 md:px-0 relative overflow-hidden text-white border-t border-white/10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 relative z-10">
      {/* Left: Why We Are Best */}
      <div>
        <h3 className="dashboard-heading text-2xl mb-3">Why We Are Best?</h3>
        <p className="dashboard-subheading mb-4 max-w-xs">At our platform, we provide a vast collection of premium digital subscriptions tailored to meet all your needs. Whatever you’re looking for, we’ve got you covered with quality, affordability, and reliability—all in one place! 🚀</p>
        <div className="flex gap-3 mt-4">
          <a href="#" className="bg-emerald-600 hover:bg-emerald-500 rounded-full p-2 transition" aria-label="Facebook"><FaFacebookF className="text-white text-xl" /></a>
          <a href="#" className="bg-emerald-600 hover:bg-emerald-500 rounded-full p-2 transition" aria-label="Twitter"><FaTwitter className="text-white text-xl" /></a>
          <a href="#" className="bg-emerald-600 hover:bg-emerald-500 rounded-full p-2 transition" aria-label="YouTube"><FaYoutube className="text-white text-xl" /></a>
          <a href="#" className="bg-emerald-600 hover:bg-emerald-500 rounded-full p-2 transition" aria-label="Instagram"><FaInstagram className="text-white text-xl" /></a>
        </div>
      </div>
      {/* Center: Best Selling */}
      <div>
        <h3 className="dashboard-heading text-xl mb-3">BEST SELLING</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-emerald-200 text-white transition">Home</a></li>
          <li><a href="#" className="hover:text-emerald-200 text-white transition">Categories <span className="ml-1">▼</span></a></li>
          <li><a href="#" className="hover:text-emerald-200 text-white transition">Shop</a></li>
          <li><a href="#" className="hover:text-emerald-200 text-white transition">Cart</a></li>
          <li><a href="#" className="hover:text-emerald-200 text-white transition">Contact Us</a></li>
          <li><a href="#" className="hover:text-emerald-200 text-white transition">My account</a></li>
        </ul>
      </div>
      {/* Right: Useful Links */}
      <div>
        <h3 className="dashboard-heading text-xl mb-3">USEFUL LINKS</h3>
        <ul className="space-y-2">
          <li><a href="/about" className="hover:text-emerald-200 text-white transition">About Us</a></li>
          <li><a href="/contact" className="hover:text-emerald-200 text-white transition">Contact Us</a></li>
          <li><a href="/disclaimer" className="hover:text-emerald-200 text-white transition">Disclaimer</a></li>
          <li><a href="/privacy-policy" className="hover:text-emerald-200 text-white transition">Privacy Policy</a></li>
          <li><a href="/refund-policy" className="hover:text-emerald-200 text-white transition">Refunds Policy</a></li>
          <li><a href="/terms-and-conditions" className="hover:text-emerald-200 text-white transition">Terms & Conditions</a></li>
        </ul>
      </div>
    </div>
    {/* Divider */}
    <div className="max-w-7xl mx-auto mt-10 mb-4 border-t border-white/20"></div>
    {/* Bottom bar */}
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/80 text-sm px-2">
      <div>©Copyright 2025 | <a href="#" className="hover:underline text-emerald-200">vyapaar360</a></div>
      {/* Buy Now + WhatsApp */}
      <div className="flex items-center gap-3">
        <a href="#" className="dashboard-button-primary px-4 py-2 text-sm">Buy Now</a>
        <a href="#" className="ml-1 bg-emerald-600 hover:bg-emerald-500 rounded-full p-2 transition" aria-label="WhatsApp">
          <FaWhatsapp className="text-white text-2xl" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer; 