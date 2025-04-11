import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ scrollToAbout, scrollToPrograms, scrollToExercises, scrollToContact, scrollToPlans, openLoginModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  // Track scroll position to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Detect which section is in view
      const aboutElement = document.getElementById('about');
      const programsElement = document.getElementById('programs');
      const exercisesElement = document.getElementById('exercises');
      const plansElement = document.getElementById('plans');
      const contactElement = document.getElementById('contact');
      
      // Get positions if elements exist
      const aboutPosition = aboutElement?.getBoundingClientRect().top || 0;
      const programsPosition = programsElement?.getBoundingClientRect().top || 0;
      const exercisesPosition = exercisesElement?.getBoundingClientRect().top || 0;
      const plansPosition = plansElement?.getBoundingClientRect().top || 0;
      const contactPosition = contactElement?.getBoundingClientRect().top || 0;
      
      const offset = 100;
      
      // Use window height to determine if we're at the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      
      if (isAtBottom && contactElement) {
        // If we're at the bottom of the page and contact section exists, activate it
        setActiveSection('contact');
      } else if (plansPosition - offset < 0 && contactPosition - offset > 0) {
        setActiveSection('plans');
      } else if (exercisesPosition - offset < 0 && plansPosition - offset > 0) {
        setActiveSection('exercises');
      } else if (programsPosition - offset < 0 && exercisesPosition - offset > 0) {
        setActiveSection('programs');
      } else if (aboutPosition - offset < 0 && programsPosition - offset > 0) {
        setActiveSection('about');
      } else if (window.scrollY < 100) {
        // If at the very top, no section is active
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once to set initial state
    handleScroll();
    
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

  // Check if there's already a Plans link in the navigation items
  // If not, add it between Exercises and Contact
  const navItems = [
    { name: 'About', onClick: scrollToAbout },
    { name: 'Programs', onClick: scrollToPrograms },
    { name: 'Exercises', onClick: scrollToExercises },
    { name: 'Plans', onClick: scrollToPlans },
    { name: 'Contact', onClick: scrollToContact },
  ];

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
              onClick={() => handleNavigation(scrollToPlans, '#plans', 'plans')} 
              className={`text-white transition-colors border-b-2 pb-1 ${activeSection === 'plans' ? 'border-purple-500 text-purple-400' : 'border-transparent hover:border-gray-700'}`}
            >
              Plans
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
                onClick={() => handleNavigation(scrollToPlans, '#plans', 'plans')} 
                className={`text-white py-2 transition-colors ${activeSection === 'plans' ? 'bg-purple-900/30 text-purple-400 px-3 rounded' : 'hover:bg-gray-800 px-3 rounded'}`}
              >
                Plans
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