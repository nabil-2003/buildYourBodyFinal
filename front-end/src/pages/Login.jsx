import React, { useState, useEffect } from 'react';
// import anime from 'animejs';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';
import { clearErrors } from '../reducers/userReducer';

const Login = () => {
  const { login } = useAuth();
  const dispatch = useDispatch();
  const { loading, loginError } = useSelector(state => state.userReducer);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Animation effects
  useEffect(() => {
    // Set initial opacity for elements
    document.querySelectorAll('.login-container, .login-title, .login-form').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
    });

    // Page animation
    setTimeout(() => {
      document.querySelectorAll('.login-container').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 100);

    setTimeout(() => {
      document.querySelectorAll('.login-title').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 300);

    setTimeout(() => {
      document.querySelectorAll('.login-form').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (error) {

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      <div className="flex items-center justify-center min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="login-container bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="login-title text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-300">Sign in to continue your fitness journey</p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:from-red-600 hover:to-orange-600 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-red-400 hover:text-red-300 font-medium transition-colors duration-300 hover:underline"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
