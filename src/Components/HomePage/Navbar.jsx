import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ scrollToAbout, scrollToPrograms, scrollToExercises, scrollToContact, openLoginModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  // Track scroll position to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Detect which section is in view
      const aboutPosition = document.getElementById('about')?.getBoundingClientRect().top || 0;
      const programsPosition = document.getElementById('programs')?.getBoundingClientRect().top || 0;
      const exercisesPosition = document.getElementById('exercises')?.getBoundingClientRect().top || 0;
      const contactPosition = document.getElementById('contact')?.getBoundingClientRect().top || 0;
      
      const offset = 100;
      
      if (aboutPosition - offset < 0 && programsPosition - offset > 0) {
        setActiveSection('about');
      } else if (programsPosition - offset < 0 && exercisesPosition - offset > 0) {
        setActiveSection('programs');
      } else if (exercisesPosition - offset < 0 && contactPosition - offset > 0) {
        setActiveSection('exercises');
      } else if (contactPosition - offset < 0) {
        setActiveSection('contact');
      } else {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle navigation - either scroll or navigate to a new page
  const handleNavigation = (action, path, section) => {
    setIsMenuOpen(false); // Close mobile menu
    setActiveSection(section);
    
    if (location.pathname === '/') {
      // If on home page, use scroll functionality
      if (action) action();
    } else {
      // If on another page, navigate to home with hash
      window.location.href = `/${path ? path : ''}`;
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900 shadow-lg border-b border-gray-800' : 'bg-gray-900/95 border-b border-gray-800/50'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-purple-500">Exercise</span>
            <span className="text-white">MD</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => handleNavigation(scrollToAbout, '#about', 'about')} 
              className={`text-white transition-colors border-b-2 pb-1 ${activeSection === 'about' ? 'border-purple-500 text-purple-400' : 'border-transparent hover:border-gray-700'}`}
            >
              About
            </button>
            <button 
              onClick={() => handleNavigation(scrollToPrograms, '#programs', 'programs')} 
              className={`text-white transition-colors border-b-2 pb-1 ${activeSection === 'programs' ? 'border-purple-500 text-purple-400' : 'border-transparent hover:border-gray-700'}`}
            >
              Programs
            </button>
            <button 
              onClick={() => handleNavigation(scrollToExercises, '#exercises', 'exercises')} 
              className={`text-white transition-colors border-b-2 pb-1 ${activeSection === 'exercises' ? 'border-purple-500 text-purple-400' : 'border-transparent hover:border-gray-700'}`}
            >
              Exercises
            </button>
            <button 
              onClick={() => handleNavigation(scrollToContact, '#contact', 'contact')} 
              className={`text-white transition-colors border-b-2 pb-1 ${activeSection === 'contact' ? 'border-purple-500 text-purple-400' : 'border-transparent hover:border-gray-700'}`}
            >
              Contact
            </button>
          </nav>

          {/* Right Side - Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => openLoginModal(true)} 
              className="px-4 py-2 rounded-md text-white hover:text-purple-300 transition-colors border border-gray-700 hover:border-purple-500"
            >
              Sign In
            </button>
            <button 
              onClick={() => openLoginModal(false)} 
              className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 text-white transition-colors"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4 py-4">
              <button 
                onClick={() => handleNavigation(scrollToAbout, '#about', 'about')} 
                className={`text-white py-2 transition-colors ${activeSection === 'about' ? 'bg-purple-900/30 text-purple-400 px-3 rounded' : 'hover:bg-gray-800 px-3 rounded'}`}
              >
                About
              </button>
              <button 
                onClick={() => handleNavigation(scrollToPrograms, '#programs', 'programs')} 
                className={`text-white py-2 transition-colors ${activeSection === 'programs' ? 'bg-purple-900/30 text-purple-400 px-3 rounded' : 'hover:bg-gray-800 px-3 rounded'}`}
              >
                Programs
              </button>
              <button 
                onClick={() => handleNavigation(scrollToExercises, '#exercises', 'exercises')} 
                className={`text-white py-2 transition-colors ${activeSection === 'exercises' ? 'bg-purple-900/30 text-purple-400 px-3 rounded' : 'hover:bg-gray-800 px-3 rounded'}`}
              >
                Exercises
              </button>
              <button 
                onClick={() => handleNavigation(scrollToContact, '#contact', 'contact')} 
                className={`text-white py-2 transition-colors ${activeSection === 'contact' ? 'bg-purple-900/30 text-purple-400 px-3 rounded' : 'hover:bg-gray-800 px-3 rounded'}`}
              >
                Contact
              </button>
              <div className="flex space-x-4 pt-4 border-t border-gray-800">
                <button 
                  onClick={() => openLoginModal(true)}
                  className="px-4 py-2 rounded-md text-white hover:text-purple-300 transition-colors border border-gray-700 hover:border-purple-500"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => openLoginModal(false)}
                  className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 text-white transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;