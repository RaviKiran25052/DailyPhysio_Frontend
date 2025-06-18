import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import ExerciseCard from '../Components/Exercises/ExerciseCard';
import ExerciseControls from '../Components/Exercises/ExerciseControls';
import ExerciseSidebar from '../Components/Exercises/ExerciseSidebar';

const API_URL = process.env.REACT_APP_API_URL || '';

const ExercisesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef(null);

  // Check if we have category in location state (from Featured Courses)
  const initialCategory = location.state?.selectedCategory || 'All';
  const [allCategories, setAllCategories] = useState([]);
  const [allPositions, setAllPositions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [layoutSize, setLayoutSize] = useState('medium'); // small, medium, large
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(false);

  // If we came from featured exercises, show a notification
  const [showFeaturedNotification, setShowFeaturedNotification] = useState(!!location.state?.fromFeatured);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/exercises/categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setAllCategories(response.data.data.categories);
        setAllPositions(response.data.data.positions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    }

    fetchData();
  }, []);

  // Clear location state after using it
  useEffect(() => {
    if (location.state) {
      // Replace the current history entry to remove the state
      navigate(location.pathname, { replace: true });

      // If we came from featured, show notification for 5 seconds
      if (location.state.fromFeatured) {
        setTimeout(() => {
          setShowFeaturedNotification(false);
        }, 5000);
      }
    }
  }, [location.state, navigate]);

  // Fixed exercises per page: 9 on desktop
  const exercisesPerPage = 9;

  // Fetch exercises with filters
  const fetchExercises = async (searchQuery = '') => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedSubCategory) params.subcategory = selectedSubCategory;
      if (selectedPosition !== 'All') params.position = selectedPosition;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      // Get token for authentication if available
      const token = localStorage.getItem('token') || '';

      // Make API request
      const response = await axios.get(`${API_URL}/exercises/filters`, {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setFilteredExercises(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setFilteredExercises([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch exercises when filters change
  useEffect(() => {
    fetchExercises();
  }, [selectedCategory, selectedSubCategory, selectedPosition]);

  useEffect(() => {
    setSelectedPosition('All');
  }, [selectedCategory]);

  // Handle search
  const handleSearch = (query) => {
    fetchExercises(query);
  };

  // Add event listener for window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigate to exercise detail page
  const viewExerciseDetails = (exercise) => {
    navigate(`/exercise/${exercise._id}`);
  };

  // Toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setShowFilters(!showFilters);
  };

  // Handle category selection in mobile dropdown
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory('');
    setShowCategoryDropdown(false);
  };

  // Handle position selection in mobile dropdown
  const handlePositionSelect = (position) => {
    setSelectedPosition(position);
    setShowPositionDropdown(false);
  };

  // Close dropdowns when clicking outside
  const handleClickOutside = (e, setter) => {
    if (e.target.closest('.dropdown-container') === null) {
      setter(false);
    }
  };

  // Add event listeners to close dropdowns when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (showCategoryDropdown) {
        handleClickOutside(e, setShowCategoryDropdown);
      }
      if (showPositionDropdown) {
        handleClickOutside(e, setShowPositionDropdown);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [showCategoryDropdown, showPositionDropdown]);

  // Carousel scroll handlers
  const scrollLeft = () => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({
        left: -containerWidth * 0.8,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({
        left: containerWidth * 0.8,
        behavior: 'smooth'
      });
    }
  };

  // Pagination for desktop view
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = !isMobile
    ? filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise)
    : filteredExercises;
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleSidebar}
            className="w-full py-2 px-4 bg-gray-800 rounded-lg flex justify-between items-center"
          >
            <span className="font-medium flex items-center">
              <Filter size={16} className="mr-2 text-purple-400" />
              Filters & Categories
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${showFilters ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Panel with Dropdowns */}
          <div className={`md:hidden ${showFilters ? 'block' : 'hidden'} mb-4`}>
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
              {/* Current Selection Display */}
              <div className="flex flex-wrap items-center gap-2 mb-4 px-2 py-2 bg-gray-700/50 rounded-lg">
                <span className="text-xs font-medium text-gray-400">Viewing:</span>
                <div className="flex-1 flex items-center">
                  <span className="text-sm font-medium text-purple-300">{selectedCategory}</span>
                  <ChevronDown size={14} className="mx-1 text-gray-500" />
                  {selectedSubCategory && (
                    <>
                      <span className="text-sm font-medium text-purple-300">{selectedSubCategory}</span>
                      <ChevronDown size={14} className="mx-1 text-gray-500" />
                    </>
                  )}
                  <span className="text-sm font-medium text-gray-200">{selectedPosition}</span>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="mb-4 dropdown-container relative">
                <label className="block text-white font-medium mb-2">Category</label>
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-white flex justify-between items-center"
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown size={16} className={`transition-transform ${showCategoryDropdown ? 'transform rotate-180' : ''}`} />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {Object.keys(allCategories).map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full p-2.5 text-left hover:bg-gray-600 transition-colors ${selectedCategory === category ? 'bg-purple-600 text-white' : ''}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Position Dropdown */}
              <div className="dropdown-container relative">
                <label className="block text-white font-medium mb-2">Position</label>
                <button
                  onClick={() => setShowPositionDropdown(!showPositionDropdown)}
                  className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-white flex justify-between items-center"
                >
                  <span>{selectedPosition}</span>
                  <ChevronDown size={16} className={`transition-transform ${showPositionDropdown ? 'transform rotate-180' : ''}`} />
                </button>

                {showPositionDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {allPositions.map(position => (
                      <button
                        key={position}
                        onClick={() => handlePositionSelect(position)}
                        className={`w-full p-2.5 text-left hover:bg-gray-600 transition-colors ${selectedPosition === position ? 'bg-purple-600 text-white' : ''}`}
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar - Always Show */}
          <div className="hidden md:block md:w-1/4 min-w-[250px]">
            <ExerciseSidebar
              loading={isLoading}
              categories={allCategories}
              positions={allPositions}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              selectedPosition={selectedPosition}
              setSelectedPosition={setSelectedPosition}
              showFilters={true}
              showPositionDropdown={showPositionDropdown}
              setShowPositionDropdown={setShowPositionDropdown}
            />
          </div>

          {/* Main Content */}
          <main className="w-full md:w-3/4 flex flex-col">
            <ExerciseControls
              filteredExercises={filteredExercises}
              layoutSize={layoutSize}
              setLayoutSize={setLayoutSize}
              handleSearch={handleSearch}
            />

            {/* Featured navigation notification */}
            {showFeaturedNotification && (
              <div className="bg-indigo-900/80 border-l-4 border-purple-500 p-3 mb-4 text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-purple-300 mr-2">💫</span>
                  <span className="text-gray-200">
                    Showing exercises in the <span className="font-semibold text-purple-300">{selectedCategory}</span> category
                  </span>
                </div>
                <button
                  onClick={() => setShowFeaturedNotification(false)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            )}

            {/* Mobile Carousel */}
            {isMobile && filteredExercises.length > 0 && !isLoading && (
              <div className="relative mb-6">
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id || exercise._id}
                      className="snap-start w-80 flex-shrink-0 mr-4"
                    >
                      <ExerciseCard
                        exercise={exercise}
                        layoutSize={layoutSize}
                        onViewDetails={() => viewExerciseDetails(exercise)}
                      />
                    </div>
                  ))}
                </div>

                {/* Carousel Navigation Buttons */}
                <button
                  onClick={scrollLeft}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 -ml-4 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={scrollRight}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 -mr-4 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    {filteredExercises.length > 0 && (
                      <span className="text-sm text-gray-400">
                        Swipe to see more ({filteredExercises.length} exercises)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Exercises Grid */}
            {!isMobile && filteredExercises.length > 0 && !isLoading && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {currentExercises.map((exercise) => (
                  <button
                    key={exercise.id || exercise._id}
                    onClick={() => viewExerciseDetails(exercise)}
                    className="w-full text-left transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
                  >
                    <ExerciseCard
                      exercise={exercise}
                      layoutSize={layoutSize}
                      onViewDetails={() => viewExerciseDetails(exercise)}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* No results message */}
            {filteredExercises.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No exercises found. Try adjusting your filters.</p>
              </div>
            )}

            {/* Pagination for Desktop */}
            {!isMobile && totalPages > 1 && !isLoading && (
              <div className="flex justify-center mb-6">
                <div className="flex flex-wrap justify-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === 1
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    &lt;
                  </button>

                  {/* Page numbers with ellipsis for large page counts */}
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;

                    // Always show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === pageNumber
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }

                    // Show ellipsis for skipped pages
                    if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="w-10 h-10 flex items-center justify-center text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}

                  {/* Next button */}
                  <button
                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === totalPages
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Custom scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ExercisesPage; 