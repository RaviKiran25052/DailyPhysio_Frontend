import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleViewExercise = (exercise) => {
    // Make sure we have valid data before navigating
    if (!exercise || !exercise.category) {
      // If category is missing, just navigate to exercises page without state
      navigate('/exercises');
      return;
    }

    // Navigate to exercises page with the category of this exercise
    navigate('/exercises', {
      state: {
        selectedCategory: exercise.category,
        fromFeatured: true
      }
    });
  };

  // Ensure the course object has the required properties
  const title = course?.title || 'Exercise';
  const category = course?.category || 'General';
  const subCategory = course?.subCategory || '';
  const position = course?.position || '';
  const image = course?.image?.[0] || course?.image || '/assets/routine.jpg';
  const desp = course?.description || ""

  return (
    <div className="bg-gradient-to-br from-indigo-900/70 via-indigo-1000/120 to-purple-900/2 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 transition flex-shrink-0 flex flex-col justify-between w-[calc(100%-8px)] md:w-[calc(25%-18px)] snap-start">
      <div className="relative w-full h-48">
        <img src={image} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      <div className="p-3">
        <h3 className="text-lg font-medium my-1 text-white text-ellipsis line-clamp-1">{title}</h3>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
        <div className="flex gap-2 items-center mb-3 mt-2 text-xs text-purple-400 font-medium">
          <span className="bg-purple-400 text-purple-950 rounded-full p-1 px-2">{category}</span>
          <span className='text-xl text-white font-thin'>/</span>
          <span className="">{subCategory}</span>
        </div>
        <p className='text-purple-300 text-sm text-ellipsis line-clamp-2'>{desp}</p>
      </div>
      <div className="p-3 mt-2 flex justify-between items-center">
        <p className='text-xs'>
          <span className='text-white'>Position: </span>
          <span className="text-purple-400">{position}</span>
        </p>
        <button
          onClick={() => handleViewExercise(course)}
          className="bg-purple-600 hover:bg-purple-700 transition text-white text-sm py-1 px-3 rounded"
        >
          View
        </button>
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/public/featured`);
        console.log('Featured exercises response:', response.data);

        // Check the structure of the response and extract exercises accordingly
        const exercises = Array.isArray(response.data)
          ? response.data
          : response.data.exercises || [];

        setFeaturedExercises(exercises);
      } catch (error) {
        console.error('Error fetching featured exercises:', error);
        setFeaturedExercises([]);
      } finally {
        setIsLoading(false);
      }
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
      const cardWidth = window.innerWidth >= 1024 ? current.clientWidth / 4 : current.clientWidth;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleViewAllExercises = () => {
    navigate('/exercises');
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Exercise Programs</h2>

        <div className="relative mb-8 px-4 md:px-14">
          {isLoading ? (
            // Loading state
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : featuredExercises.length === 0 ? (
            // Empty state
            <div className="text-center py-8">
              <p className="text-gray-400">No featured exercises available at the moment.</p>
            </div>
          ) : (
            // Exercises list
            <div
              ref={carouselRef}
              className="flex overflow-x-auto h-[400px] gap-4 pb-4 scrollbar-hide scroll-smooth snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredExercises.map((course, index) => (
                <CourseCard key={course._id || course.id || index} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* Navigation buttons centered below cards - only show if we have exercises */}
        {!isLoading && featuredExercises.length > 0 && (
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
        )}

        <div className="mt-10 text-center md:hidden">
          <button
            onClick={handleViewAllExercises}
            className="px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 transition text-white font-medium"
          >
            {isLoading ? 'Loading...' : 'View All Exercises'}
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