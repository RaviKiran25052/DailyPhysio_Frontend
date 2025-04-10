import React from 'react';
import ExerciseGallery from '../Components/ExercisesPage/ExerciseGallery';
import { useLocation } from 'react-router-dom';

const ExercisesPage = () => {
  const location = useLocation();
  
  // If there's a hash in the URL, it means we're trying to navigate to a specific section
  // This is for users coming from another page, such as clicking "View All Exercises"
  React.useEffect(() => {
    // No need to do anything here, the component is already showing the exercise gallery
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ExerciseGallery />
    </div>
  );
};

export default ExercisesPage; 