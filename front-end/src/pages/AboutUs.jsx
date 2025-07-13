import React, { useEffect } from 'react'
// import anime from 'animejs';
import Header from '../components/Header'

export default function AboutUs() {
  useEffect(() => {
    // Set initial opacity for scroll-triggered elements
    document.querySelectorAll('.mission-vision, .feature-item, .team-member, .story-section, .stats-section').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
    });

    // Hero section animation
    setTimeout(() => {
      document.querySelectorAll('.about-hero-title').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 100);

    setTimeout(() => {
      document.querySelectorAll('.about-hero-subtitle').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 300);

    // Stats animation
    setTimeout(() => {
      document.querySelectorAll('.about-stat').forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        }, index * 100);
      });
    }, 500);

    // Scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (target.classList.contains('mission-vision') || 
              target.classList.contains('feature-item') || 
              target.classList.contains('team-member') || 
              target.classList.contains('story-section') || 
              target.classList.contains('stats-section')) {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }
          
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.mission-vision, .feature-item, .team-member, .story-section, .stats-section').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-yellow-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 pt-20 md:pt-32 pb-16 px-4 sm:px-6 lg:px-20">
        {/* Hero Section */}
        <div className="text-center mb-16 lg:mb-24">
          <h1 className="about-hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-6">
            About BuildYourBody
          </h1>
          <p className="about-hero-subtitle text-gray-300 text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            Your AI-powered fitness companion for a healthier lifestyle
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 lg:mb-24">
          <div className="story-section space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Our Story</h2>
            <div className="space-y-4 text-gray-300 text-base lg:text-lg leading-relaxed">
              <p>
                BuildYourBody was created by a passionate team of junior developers and students who 
                are on their journey to becoming skilled programmers. As aspiring developers still 
                learning and growing, we combined our passion for technology with our desire to help 
                people achieve their fitness goals.
              </p>
              <p>
                This project represents our dedication to learning and applying new technologies. 
                We're building an AI-powered fitness platform that provides personalized workout 
                programs, training videos, and smart recommendations while we develop our programming 
                skills along the way.
              </p>
              <p>
                As students, we believe that everyone deserves access to quality fitness guidance, 
                regardless of their experience level or budget. That's why we're working hard to 
                democratize fitness training through the power of artificial intelligence.
              </p>
            </div>
          </div>
          
          <div className="stats-section relative">
            <div className="bg-gray-800/50 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="about-stat space-y-2">
                  <div className="text-3xl lg:text-4xl font-bold text-red-400">AI</div>
                  <div className="text-gray-300 text-sm lg:text-base">Powered Assistant</div>
                </div>
                <div className="about-stat space-y-2">
                  <div className="text-3xl lg:text-4xl font-bold text-orange-400">200+</div>
                  <div className="text-gray-300 text-sm lg:text-base">Training Videos</div>
                </div>
                <div className="about-stat space-y-2">
                  <div className="text-3xl lg:text-4xl font-bold text-yellow-400">24/7</div>
                  <div className="text-gray-300 text-sm lg:text-base">AI Support</div>
                </div>
                <div className="about-stat space-y-2">
                  <div className="text-3xl lg:text-4xl font-bold text-green-400">100%</div>
                  <div className="text-gray-300 text-sm lg:text-base">Personalized</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-24">
          <div className="mission-vision bg-gray-800/50 backdrop-blur-lg border border-orange-500/30 rounded-2xl p-6 lg:p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center border border-orange-500/30 mr-4">
                <span className="text-orange-400 text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
              As junior developers, our mission is to democratize fitness training by providing intelligent, 
              AI-powered guidance while we learn and grow. We aim to make professional-quality fitness coaching 
              accessible to everyone, regardless of their experience level or location, all while honing our 
              programming skills.
            </p>
          </div>
          
          <div className="mission-vision bg-gray-800/50 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 lg:p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center border border-red-500/30 mr-4">
                <span className="text-red-400 text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
              To revolutionize the fitness industry through AI technology while advancing our careers as developers. 
              We envision a world where everyone has access to personalized training programs, and where student 
              developers like us can make a meaningful impact in people's lives.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-16 lg:mb-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center border border-red-500/30 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-red-400 text-2xl">🤖</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">AI Coach</h4>
              <p className="text-gray-300 text-sm">Smart AI that provides personalized training recommendations</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center border border-orange-500/30 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-orange-400 text-2xl">📹</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Training Videos</h4>
              <p className="text-gray-300 text-sm">Comprehensive video library showing proper training techniques</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center border border-yellow-500/30 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-yellow-400 text-2xl">🗺️</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Training Routes</h4>
              <p className="text-gray-300 text-sm">Structured workout paths tailored to your fitness goals</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center border border-green-500/30 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-green-400 text-2xl">🧮</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Calculators</h4>
              <p className="text-gray-300 text-sm">BMI and calories calculators to track your health metrics</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/30 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-purple-400 text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Progress Tracking</h4>
              <p className="text-gray-300 text-sm">Monitor your fitness journey with detailed analytics</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-blue-400 text-2xl">💬</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">24/7 Support</h4>
              <p className="text-gray-300 text-sm">Round-the-clock AI assistance for your fitness questions</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16 lg:mb-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-12">Meet Our Student Development Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="team-member bg-gray-800/50 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center border border-red-500/30 mx-auto mb-4">
                <span className="text-red-400 text-3xl">🎓</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Nabil</h4>
              <p className="text-orange-400 font-medium mb-2">Junior Full Stack Developer</p>
              <p className="text-gray-300 text-sm">Student passionate about learning web development and creating user-friendly applications</p>
            </div>
            
            <div className="team-member bg-gray-800/50 backdrop-blur-lg border border-orange-500/30 rounded-2xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-24 h-24 bg-orange-600/20 rounded-full flex items-center justify-center border border-orange-500/30 mx-auto mb-4">
                <span className="text-orange-400 text-3xl">🎓</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Ossama</h4>
              <p className="text-orange-400 font-medium mb-2">Junior Backend Developer</p>
              <p className="text-gray-300 text-sm">Student specializing in server-side programming and database management</p>
            </div>
            
            <div className="team-member bg-gray-800/50 backdrop-blur-lg border border-yellow-500/30 rounded-2xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-24 h-24 bg-yellow-600/20 rounded-full flex items-center justify-center border border-yellow-500/30 mx-auto mb-4">
                <span className="text-yellow-400 text-3xl">🎓</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Brahim</h4>
              <p className="text-orange-400 font-medium mb-2">Junior Backend Developer</p>
              <p className="text-gray-300 text-sm">Student focused on backend systems and learning AI integration techniques</p>
            </div>
          </div>
        </div>


      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <h3 className="text-white text-xl font-bold">BuildYourBody</h3>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered fitness companion built by passionate student developers.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-red-400 transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-red-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Training Routes</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">AI Coach</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📧 filalinabil026@gmail.com</li>
                <li>🎓 Computer Science Students - UM5 FSR</li>
                <li>📍 Rabat, Morocco</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 BuildYourBody. Developed with ❤️ by junior developers{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 font-semibold">
                Nabil, Ossama & Brahim
              </span>
              {' '}• Student programmers on a learning journey • All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
