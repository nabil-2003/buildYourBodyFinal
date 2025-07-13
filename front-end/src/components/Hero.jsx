import React, { useState, useRef, useEffect } from 'react';
// import anime from 'animejs';
import body from "../assets/body.png"

const Hero = ({ hideBackground = false }) => {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Animation effects
  useEffect(() => {
    // Set initial opacity for scroll-triggered elements
    document.querySelectorAll('.service, .contact-form, .contact-info').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
    });

    // Simple CSS animations using setTimeout
    setTimeout(() => {
      document.querySelectorAll('.hero-title').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 100);

    setTimeout(() => {
      document.querySelectorAll('.hero-subtitle').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 300);

    setTimeout(() => {
      document.querySelectorAll('.hero-buttons').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 500);

    // Floating stats animation
    const floatingStats = document.querySelectorAll('.floating-stat');
    floatingStats.forEach((stat, index) => {
      setInterval(() => {
        stat.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          stat.style.transform = 'translateY(0)';
        }, 1000);
      }, 2000 + index * 200);
    });

    // Scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (target.classList.contains('service') || 
              target.classList.contains('contact-form') || 
              target.classList.contains('contact-info')) {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }
          
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.service, .contact-form, .contact-info').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Get form data
      const formData = new FormData(formRef.current);
      const name = formData.get('user_name');
      const lastname = formData.get('user_lastname');
      const email = formData.get('user_email');
      const phone = formData.get('user_phone');
      const message = formData.get('message');

      // Create email content
      const emailContent = `
New Contact Form Submission from BuildYourBody

Name: ${name} ${lastname}
Email: ${email}
Phone: ${phone}
Message: ${message}

Submitted on: ${new Date().toLocaleString()}
      `;

      // Use mailto method
      const mailtoLink = `mailto:filalinabil026@gmail.com?subject=New Contact Form Submission - BuildYourBody&body=${encodeURIComponent(emailContent)}`;
      window.open(mailtoLink);

      setSubmitStatus('success');
      formRef.current.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };



  
  return (
    <section className={`min-h-screen w-full relative overflow-hidden ${
      hideBackground ? '' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 pt-20 md:pt-32 pb-16 px-4 sm:px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh] lg:min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-4 lg:space-y-6">
              <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Build Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  DREAM BODY
                </span><br />
                With AI Power
              </h1>
              
              <p className="hero-subtitle text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0">
                "Transform your fitness journey with our AI-powered assistant. Get personalized workout 
                programs, expert training videos, and smart recommendations tailored to your goals. 
                Ready to build your dream body?"
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
               
                className="bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25 text-sm sm:text-base"
              >
              
              </button>
              <button 
           
                className="border-2 border-orange-500 text-orange-500 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
              >
               
              </button>
            </div>
          </div>

          {/* Right Content - Enhanced Image and Stats */}
          <div className="relative h-80 sm:h-96 md:h-[500px] lg:h-full w-full mt-8 lg:mt-0">
            <img src={body} alt="Fitness Body" className="absolute w-full h-full object-contain" />
            {/* Main Image Area */}
            <div className="relative w-full h-full">
              
              {/* Enhanced Floating Stats */}
              <div className="floating-stat absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gray-800/95 backdrop-blur-lg border border-yellow-500/30 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="text-yellow-400 text-lg sm:text-2xl font-bold">AI</div>
                  <div className="text-gray-300 text-xs sm:text-sm font-medium">Coach</div>
                </div>
              </div>
              
              <div className="floating-stat absolute top-1/4 -left-4 sm:-left-8 bg-gray-800/95 backdrop-blur-lg border border-orange-500/30 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="text-orange-400 text-lg sm:text-2xl font-bold">200+</div>
                  <div className="text-gray-300 text-xs sm:text-sm font-medium">Training Videos</div>
                </div>
              </div>
              
              <div className="floating-stat absolute bottom-1/4 -left-4 sm:-left-8 bg-gray-800/95 backdrop-blur-lg border border-red-500/30 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="text-red-400 text-lg sm:text-2xl font-bold">24/7</div>
                  <div className="text-gray-300 text-xs sm:text-sm font-medium">AI Support</div>
                </div>
              </div>
              
              <div className="floating-stat absolute bottom-2 -right-2 sm:bottom-4 sm:-right-4 bg-gray-800/95 backdrop-blur-lg border border-green-500/30 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <div className="text-green-400 text-lg sm:text-2xl font-bold">100%</div>
                  <div className="text-gray-300 text-xs sm:text-sm font-medium">Personalized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Services Section */}
        <div className="mt-16 lg:mt-24">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 font-bold mb-12 lg:mb-16">
            Our Features 
          </div>
          <div className="services mx-4 sm:mx-6 lg:mx-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            <div className="service">
              <div className="bg-gray-800/95 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 h-full">
                <h3 className="text-white text-lg lg:text-xl font-semibold mb-2">Training Routes</h3>
                <p className="text-gray-300 text-sm lg:text-base">Personalized workout paths designed to guide you to your fitness goals.</p>
              </div>
            </div>
            
            <div className="service">
              <div className="bg-gray-800/95 backdrop-blur-lg border border-orange-500/30 rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 h-full">
                <h3 className="text-white text-lg lg:text-xl font-semibold mb-2">Training Videos</h3>
                <p className="text-gray-300 text-sm lg:text-base">Comprehensive video library showing proper form and technique for every exercise.</p>
              </div>
            </div>
            
            <div className="service">
              <div className="bg-gray-800/95 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 h-full">
                <h3 className="text-white text-lg lg:text-xl font-semibold mb-2">AI Coach</h3>
                <p className="text-gray-300 text-sm lg:text-base">Smart AI coaching that provides real-time guidance and motivation during workouts.</p>
              </div>
            </div>
            
            <div className="service">
              <div className="bg-gray-800/95 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 h-full">
                <h3 className="text-white text-lg lg:text-xl font-semibold mb-2">Calories Calculator</h3>
                <p className="text-gray-300 text-sm lg:text-base">Calculate your daily caloric needs based on your goals and activity level.</p>
              </div>
            </div>
            
            <div className="service">
              <div className="bg-gray-800/95 backdrop-blur-lg border border-purple-500/30 rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 h-full">
                <h3 className="text-white text-lg lg:text-xl font-semibold mb-2">BMI Calculator</h3>
                <p className="text-gray-300 text-sm lg:text-base">Check your Body Mass Index and understand your current health status.</p>
              </div>
            </div>
            
            <div className="service">
              <div className="bg-gray-800/95 backdrop-blur-lg border border-blue-500/30 rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 h-full">
                <h3 className="text-white text-lg lg:text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-gray-300 text-sm lg:text-base">Monitor your fitness journey and track improvements with detailed analytics.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="mt-16 lg:mt-24">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 font-bold mb-12 lg:mb-16">
            Get In Touch
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mx-4 sm:mx-6 lg:mx-10">
            {/* Contact Information */}
            <div className="contact-info space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-white">Ready to Transform Your Life?</h3>
                <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                  Take the first step towards achieving your fitness goals. Our team of expert trainers is here to guide you every step of the way.
                </p>
              </div>
              
              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center border border-red-500/30">
                    <span className="text-red-400 text-xl">📧</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-300">filalinabil026@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center border border-orange-500/30">
                    <span className="text-orange-400 text-xl">📞</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Contact</p>
                    <p className="text-gray-300">Available via email & GitHub</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
                    <span className="text-yellow-400 text-xl">📍</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Location</p>
                    <p className="text-gray-300">Building from our Learning Lab</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="contact-form bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-2xl p-6 lg:p-8">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {submitStatus === 'success' && (
                  <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 text-green-400 text-center">
                    ✅ Email client opened! Please send the email to complete your message.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-center">
                    ❌ Failed to send message. Please try again.
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="user_name"
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="user_lastname"
                      className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Email</label>
                  <input 
                    type="email" 
                    name="user_email"
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Phone</label>
                  <input 
                    type="tel" 
                    name="user_phone"
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Message</label>
                  <textarea 
                    rows="4"
                    name="message"
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 resize-none"
                    placeholder="Tell us about your fitness goals..."
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
     
    </section>
  );
};

export default Hero;