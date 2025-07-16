import React, { useState } from 'react';
import { FaCartPlus } from "react-icons/fa";

/*
Example of how the new durations structure should be used:

const netflixPlan = {
  serviceName: "Netflix Premium",
  description: "Premium 4K+UHD streaming service",
  iconImage: "https://example.com/netflix-logo.jpg",
  durations: [
    {
      duration: "1 Month",
      description: "1 Screen Login with Full Guarantee",
      price: 1.55,
      originalPrice: 2.00,
      slotsAvailable: 10,
      totalSlots: 10,
      isActive: true
    },
    {
      duration: "6 Months", 
      description: "2 Screen Login with Full Guarantee",
      price: 9.29,
      originalPrice: 12.00,
      slotsAvailable: 5,
      totalSlots: 5,
      isActive: true
    },
    {
      duration: "1 Year",
      description: "Unlimited Screen Login with Full Guarantee", 
      price: 59.99,
      originalPrice: 72.00,
      slotsAvailable: 0,
      totalSlots: 0,
      isActive: false
    }
  ],
  features: ["Premium 4K+UHD", "Warranted", "Supports TV, Laptop, Mobile"],
  // ... other fields
};
*/

const ServiceCard = ({ plan, onAddToCart, showCartButton = true }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error('Image failed to load:', plan.iconImage);
    setImageError(true);
  };

  // Calculate price range from durations
  const calculatePriceRange = () => {
    if (!plan.durations || plan.durations.length === 0) {
      return { min: 0, max: 0, hasDiscount: false };
    }

    const activeDurations = plan.durations.filter(d => d.isActive);
    if (activeDurations.length === 0) {
      return { min: 0, max: 0, hasDiscount: false };
    }

    const prices = activeDurations.map(d => d.price);
    const originalPrices = activeDurations.map(d => d.originalPrice);
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minOriginalPrice = Math.min(...originalPrices);
    const maxOriginalPrice = Math.max(...originalPrices);
    
    const hasDiscount = minOriginalPrice > minPrice || maxOriginalPrice > maxPrice;
    
    return {
      min: minPrice,
      max: maxPrice,
      minOriginal: minOriginalPrice,
      maxOriginal: maxOriginalPrice,
      hasDiscount
    };
  };

  // Check if any duration is in stock
  const hasStock = () => {
    if (!plan.durations || plan.durations.length === 0) return false;
    return plan.durations.some(d => d.isActive && d.slotsAvailable > 0);
  };

  const priceRange = calculatePriceRange();
  const inStock = hasStock();

  const handleAddToCart = () => {
    // Pass the plan with all durations to let the parent component handle selection
    onAddToCart(plan);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-primary/30 shadow-lg p-4 flex flex-col items-center transition-transform duration-200 hover:scale-105 max-w-xs w-full mx-auto">
      <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-xl mb-4 overflow-hidden">
        {plan.iconImage && !imageError ? (
          <img 
            src={plan.iconImage} 
            alt={plan.serviceName || 'Service'} 
            className="object-contain w-full h-full"
            onError={handleImageError}
            onLoad={() => console.log('Image loaded successfully:', plan.iconImage)}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-4xl font-bold text-primary">
              {plan.serviceName ? plan.serviceName.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">{plan.serviceName}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{plan.description}</p>
          <div className="flex items-center gap-2 text-sm mb-2">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">5.0</span>
            <span className="text-gray-500">(0)</span>
          </div>
          
          {/* Price Range Display */}
          {plan.durations && plan.durations.length > 0 && (
            <div className="mb-3">
              <div className="text-center">
                {priceRange.hasDiscount && (
                  <div className="text-xs text-gray-400 line-through mb-1">
                    ₹{priceRange.minOriginal} - ₹{priceRange.maxOriginal}
                  </div>
                )}
                <div className="font-bold text-primary text-lg">
                  ₹{priceRange.min} - ₹{priceRange.max}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {plan.durations.length} duration options available
                </div>
              </div>
            </div>
          )}
          
          {/* Fallback for old format */}
          {(!plan.durations || plan.durations.length === 0) && (
            <div className="flex items-center gap-2 mb-2">
              {plan.originalPrice && plan.originalPrice !== plan.price && (
                <span className="line-through text-gray-400 text-sm">₹{plan.originalPrice}</span>
              )}
              <span className="font-bold text-primary text-lg">₹{plan.price}</span>
            </div>
          )}
          
          {/* Features Preview */}
          {plan.features && plan.features.length > 0 && (
            <div className="mb-2">
              <div className="text-xs text-gray-600">
                {plan.features.slice(0, 2).join(' • ')}
                {plan.features.length > 2 && ' • ...'}
              </div>
            </div>
          )}
        </div>
        
        {/* Add to Cart Button */}
        {showCartButton && (
          <button
            className={`w-full mt-2 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              inStock 
                ? 'bg-primary hover:bg-secondary text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'} 
            <span className='text-base ml-[10px] '> <FaCartPlus /></span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard; 