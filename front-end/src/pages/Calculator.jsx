import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

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
    const height = parseFloat(formData.height) / 100;
    if (isNaN(weight) || isNaN(height) || height <= 0) {
      setResults({ bmi: 'Invalid input', category: '-' });
      return;
    }

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

    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
      setResults({ bmr: 'Invalid input', tdee: '-' });
      return;
    }

    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

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

    if (isNaN(weight) || isNaN(height) || isNaN(age) || isNaN(waist)) {
      setResults({ bodyFat: 'Invalid input' });
      return;
    }

    let bodyFat;

    try {
      if (formData.gender === 'male') {
        if (waist <= weight || height <= 0) throw new Error();
        bodyFat = 86.010 * Math.log10(waist - weight) - 70.041 * Math.log10(height) + 36.76;
      } else {
        if (waist + weight <= 0 || height <= 0) throw new Error();
        bodyFat = 163.205 * Math.log10(waist + weight) - 97.684 * Math.log10(height) - 78.387;
      }
      bodyFat = Math.max(0, Math.min(100, bodyFat));
      setResults({ bodyFat: bodyFat.toFixed(1) });
    } catch {
      setResults({ bodyFat: 'Invalid measurement' });
    }
  };

  const handleCalculate = () => {
    if (activeTab === 'bmi') calculateBMI();
    else if (activeTab === 'bmr') calculateBMR();
    else if (activeTab === 'bodyFat') calculateBodyFat();
  };

  useEffect(() => {
    document.querySelectorAll('.calculator-container, .result-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
    });

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

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          if (
            target.classList.contains('calculator-container') ||
            target.classList.contains('result-card')
          ) {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.calculator-container, .result-card').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (Object.keys(results).length > 0) {
      document.querySelectorAll('.result-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      });
    }
  }, [results]);

  // The rest of the UI rendering is exactly as you wrote it, including the tab content.
  // لا حاجة لتكرار كل JSX الخاص بواجهة المستخدم إذا لم يتغير شيء فيه.

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      {/* Add the JSX you already have for the layout and UI, same as before */}
      {/* مثال: تبويبات BMI وBMR و Body Fat، إدخالات المستخدم، نتائج الحساب... */}
      {/* فقط استبدل دالة calculateBodyFat بالنسخة الجديدة أعلاه */}
    </div>
  );
};

export default Calculator;
