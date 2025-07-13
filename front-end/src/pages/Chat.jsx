import React, { useState, useRef, useEffect } from 'react';
// import anime from 'animejs';
import Header from '../components/Header';
import useAI from '../hooks/useAI';
import { selectChatBot, setMessage, setOldMessages } from '../reducers/chatBotReducer';
import { useDispatch, useSelector } from 'react-redux';

const Chat = () => {
  const chatBotState = useSelector(selectChatBot) || {}; // تفادي undefined
  const dispatch = useDispatch();
  const { SendPromtToAi } = useAI();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // تحميل الرسائل القديمة من Redux
  useEffect(() => {
    if (chatBotState.oldMessages?.length) {
      setMessages([...chatBotState.oldMessages]);
    }
  }, [chatBotState.oldMessages]);

  // تمرير تلقائي للأسفل بعد إضافة رسالة
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // عندما يصل رد من AI، نضيفه للمحادثة
  useEffect(() => {
    if (chatBotState.response) {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: chatBotState.response,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, aiResponse]);
      dispatch(setOldMessages({ messages: [...messages, aiResponse] }));
      dispatch(setMessage({ message: "" }));
      setIsTyping(false);
    }
  }, [chatBotState.response]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);
    SendPromtToAi(newMessage, "chatPromt");
  };

  const quickQuestions = [
    "How do I start a workout routine?",
    "What should I eat before working out?",
    "How many days should I exercise?",
    "What's the best way to build muscle?",
    "How do I lose weight effectively?"
  ];

  // Animation effects
  useEffect(() => {
    // Set initial opacity for scroll-triggered elements
    document.querySelectorAll('.chat-container, .feature-box').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
    });

    // Page title animation
    setTimeout(() => {
      document.querySelectorAll('.chat-hero-title').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 100);

    setTimeout(() => {
      document.querySelectorAll('.chat-hero-subtitle').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 300);

    // Scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (target.classList.contains('chat-container') || 
              target.classList.contains('feature-box')) {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }
          
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.chat-container, .feature-box').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Animation for new messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = document.querySelector('.message-item:last-child');
      if (lastMessage) {
        lastMessage.style.opacity = '1';
        lastMessage.style.transform = 'translateY(0)';
      }
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />

      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="chat-hero-title text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
              AI Fitness Coach
            </h1>
            <p className="chat-hero-subtitle text-xl text-gray-300 max-w-2xl mx-auto">
              Chat with your personalized AI fitness coach for workout plans, nutrition advice, and motivation.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="chat-container bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl h-[600px] flex flex-col">

              <div className="p-6 border-b border-gray-700/50 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Fitness Coach</h3>
                  <p className="text-gray-400 text-sm">Online • Ready to help</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-item flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-700/50 text-gray-100 border border-gray-600/30'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700/50 text-gray-100 border border-gray-600/30 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm text-gray-400">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {messages.length === 1 && (
                <div className="p-6 border-t border-gray-700/50">
                  <p className="text-gray-300 text-sm mb-3">Quick questions you can ask:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(question)}
                        className="px-4 py-2 bg-gray-700/50 text-gray-300 text-sm rounded-lg hover:bg-gray-600/50 hover:text-white transition-all duration-300 border border-gray-600/30 hover:border-red-500/30"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 border-t border-gray-700/50">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me about workouts, nutrition, or fitness advice..."
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 pr-12"
                      disabled={isTyping}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            {/* Feature Boxes */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {/* Boxes for Personalization */}
              <div className="feature-box bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">💪</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Personalized Workouts</h3>
                <p className="text-gray-300 text-sm">Get custom workout plans tailored to your fitness level and goals</p>
              </div>
              <div className="feature-box bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">🥗</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Nutrition Guidance</h3>
                <p className="text-gray-300 text-sm">Receive expert advice on diet, meal planning, and supplements</p>
              </div>
              <div className="feature-box bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">📊</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Progress Tracking</h3>
                <p className="text-gray-300 text-sm">Monitor your fitness journey with detailed analytics and insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
