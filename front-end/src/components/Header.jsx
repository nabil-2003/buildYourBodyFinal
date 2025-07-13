import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../reducers/userReducer';
import { setPlan } from '../reducers/PlanReducer';
import usePlan from '../hooks/usePlan';

const Header = () => {
const {fetchPlan} = usePlan();
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
      useEffect(() => {

                    if(localStorage.getItem('user') != null ) {
          dispatch(setUser({user : JSON.parse(localStorage.getItem('user'))}));
          dispatch(setPlan({ plan: {...JSON.parse(localStorage.getItem('plan')) }}));
           let i = setTimeout(() => {
            fetchPlan(user);
            clearTimeout(i);
          } , 200)
          
                    }
      }, []);

  const handleLogOut = () => {
    logout();
    location.reload()
     
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const isAuthenticated = useSelector((state) => state.userReducer.isAuthenticated);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-gray-700/30">
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left Side - Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-orange-400 transition-all duration-500">
              B
            </span>
            <span className="text-xl font-semibold text-gray-300 ml-1 group-hover:text-white transition-colors duration-300">
              uildYourBody
            </span>
          </Link>

          {/* Center - Main Routes */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                window.location.pathname === '/' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                window.location.pathname === '/about' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              About
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/myPlan" 
                  className={`px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                    window.location.pathname === '/myPlan' 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  My Plan
                </Link>
                <Link 
                  to="/calculator" 
                  className={`px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                    window.location.pathname === '/calculator' 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Calculator
                </Link>
                <Link 
                  to="/chat" 
                  className={`px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                    window.location.pathname === '/chat' 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  AI Coach
                </Link>
                <Link 
                  to="/videos" 
                  className={`px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                    window.location.pathname === '/videos' 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Videos
                </Link>
              </>
            )}
          </nav>

          {/* Right Side - Auth Routes */}
          <nav className="hidden md:flex items-center space-x-1">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="ml-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-red-500/20"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button 
                onClick={handleLogOut}
                className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 font-medium rounded-lg hover:from-gray-600 hover:to-gray-700 hover:text-white transition-all duration-300 border border-gray-600/50"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800/90 backdrop-blur-lg border-t border-gray-700/30">
            <nav className="flex flex-col space-y-1 p-2">
              {/* Main Routes */}
              <Link 
                to="/" 
                className={`px-4 py-3 font-medium rounded-lg transition-colors ${
                  window.location.pathname === '/' 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`px-4 py-3 font-medium rounded-lg transition-colors ${
                  window.location.pathname === '/about' 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/myPlan" 
                    className={`px-4 py-3 font-medium rounded-lg transition-colors ${
                      window.location.pathname === '/myPlan' 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Plan
                  </Link>
                  <Link 
                    to="/calculator" 
                    className={`px-4 py-3 font-medium rounded-lg transition-colors ${
                      window.location.pathname === '/calculator' 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Calculator
                  </Link>
                  <Link 
                    to="/chat" 
                    className={`px-4 py-3 font-medium rounded-lg transition-colors ${
                      window.location.pathname === '/chat' 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    AI Coach
                  </Link>
                  <Link 
                    to="/videos" 
                    className={`px-4 py-3 font-medium rounded-lg transition-colors ${
                      window.location.pathname === '/videos' 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Videos
                  </Link>
                </>
              )}
              
              {/* Separator */}
              <div className="h-px bg-gray-600/50 mx-4 my-2"></div>
              
              {/* Auth Routes */}
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/login" 
                    className={`px-4 py-3 font-medium rounded-lg transition-colors ${
                      window.location.pathname === '/login' 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className={`px-4 py-3 text-center font-medium rounded-lg transition-all mt-1 ${
                      window.location.pathname === '/signup' 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                        : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <button 
                  onClick={() => {
                    handleLogOut();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-3 text-left bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 font-medium rounded-lg hover:from-gray-600 hover:to-gray-700 hover:text-white transition-all border border-gray-600/50"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
