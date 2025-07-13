import React, { useState, useEffect } from 'react';
// import anime from 'animejs';
import Header from '../components/Header';
//calcul
const Calculator = () => {
  const [activeTab, setActiveTab] = useState('bmi');
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    waist: ''
  });
  const [results, setResults] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100; // Convert cm to meters
    const bmi = (weight / (height * height)).toFixed(1);
    
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    
    setResults({ bmi, category });
  };

  const calculateBMR = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);
    
    // Mifflin-St Jeor Equation
    let bmr;
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    const tdee = Math.round(bmr * activityMultipliers[formData.activityLevel]);
    bmr = Math.round(bmr);
    
    setResults({ bmr, tdee });
  };

  const calculateBodyFat = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);
    const waist = parseFloat(formData.waist);

    // Validate inputs
    if (
      isNaN(weight) || weight <= 0 ||
      isNaN(height) || height <= 0 ||
      isNaN(age) || age <= 0 ||
      isNaN(waist) || waist <= 0
    ) {
      setResults({ bodyFat: null, error: 'Please enter valid values for all fields.' });
      return;
    }

    // U.S. Navy method
    let bodyFat;
    if (formData.gender === 'male') {
      if (waist - weight <= 0) {
        setResults({ bodyFat: null, error: 'Waist must be greater than weight.' });
        return;
      }
      bodyFat = 86.010 * Math.log10(waist - weight) - 70.041 * Math.log10(height) + 36.76;
    } else {
      bodyFat = 163.205 * Math.log10(waist + weight) - 97.684 * Math.log10(height) - 78.387;
    }

    if (isNaN(bodyFat) || !isFinite(bodyFat)) {
      setResults({ bodyFat: null, error: 'Calculation error. Please check your inputs.' });
      return;
    }

    bodyFat = Math.max(0, Math.min(100, bodyFat)); // Clamp between 0-100%
    setResults({ bodyFat: bodyFat.toFixed(1), error: null });
  };

  const handleCalculate = () => {
    if (activeTab === 'bmi') calculateBMI();
    else if (activeTab === 'bmr') calculateBMR();
    else if (activeTab === 'bodyFat') calculateBodyFat();
  };

  // Animation effects
  useEffect(() => {
    // Set initial opacity for scroll-triggered elements
    document.querySelectorAll('.calculator-container, .result-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
    });

    // Page title animation
    setTimeout(() => {
      document.querySelectorAll('.calculator-hero-title').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 100);

    setTimeout(() => {
      document.querySelectorAll('.calculator-hero-subtitle').forEach(el => {
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
          
          if (target.classList.contains('calculator-container') || 
              target.classList.contains('result-card')) {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }
          
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.calculator-container, .result-card').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Animation for results
  useEffect(() => {
    if (Object.keys(results).length > 0) {
      document.querySelectorAll('.result-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      });
    }
  }, [results]);

  const tabs = [
    { id: 'bmi', name: 'BMI Calculator', icon: '📊' },
    { id: 'bmr', name: 'BMR & TDEE', icon: '🔥' },
    { id: 'bodyFat', name: 'Body Fat %', icon: '📏' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="calculator-hero-title text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
              Fitness Calculator
            </h1>
            <p className="calculator-hero-subtitle text-xl text-gray-300 max-w-2xl mx-auto">
              Calculate your BMI, BMR, TDEE, and body fat percentage
            </p>
          </div>

          {/* Calculator Container */}
          <div className="max-w-4xl mx-auto">
            <div className="calculator-container bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 p-6 border-b border-gray-700/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Calculator Content */}
              <div className="p-8">
                {activeTab === 'bmi' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                          placeholder="Enter your weight"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Height (cm)</label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                          placeholder="Enter your height"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleCalculate}
                      className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                    >
                      Calculate BMI
                    </button>
                    {results.bmi && (
                      <div className="result-card mt-6 p-6 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30">
                        <h3 className="text-2xl font-bold text-white mb-2">Your Results</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                            <div className="text-3xl font-bold text-orange-500">{results.bmi}</div>
                            <div className="text-gray-300">BMI Score</div>
                          </div>
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                            <div className="text-xl font-bold text-purple-400">{results.category}</div>
                            <div className="text-gray-300">Category</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'bmr' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                          placeholder="Enter your weight"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Height (cm)</label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                          placeholder="Enter your height"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                          placeholder="Enter your age"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Activity Level</label>
                      <select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                      >
                        <option value="sedentary">Sedentary (little or no exercise)</option>
                        <option value="light">Lightly active (light exercise 1-3 days/week)</option>
                        <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
                        <option value="active">Very active (hard exercise 6-7 days/week)</option>
                        <option value="veryActive">Extra active (very hard exercise, physical job)</option>
                      </select>
                    </div>
                    <button
                      onClick={handleCalculate}
                      className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                    >
                      Calculate BMR & TDEE
                    </button>
                    {results.bmr && (
                      <div className="result-card mt-6 p-6 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30">
                        <h3 className="text-2xl font-bold text-white mb-4">Your Results</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                            <div className="text-3xl font-bold text-orange-500">{results.bmr}</div>
                            <div className="text-gray-300">BMR (calories/day)</div>
                          </div>
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                            <div className="text-3xl font-bold text-purple-400">{results.tdee}</div>
                            <div className="text-gray-300">TDEE (calories/day)</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'bodyFat' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                          placeholder="Enter your weight"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Height (cm)</label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                          placeholder="Enter your height"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                          placeholder="Enter your age"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Waist (cm)</label>
                        <input
                          type="number"
                          name="waist"
                          value={formData.waist}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                          placeholder="Enter waist circumference"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <button
                      onClick={handleCalculate}
                      className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                    >
                      Calculate Body Fat %
                    </button>
                    {results.error && (
                      <div className="result-card mt-6 p-6 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-red-600/30">
                        <h3 className="text-2xl font-bold text-red-400 mb-4">Error</h3>
                        <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                          <div className="text-lg font-bold text-red-400 mb-2">{results.error}</div>
                        </div>
                      </div>
                    )}
                    {results.bodyFat !== null && results.bodyFat !== undefined && !results.error ? (
                      <div className="result-card mt-6 p-6 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30">
                        <h3 className="text-2xl font-bold text-white mb-4">Your Results</h3>
                        <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                          <div className="text-4xl font-bold text-orange-500 mb-2">{results.bodyFat}%</div>
                          <div className="text-gray-300">Body Fat Percentage</div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 
