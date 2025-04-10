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
  const exercisesPerPage = 8;

  useEffect(() => {
    filterExercises();
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
            <div className={`grid ${layoutSize === 'small' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : layoutSize === 'large' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-4 mb-6`}>
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === index + 1
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
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