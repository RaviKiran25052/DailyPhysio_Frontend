import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exerciseData } from './ExerciseData';
import ExerciseHeader from './ExerciseHeader';
import ExerciseSidebar from './ExerciseSidebar';
import ExerciseControls from './ExerciseControls';
import ExerciseCard from './ExerciseCard';
import ExerciseFooter from './ExerciseFooter';

const ExerciseGallery = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Lumbar Thoracic');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [layoutSize, setLayoutSize] = useState('medium'); // small, medium, large
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Responsive exercises per page: 4 on mobile, 8 on desktop
  const exercisesPerPage = isMobile ? 4 : 8;

  useEffect(() => {
    filterExercises();
    
    // Add window resize listener to adjust items per page
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedCategory, selectedPosition, searchQuery]);

  const filterExercises = () => {
    let filtered = exerciseData;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(exercise => 
        exercise.categories.includes(selectedCategory)
      );
    }

    // Filter by position
    if (selectedPosition !== 'All') {
      filtered = filtered.filter(exercise => 
        exercise.position === selectedPosition
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(query)
      );
    }

    setFilteredExercises(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const selectExercise = (exercise) => {
    if (selectedExercises.find(ex => ex.id === exercise.id)) {
      // Already selected, remove it
      setSelectedExercises(selectedExercises.filter(ex => ex.id !== exercise.id));
    } else {
      // Add to selected
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  // Navigate to exercise detail page
  const viewExerciseDetails = (exercise) => {
    navigate(`/exercise/${exercise.id}`);
  };

  // Pagination
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <ExerciseHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          <ExerciseSidebar 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            showFilters={showFilters}
            showPositionDropdown={showPositionDropdown}
            setShowPositionDropdown={setShowPositionDropdown}
          />
          
          {/* Main Content */}
          <main className="md:w-3/4 flex flex-col">
            <ExerciseControls 
              filteredExercises={filteredExercises}
              layoutSize={layoutSize}
              setLayoutSize={setLayoutSize}
            />
            
            {/* Exercises Grid */}
            <div className={`grid ${
              isMobile 
                ? 'grid-cols-2' 
                : layoutSize === 'small' 
                  ? 'grid-cols-3 lg:grid-cols-4' 
                  : layoutSize === 'large' 
                    ? 'grid-cols-1 lg:grid-cols-2' 
                    : 'grid-cols-2 lg:grid-cols-4'
            } gap-4 mb-6`}>
              {currentExercises.map((exercise) => (
                <ExerciseCard 
                  key={exercise.id}
                  exercise={exercise}
                  layoutSize={layoutSize}
                  isSelected={selectedExercises.find(ex => ex.id === exercise.id) !== undefined}
                  onSelect={selectExercise}
                  onViewDetails={() => viewExerciseDetails(exercise)}
                />
              ))}
            </div>
            
            {/* No results message */}
            {currentExercises.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No exercises found. Try adjusting your filters.</p>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mb-6">
                <div className="flex flex-wrap justify-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-md ${
                      currentPage === 1
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
                          className={`w-10 h-10 flex items-center justify-center rounded-md ${
                            currentPage === pageNumber
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
                    className={`w-10 h-10 flex items-center justify-center rounded-md ${
                      currentPage === totalPages
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

      <ExerciseFooter />
    </div>
  );
};

export default ExerciseGallery; 