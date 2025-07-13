import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <Header />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600 leading-none">
              404
            </h1>
          </div>
          
          {/* Error Message */}
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-300 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed">
              Looks like this workout got lost in the gym! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                         <Link 
               to="/"
               className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25"
             >
               Back to Home
             </Link>
            <button 
              onClick={() => window.history.back()}
              className="border-2 border-orange-500 text-orange-500 font-semibold px-8 py-4 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              Go Back
            </button>
          </div>
          
          {/* Fitness-themed illustration */}
          <div className="relative mb-12">
            <div className="flex justify-center space-x-8 text-6xl sm:text-7xl md:text-8xl opacity-30">
              <span className="animate-bounce delay-100">🏋️</span>
              <span className="animate-bounce delay-300">💪</span>
              <span className="animate-bounce delay-500">🏃</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-6">Popular Pages</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <Link 
                 to="/calculator"
                 className="p-4 bg-gray-700/30 rounded-xl text-gray-300 hover:text-white hover:bg-gray-600/30 transition-all duration-300 border border-gray-600/30 hover:border-red-500/30"
               >
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium">Calculator</div>
              </Link>
                             <Link 
                 to="/chat"
                 className="p-4 bg-gray-700/30 rounded-xl text-gray-300 hover:text-white hover:bg-gray-600/30 transition-all duration-300 border border-gray-600/30 hover:border-red-500/30"
               >
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-sm font-medium">AI Coach</div>
              </Link>
                             <Link 
                 to="/about"
                 className="p-4 bg-gray-700/30 rounded-xl text-gray-300 hover:text-white hover:bg-gray-600/30 transition-all duration-300 border border-gray-600/30 hover:border-red-500/30"
               >
                <div className="text-2xl mb-2">ℹ️</div>
                <div className="text-sm font-medium">About Us</div>
              </Link>
                             <Link 
                 to="/login"
                 className="p-4 bg-gray-700/30 rounded-xl text-gray-300 hover:text-white hover:bg-gray-600/30 transition-all duration-300 border border-gray-600/30 hover:border-red-500/30"
               >
                <div className="text-2xl mb-2">🔐</div>
                <div className="text-sm font-medium">Login</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
