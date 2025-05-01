import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleViewExercise = (exercise) => {
    // Navigate to exercises page with the category of this exercise
    navigate('/exercises', { 
      state: { 
        selectedCategory: exercise.category,
        fromFeatured: true 
      } 
    });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/70 via-indigo-1000/120 to-purple-900/2 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 transition flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start">
      <img src={course?.image[0] || '/assets/routine.jpg'} alt={course.title} className="w-full h-32 object-cover" />
      <div className="p-3">
        <span className="text-xs text-purple-400 font-medium">{course.category}</span>
        <h3 className="text-lg font-medium mt-0.5 text-white">{course.title}</h3>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-400">{course.subCategory}</span>
          <button 
            onClick={() => handleViewExercise(course)}
            className="bg-purple-600 hover:bg-purple-700 transition text-white text-sm py-1 px-3 rounded"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedCourses = () => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();

  const [featuredExercises, setFeaturedExercises] = useState([]);

  useEffect(() => {
    const fetchExercise = async () => {
      const response = await axios.get(`${API_URL}/exercises/featured`);
      console.log(response.data);
      setFeaturedExercises(response.data.exercises);
    };

    fetchExercise();
  }, []);

  const checkScrollButtons = () => {
    const { current } = carouselRef;
    if (current) {
      setCanScrollLeft(current.scrollLeft > 0);
      setCanScrollRight(
        current.scrollLeft < current.scrollWidth - current.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const { current } = carouselRef;
    if (current) {
      current.addEventListener('scroll', checkScrollButtons);
      // Check initially
      checkScrollButtons();
      
      // Check after images might have loaded
      window.addEventListener('resize', checkScrollButtons);
      
      return () => {
        current.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [featuredExercises]);

  const scroll = (direction) => {
    const { current } = carouselRef;
    if (current) {
      // Always scroll by one card width - on mobile: 50% of container, on desktop: 25%
      const cardWidth = window.innerWidth >= 1024 ? current.clientWidth / 4 : current.clientWidth / 2;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleViewAllExercises = () => {
    navigate('/exercises');
  };

  return (
    <div className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Featured Exercise Programs</h2>
        
        <div className="relative mb-8">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-hide scroll-smooth snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredExercises.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
        
        {/* Navigation buttons centered below cards */}
        <div className="flex justify-center items-center space-x-4 mt-2">
          <button 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-3 rounded-full ${canScrollLeft ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 cursor-not-allowed'} transition`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button 
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-3 rounded-full ${canScrollRight ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 cursor-not-allowed'} transition`}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <button 
            onClick={handleViewAllExercises}
            className="px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 transition text-white font-medium"
          >
            View All Exercises
          </button>
        </div>
      </div>
      
      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FeaturedCourses;