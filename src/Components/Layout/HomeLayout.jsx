import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import Hero from '../HomePage/Hero';
import TrustedBy from '../HomePage/TrustedBy';
import PopularClasses from '../HomePage/PopularClasses';
import FeaturedCourses from '../HomePage/FeaturedCourses';
import CallToAction from '../HomePage/CallToAction';
import Footer from '../HomePage/Footer';
import Login from '../HomePage/Login';
import { X } from 'lucide-react';

const HomeLayout = () => {
  const location = useLocation();
  
  // State for login modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isModalMounted, setIsModalMounted] = useState(false);

  // Create refs for each section to scroll to
  const aboutRef = useRef(null);
  const programsRef = useRef(null);
  const exercisesRef = useRef(null);
  const contactRef = useRef(null);

  // Check URL for login parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const shouldOpenLogin = queryParams.get('login');
    
    if (shouldOpenLogin) {
      // Open login modal with login form (not signup)
      openLoginModal(true);
    }
  }, [location.search]);

  // Function to scroll to a section
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to open the login modal
  const openLoginModal = (loginMode = true) => {
    setIsLogin(loginMode);
    setShowLoginModal(true);
    setIsModalMounted(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Function to close the login modal
  const closeLoginModal = () => {
    setShowLoginModal(false);
    // Restore scrolling when modal is closed
    document.body.style.overflow = 'auto';
    
    // Unmount the modal after animation completes
    setTimeout(() => {
      setIsModalMounted(false);
    }, 300);
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Ensure body scrolling is restored if component unmounts with modal open
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar 
        scrollToAbout={() => scrollToSection(aboutRef)} 
        scrollToPrograms={() => scrollToSection(programsRef)} 
        scrollToExercises={() => scrollToSection(exercisesRef)}
        scrollToContact={() => scrollToSection(contactRef)}
        openLoginModal={openLoginModal}
      />
      
      <Hero 
        scrollToExercises={() => scrollToSection(exercisesRef)} 
        openLoginModal={openLoginModal}
      />
      
      <div ref={aboutRef} id="about">
        <TrustedBy />
      </div>
      
      <div ref={programsRef} id="programs">
        <PopularClasses />
      </div>
      
      <div ref={exercisesRef} id="exercises">
        <FeaturedCourses />
      </div>
      
      <CallToAction />
      
      <div ref={contactRef} id="contact">
        <Footer />
      </div>

      {/* Login Modal */}
      {isModalMounted && (
        <>
          {/* Dark overlay with blur effect */}
          <div 
            className={`fixed inset-0 bg-black/70 backdrop-blur-md z-40 transition-opacity duration-300 ${showLoginModal ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeLoginModal}
          ></div>
          
          {/* Modal */}
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-md mx-auto transition-all duration-300 ${showLoginModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative w-full h-auto max-h-[85vh]">
              <button 
                onClick={closeLoginModal}
                className="absolute top-2 right-2 text-white bg-gray-700 rounded-full p-1 hover:bg-gray-600 z-10"
              >
                <X size={18} />
              </button>
              <Login initialMode={isLogin} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeLayout; 