import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Login from './Login';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const openLoginModal = (loginMode = true) => {
    setIsLogin(loginMode);
    setShowLoginModal(true);
    setIsMenuOpen(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <nav className="px-4 py-5 md:px-8 bg-gray-900">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">E</div>
            <span className="text-xl font-bold text-white">ExerciseMD</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="px-4 py-2 bg-purple-600 rounded-md text-white font-medium">Home</a>
            <a href="#" className="text-white hover:text-purple-400">Programs</a>
            <a href="#" className="text-white hover:text-purple-400">Exercises</a>
            <a href="#" className="text-white hover:text-purple-400">About</a>
            <a href="#" className="text-white hover:text-purple-400">Contact</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              onClick={() => openLoginModal(true)}
              className="px-4 py-2 text-sm font-medium text-white hover:text-purple-400"
            >
              Login
            </button>
            <button 
              onClick={() => openLoginModal(false)}
              className="px-4 py-2 text-sm font-medium bg-purple-600 rounded-md hover:bg-purple-700 transition"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 mt-2 py-4 px-4 rounded-lg">
            <div className="flex flex-col space-y-3">
              <a href="#" className="bg-purple-600 text-white font-medium py-2 px-3 rounded-md">Home</a>
              <a href="#" className="text-white hover:text-purple-400 py-2">Programs</a>
              <a href="#" className="text-white hover:text-purple-400 py-2">Exercises</a>
              <a href="#" className="text-white hover:text-purple-400 py-2">About</a>
              <a href="#" className="text-white hover:text-purple-400 py-2">Contact</a>
              <div className="flex flex-col space-y-2 pt-2">
                <button 
                  onClick={() => openLoginModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white hover:text-purple-400 border border-gray-700 rounded-md"
                >
                  Login
                </button>
                <button 
                  onClick={() => openLoginModal(false)}
                  className="px-4 py-2 text-sm font-medium bg-purple-600 rounded-md hover:bg-purple-700 transition"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Login/Signup Modal */}
      {showLoginModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-md mx-auto">
          <div className="relative w-full">
            <button 
              onClick={closeLoginModal}
              className="absolute top-2 right-2 text-white bg-gray-700 rounded-full p-1 hover:bg-gray-600 z-10"
            >
              <X size={18} />
            </button>
            <Login initialMode={isLogin} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;