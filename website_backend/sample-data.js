// Sample data for testing the new subscription plan structure
// You can use this to populate your database with test data

const sampleSubscriptionPlans = [
  {
    serviceName: "Netflix Premium",
    description: "Premium 4K+UHD streaming service with unlimited movies and TV shows",
    price: 1.55, // This will be the base price, individual durations have their own prices
    durationInDays: 30, // Base duration in days
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
    planType: "premium",
    originalPrice: 2.00,
    slotsAvailable: 15,
    totalSlots: 15,
    features: [
      "Premium 4K+UHD Quality",
      "Warranted Service",
      "Supports TV, Laptop, Mobile",
      "Unlimited Streaming",
      "Ad-Free Experience"
    ],
    iconImage: "https://picsum.photos/300/200?random=1",
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    isActive: true
  },
  {
    serviceName: "Amazon Prime",
    description: "Premium streaming service with fast delivery and exclusive content",
    price: 1.99,
    durationInDays: 30,
    durations: [
      {
        duration: "1 Month",
        description: "Prime Video + Fast Delivery",
        price: 1.99,
        originalPrice: 2.50,
        slotsAvailable: 8,
        totalSlots: 8,
        isActive: true
      },
      {
        duration: "3 Months",
        description: "Prime Video + Fast Delivery + Music",
        price: 5.99,
        originalPrice: 7.50,
        slotsAvailable: 6,
        totalSlots: 6,
        isActive: true
      },
      {
        duration: "1 Year",
        description: "Complete Prime Experience",
        price: 19.99,
        originalPrice: 30.00,
        slotsAvailable: 3,
        totalSlots: 3,
        isActive: true
      }
    ],
    planType: "premium",
    originalPrice: 2.50,
    slotsAvailable: 17,
    totalSlots: 17,
    features: [
      "Prime Video Streaming",
      "Fast Free Delivery",
      "Prime Music Access",
      "Exclusive Deals",
      "Photo Storage"
    ],
    iconImage: "https://picsum.photos/300/200?random=2",
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    serviceName: "YouTube Premium",
    description: "Ad-free YouTube experience with background play and YouTube Music",
    price: 2.49,
    durationInDays: 30,
    durations: [
      {
        duration: "1 Month",
        description: "Ad-Free YouTube + Background Play",
        price: 2.49,
        originalPrice: 3.00,
        slotsAvailable: 12,
        totalSlots: 12,
        isActive: true
      },
      {
        duration: "6 Months",
        description: "Ad-Free YouTube + Music Premium",
        price: 14.99,
        originalPrice: 18.00,
        slotsAvailable: 7,
        totalSlots: 7,
        isActive: true
      },
      {
        duration: "1 Year",
        description: "Complete Premium Experience",
        price: 29.99,
        originalPrice: 36.00,
        slotsAvailable: 4,
        totalSlots: 4,
        isActive: true
      }
    ],
    planType: "premium",
    originalPrice: 3.00,
    slotsAvailable: 23,
    totalSlots: 23,
    features: [
      "Ad-Free YouTube",
      "Background Play",
      "YouTube Music Premium",
      "Offline Downloads",
      "Premium Content"
    ],
    iconImage: "https://picsum.photos/300/200?random=3",
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

module.exports = { sampleSubscriptionPlans }; 