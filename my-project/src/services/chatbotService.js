// Chatbot Service - Can be easily upgraded to AI integration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api';

class ChatbotService {
  constructor() {
    this.faqDatabase = {
      'subscription': {
        keywords: ['subscription', 'subscriptions', 'plan', 'plans', 'package', 'packages', 'service', 'services', 'offerings', 'available'],
        response: 'We offer a wide range of digital services and subscriptions, including software, websites, tools, and more. Browse our dashboard to see all available options!'
      },
      'category': {
        keywords: ['category', 'categories', 'type', 'section', 'filter', 'filters'],
        response: 'You can explore our services by category, such as AI Tools, Graphics & Video, Writing Tools, Productivity, Marketing, Data Extractor, Dating, Entertainment, Streaming, Software, Websites, Tools, Music, and more. Use the filters on our dashboard!'
      },
      'price': {
        keywords: ['price', 'cost', 'fee', 'pricing', 'how much', 'rate', 'charges', 'amount'],
        response: 'Our prices start from just ₹99. Each service or subscription has its own pricing and duration options. Check the dashboard for details!'
      },
      'payment': {
        keywords: ['payment', 'pay', 'payments', 'card', 'upi', 'phonepe', 'gpay', 'google pay', 'net banking', 'bank transfer', 'credit card', 'debit card', 'checkout', 'transaction'],
        response: 'We accept UPI, PhonePe, Google Pay, credit/debit cards, and net banking. All payments are secure and encrypted. Use the checkout page to pay easily!'
      },
      'support': {
        keywords: ['support', 'help', 'issue', 'problem', 'contact', 'assist', 'trouble', 'customer care', 'service desk'],
        response: 'Need help? Our support team is available 24/7 via WhatsApp (+91 9353690229), email (Gowtham@vyapaar360.in), or this chat. We respond quickly!'
      },
      'refund': {
        keywords: ['refund', 'return', 'cancel', 'money back', 'replacement', 'not working', 'cancel order', 'refund policy'],
        response: 'We offer a 7-day money-back guarantee if you are not satisfied. For technical issues, we provide immediate replacements. Contact support for any refund or cancellation requests.'
      },
      'setup': {
        keywords: ['setup', 'install', 'installation', 'how to', 'guide', 'instructions', 'activate', 'activation', 'login', 'access'],
        response: 'After payment, you will receive setup instructions and login credentials within 30 minutes. Just follow the steps provided. Need help? Contact support!'
      },
      'security': {
        keywords: ['security', 'safe', 'trust', 'trusted', 'legit', 'real', 'fake', 'scam', 'secure', 'privacy'],
        response: 'We are a trusted platform with thousands of happy customers. All payments and data are secure and encrypted. Your privacy is our priority.'
      },
      'delivery': {
        keywords: ['delivery', 'deliver', 'time', 'when', 'how long', 'instant', 'fast', 'receive', 'receiving', 'access time'],
        response: 'We deliver all digital services via WhatsApp or SMS to your registered number, usually within 30 minutes of payment. You will be notified as soon as your order is ready!'
      },
      'multiple': {
        keywords: ['multiple', 'many', 'several', 'more than one', 'family', 'friends', 'bulk', 'group'],
        response: 'Yes, you can purchase multiple services or subscriptions. We offer group and family plans, as well as bulk discounts. Contact us for special pricing!'
      }
    };
  }

  // Fetch categories from backend
  async fetchCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/plans/categories`);
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        return data.categories;
      }
      return [];
    } catch (err) {
      return [];
    }
  }

  // Find the best response based on user input
  async findResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for category-related queries
    if (['category', 'categories', 'type', 'section', 'filter'].some(word => lowerMessage.includes(word))) {
      const categories = await this.fetchCategories();
      if (categories.length > 0) {
        return {
          type: 'categories',
          response: `We currently offer services in these categories: ${categories.join(', ')}. You can use the filters on our dashboard to explore each category.`
        };
      } else {
        return {
          type: 'categories',
          response: 'Sorry, I could not fetch the categories right now. Please check the dashboard for the latest categories.'
        };
      }
    }
    
    // Check for exact matches first
    for (const [category, data] of Object.entries(this.faqDatabase)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return {
          type: 'faq',
          response: data.response,
          category: category
        };
      }
    }
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        type: 'greeting',
        response: 'Hello! 👋 How can I help you today? You can ask about our subscriptions, pricing, payment methods, or any other questions!'
      };
    }
    
    // Check for thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return {
        type: 'thanks',
        response: 'You\'re welcome! 😊 Is there anything else I can help you with?'
      };
    }
    
    // Default response
    return {
      type: 'unknown',
      response: 'I\'m not sure about that. Would you like to speak with our human support team? You can contact us on WhatsApp at +91 9353690229 or email us at sales@vyapaar360.in'
    };
  }

  // Get quick questions for the chatbot
  getQuickQuestions() {
    return [
      'What subscriptions do you offer?',
      'What categories do you have?',
      'How much do plans cost?',
      'What payment methods do you accept?',
      'How do I get support?',
      'Is it safe to use?',
      'How fast is delivery?'
    ];
  }
}

export default new ChatbotService(); 