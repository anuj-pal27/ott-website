import React, { useEffect, useState } from 'react';

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

const CategoryFilter = ({ selectedCategory, onCategoryChange, setCategories }) => {
  const [categories, localSetCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/plans/categories');
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          localSetCategories(data.categories);
          if (setCategories) setCategories(data.categories);
        } else {
          localSetCategories([]);
          if (setCategories) setCategories([]);
        }
      } catch (err) {
        localSetCategories([]);
        if (setCategories) setCategories([]);
      }
    };
    fetchCategories();
  }, [setCategories]);

  // Add 'All Services' option and map categories
  const allCategories = [
    {
      id: '',
      name: 'All Services',
      icon: '🌟'
    },
    ...categories.map(cat => ({
      id: cat,
      name: CATEGORY_ICON_MAP[cat]?.name || cat,
      icon: CATEGORY_ICON_MAP[cat]?.icon || '📦'
    }))
  ];

  // Filter out "All Services" on mobile devices
  const mobileCategories = categories.map(cat => ({
    id: cat,
    name: CATEGORY_ICON_MAP[cat]?.name || cat,
    icon: CATEGORY_ICON_MAP[cat]?.icon || '📦'
  }));

  return (
    <div className="mb-8">
      {/* Desktop view - shows "All Services" option */}
      <div className="hidden md:flex flex-wrap justify-center gap-3">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      
      {/* Mobile view - hides "All Services" option */}
      <div className="md:hidden flex flex-wrap justify-center gap-2">
        {mobileCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 text-sm ${
              selectedCategory === category.id
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
            }`}
          >
            <span className="text-base">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter; 