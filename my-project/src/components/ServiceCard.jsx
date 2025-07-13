import React from 'react';

const ServiceCard = ({
  serviceName,
  iconImage,
  price,
  originalPrice,
  rating = 5.0,
  ratingCount = 0,
  onAddToCart,
  description
}) => (
  <div className="bg-white rounded-2xl border-2 border-primary-200 shadow-md flex flex-col items-center p-4 transition hover:shadow-xl hover:-translate-y-1 duration-200 min-w-[250px] max-w-xs mx-auto">
    <img
      src={iconImage}
      alt={serviceName}
      className="w-32 h-32 object-contain rounded-xl mb-4 bg-gray-100"
    />
    <div className="w-full flex-1 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-1 text-center">{serviceName}</h3>
        {description && <p className="text-xs text-gray-500 text-center mb-2 line-clamp-2">{description}</p>}
      </div>
      <div className="flex items-center justify-between w-full mt-2 mb-2">
        <span className="flex items-center text-yellow-500 text-sm font-medium">
          <span className="mr-1">★</span>{rating} <span className="ml-1 text-gray-400">({ratingCount})</span>
        </span>
        <span className="text-right">
          {originalPrice && originalPrice > price && (
            <span className="text-gray-400 line-through text-sm mr-1">₹{originalPrice}</span>
          )}
          <span className="text-primary-600 font-bold">₹{price}</span>
        </span>
      </div>
      <button
        className="w-full mt-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow hover:shadow-md"
        onClick={onAddToCart}
      >
        Add to Cart <span className="ml-1">🛒</span>
      </button>
    </div>
  </div>
);

export default ServiceCard; 