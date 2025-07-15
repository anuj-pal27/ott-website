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
  const [selectedDuration, setSelectedDuration] = useState(0); // Index of selected duration

  const handleImageError = () => {
    console.error('Image failed to load:', plan.iconImage);
    setImageError(true);
  };

  // Debug logging
  console.log('ServiceCard plan data:', plan);
  console.log('Icon image URL:', plan.iconImage);

  // Get the selected duration object
  const selectedDurationObj = plan.durations && plan.durations[selectedDuration] 
    ? plan.durations[selectedDuration] 
    : null;

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
          
          {/* Duration Options */}
          {plan.durations && plan.durations.length > 0 && (
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Duration:</label>
              <div className="space-y-2">
                {plan.durations.map((duration, idx) => (
                  <div 
                    key={idx} 
                    className={`border rounded-lg p-2 cursor-pointer transition-all ${
                      selectedDuration === idx 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedDuration(idx)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{duration.duration}</div>
                        <div className="text-xs text-gray-600">{duration.description}</div>
                      </div>
                      <div className="text-right">
                        {duration.originalPrice && duration.originalPrice !== duration.price && (
                          <div className="line-through text-gray-400 text-xs">₹{duration.originalPrice}</div>
                        )}
                        <div className="font-bold text-primary text-sm">₹{duration.price}</div>
                      </div>
                    </div>
                    {duration.slotsAvailable !== undefined && (
                      <div className="text-xs text-gray-500 mt-1">
                        {duration.slotsAvailable > 0 ? (
                          <span className="text-green-600">In Stock ({duration.slotsAvailable} available)</span>
                        ) : (
                          <span className="text-red-600">Out of Stock</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
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
          
          <div className="text-xs text-gray-500 mb-2">
            Duration: {plan.durationInDays} days
          </div>
        </div>
        {showCartButton && selectedDurationObj && (
          <button
            className="w-full mt-2 bg-primary hover:bg-secondary text-white py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
            onClick={() => onAddToCart({ ...plan, selectedDuration: selectedDurationObj })}
            disabled={selectedDurationObj.slotsAvailable === 0}
          >
            {selectedDurationObj.slotsAvailable === 0 ? 'Out of Stock' : 'Add to Cart'} 
            <span className='text-base ml-[10px] '> <FaCartPlus /></span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard; 