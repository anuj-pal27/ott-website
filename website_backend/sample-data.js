// Sample data for testing the new subscription plan structure
// You can use this to populate your database with test data

const mongoose = require('mongoose');
const SubscriptionPlan = require('./models/SubscriptionPlan');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/platform_website';

const sampleSubscriptionPlans = [
  {
    serviceName: "Netflix Premium",
    description: "Premium 4K+UHD streaming service with unlimited movies and TV shows",
    durations: [
      {
        duration: "1 Month",
        description: "1 Screen Login with Full Guarantee",
        price: 1.55,
        originalPrice: 2.00,
        slotsAvailable: 10,
        totalSlots: 10,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      {
        duration: "6 Months",
        description: "2 Screen Login with Full Guarantee",
        price: 9.29,
        originalPrice: 12.00,
        slotsAvailable: 5,
        totalSlots: 5,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 180 days
      },
      {
        duration: "1 Year",
        description: "Unlimited Screen Login with Full Guarantee",
        price: 59.99,
        originalPrice: 72.00,
        slotsAvailable: 0,
        totalSlots: 0,
        isActive: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 365 days
      }
    ],
    planType: "premium",
    features: [
      "Premium 4K+UHD Quality",
      "Warranted Service",
      "Supports TV, Laptop, Mobile",
      "Unlimited Streaming",
      "Ad-Free Experience"
    ],
    iconImage: "https://picsum.photos/300/200?random=1",
    isActive: true
  },
  {
    serviceName: "Amazon Prime",
    description: "Premium streaming service with fast delivery and exclusive content",
    durations: [
      {
        duration: "1 Month",
        description: "Prime Video + Fast Delivery",
        price: 1.99,
        originalPrice: 2.50,
        slotsAvailable: 8,
        totalSlots: 8,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        duration: "3 Months",
        description: "Prime Video + Fast Delivery + Music",
        price: 5.99,
        originalPrice: 7.50,
        slotsAvailable: 6,
        totalSlots: 6,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      {
        duration: "1 Year",
        description: "Complete Prime Experience",
        price: 19.99,
        originalPrice: 30.00,
        slotsAvailable: 3,
        totalSlots: 3,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    ],
    planType: "premium",
    features: [
      "Prime Video Streaming",
      "Fast Free Delivery",
      "Prime Music Access",
      "Exclusive Deals",
      "Photo Storage"
    ],
    iconImage: "https://picsum.photos/300/200?random=2",
    isActive: true
  },
  {
    serviceName: "YouTube Premium",
    description: "Ad-free YouTube experience with background play and YouTube Music",
    durations: [
      {
        duration: "1 Month",
        description: "Ad-Free YouTube + Background Play",
        price: 2.49,
        originalPrice: 3.00,
        slotsAvailable: 12,
        totalSlots: 12,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        duration: "6 Months",
        description: "Ad-Free YouTube + Music Premium",
        price: 14.99,
        originalPrice: 18.00,
        slotsAvailable: 7,
        totalSlots: 7,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      },
      {
        duration: "1 Year",
        description: "Complete Premium Experience",
        price: 29.99,
        originalPrice: 36.00,
        slotsAvailable: 4,
        totalSlots: 4,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    ],
    planType: "premium",
    features: [
      "Ad-Free YouTube",
      "Background Play",
      "YouTube Music Premium",
      "Offline Downloads",
      "Premium Content"
    ],
    iconImage: "https://picsum.photos/300/200?random=3",
    isActive: true
  }
];

async function main() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    await SubscriptionPlan.deleteMany({});
    await SubscriptionPlan.insertMany(sampleSubscriptionPlans);
    console.log('Sample subscription plans inserted successfully!');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

if (require.main === module) {
  main();
} 