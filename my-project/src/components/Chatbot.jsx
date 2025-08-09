import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import chatbotService from '../services/chatbotService';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage('Hi! 👋 I\'m your Vyapaar360 assistant. How can I help you today? You can ask about our subscriptions, pricing, payment methods, or any other questions!');
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { type: 'bot', text, timestamp: new Date() }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    addUserMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);

    // Get response from service (await the async function)
    const response = await chatbotService.findResponse(userMessage);
    // Simulate typing delay
    setTimeout(() => {
      addBotMessage(response.response);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = '9353690229';
    const message = 'Hello! I need help with my subscription. Can you assist me?';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const quickQuestions = chatbotService.getQuickQuestions();

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-gradient-to-r from-primary to-secondary text-white p-3 md:p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-label="Open chatbot"
          title="Chat with us"
        >
          {isOpen ? <FaTimes className="text-xl md:text-2xl" /> : <FaRobot className="text-xl md:text-2xl" />}
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed inset-4 md:bottom-24 md:left-6 md:w-96 md:h-[500px] md:inset-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 z-50 flex flex-col max-h-[calc(100vh-2rem)] md:max-h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-3 md:p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <FaRobot className="text-xl md:text-2xl" />
              <div>
                <h3 className="font-bold text-base md:text-lg">Vyapaar360 Assistant</h3>
                <p className="text-xs md:text-sm opacity-90">Online • Usually responds instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <FaTimes className="text-lg md:text-xl" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-xs md:text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-2 md:p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - always show unless bot is typing */}
          {!isTyping && (
            <div className="px-3 md:px-4 pb-2">
              <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1">
                {quickQuestions.slice(0, 4).map((question, index) => (
                  <button
                    key={index}
                    onClick={async () => {
                      addUserMessage(question);
                      setInputMessage('');
                      setIsTyping(true);
                      const botResponseObj = await chatbotService.findResponse(question);
                      setTimeout(() => {
                        addBotMessage(botResponseObj.response);
                        setIsTyping(false);
                      }, 1000);
                    }}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors max-w-[48%] md:max-w-[45%] truncate"
                    title={question}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 md:p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full p-2 md:p-3 pr-10 md:pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                  rows="1"
                  style={{ minHeight: '40px', maxHeight: '100px' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1.5 md:p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="text-xs md:text-sm" />
                </button>
              </div>
            </div>
            
            {/* Human Support Button */}
            <div className="mt-2 md:mt-3 text-center">
              <button
                onClick={openWhatsApp}
                className="inline-flex items-center gap-1 md:gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-colors"
              >
                <FaWhatsapp className="text-xs md:text-sm" />
                Talk to Human
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 