// Chatbot Service - Can be easily upgraded to AI integration
class ChatbotService {
  constructor() {
    this.faqDatabase = {
      'subscription': {
        keywords: ['subscription', 'plan', 'package', 'service', 'netflix', 'prime', 'youtube', 'spotify', 'disney'],
        response: 'We offer various subscription plans including Netflix, Amazon Prime, YouTube Premium, Spotify, Disney+, and more. All plans are shared accounts at affordable prices. Would you like to see our current offerings?'
      },
      'price': {
        keywords: ['price', 'cost', 'fee', 'payment', 'money', 'cheap', 'expensive', 'how much'],
        response: 'Our subscription prices start from ₹99/month. Each plan offers different durations (1 month, 3 months, 6 months, 1 year) with discounts for longer commitments. Check our dashboard for current pricing!'
      },
      'payment': {
        keywords: ['payment', 'pay', 'card', 'upi', 'phonepe', 'gpay', 'bank', 'transfer'],
        response: 'We accept all major payment methods including UPI, PhonePe, Google Pay, credit/debit cards, and net banking. All payments are secure and encrypted. You can also pay via PhonePe integration on our checkout page.'
      },
      'support': {
        keywords: ['support', 'help', 'issue', 'problem', 'contact', 'assist', 'trouble'],
        response: 'Our support team is available 24/7! You can contact us via WhatsApp at +91 93536 90229, email at support@vyapaar360.com, or use this chat. We typically respond within 5 minutes.'
      },
      'refund': {
        keywords: ['refund', 'return', 'cancel', 'money back', 'replacement', 'not working'],
        response: 'We offer a 7-day money-back guarantee if you\'re not satisfied. For technical issues, we provide immediate replacements. Contact our support team for any refund requests.'
      },
      'setup': {
        keywords: ['setup', 'install', 'how to', 'guide', 'instructions', 'activate', 'login'],
        response: 'Setup is super easy! After payment, you\'ll receive login credentials within 5 minutes. Just use the provided username/password to access your subscription. Need help? We\'re here!'
      },
      'security': {
        keywords: ['security', 'safe', 'trust', 'legit', 'real', 'fake', 'scam'],
        response: 'We are a trusted platform with 50,000+ satisfied customers. All payments are secure, and we use industry-standard encryption. We\'re verified and trusted by thousands of users.'
      },
      'delivery': {
        keywords: ['delivery', 'time', 'when', 'how long', 'instant', 'fast'],
        response: 'We provide instant delivery! You\'ll receive your login credentials within 5 minutes of payment confirmation. No waiting, no delays - instant access to your subscriptions.'
      },
      'multiple': {
        keywords: ['multiple', 'many', 'several', 'more than one', 'family', 'friends'],
        response: 'Yes! You can purchase multiple subscriptions. We offer family plans and bulk discounts for multiple accounts. Contact us for special pricing on multiple subscriptions.'
      }
    };
  }

  // Find the best response based on user input
  findResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
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
      response: 'I\'m not sure about that. Would you like to speak with our human support team? You can contact us on WhatsApp at +91 93536 90229 or email us at support@vyapaar360.com'
    };
  }

  // Get quick questions for the chatbot
  getQuickQuestions() {
    return [
      'What subscriptions do you offer?',
      'How much do plans cost?',
      'What payment methods do you accept?',
      'How do I get support?',
      'Is it safe to use?',
      'How fast is delivery?'
    ];
  }

  // Future: AI Integration method
  async getAIResponse(userMessage, conversationHistory = []) {
    // This can be easily upgraded to use OpenAI or other AI services
    // For now, it falls back to FAQ responses
    
    // Example AI integration structure:
    /*
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: conversationHistory,
          context: 'subscription_services'
        })
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      // Fallback to FAQ
      return this.findResponse(userMessage).response;
    }
    */
    
    return this.findResponse(userMessage).response;
  }
}

export default new ChatbotService(); 