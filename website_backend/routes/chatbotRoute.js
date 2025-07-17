const express = require('express');
const router = express.Router();

// FAQ Database - Can be moved to a separate file or database later
const faqDatabase = {
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

// Find the best response based on user input
const findResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for exact matches first
  for (const [category, data] of Object.entries(faqDatabase)) {
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
};

// Chatbot endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    // For now, use FAQ responses
    // This can be easily upgraded to AI integration later
    const response = findResponse(message);
    
    // Log conversation for analytics (optional)
    console.log('Chatbot Query:', {
      message,
      response: response.response,
      timestamp: new Date(),
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      response: response.response,
      type: response.type,
      category: response.category,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      response: 'Sorry, I\'m having trouble right now. Please try again or contact our support team.'
    });
  }
});

// Get quick questions
router.get('/quick-questions', (req, res) => {
  const quickQuestions = [
    'What subscriptions do you offer?',
    'How much do plans cost?',
    'What payment methods do you accept?',
    'How do I get support?',
    'Is it safe to use?',
    'How fast is delivery?'
  ];
  
  res.json({
    success: true,
    questions: quickQuestions
  });
});

// Future: AI Integration endpoint
router.post('/ai-chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    // TODO: Integrate with OpenAI or other AI service
    // Example structure:
    /*
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful customer service representative for Vyapaar360, a subscription service platform. Be friendly, professional, and helpful."
        },
        ...conversationHistory,
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150
    });

    const aiResponse = openaiResponse.choices[0].message.content;
    */

    // For now, fallback to FAQ
    const response = findResponse(message);
    
    res.json({
      success: true,
      response: response.response,
      type: 'ai_fallback',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('AI Chatbot Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'AI service temporarily unavailable',
      response: 'Sorry, our AI assistant is having trouble right now. Please try again or contact our support team.'
    });
  }
});

module.exports = router; 