import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';

export default function Dashboard() {
  
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden select-none'>
      <Header />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <Hero hideBackground={true} />
      </div>
    </div>
  );
}
