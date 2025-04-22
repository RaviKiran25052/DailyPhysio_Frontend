import React, { useState, useEffect } from 'react';
import ExerciseGallery from '../Components/Exercises/ExerciseGallery';
import ExerciseFooter from '../Components/Exercises/ExerciseFooter';
import { toast } from 'react-toastify';

const ExercisesPage = () => {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isProUser, setIsProUser] = useState(false);

  // Check if user has Pro membership
  useEffect(() => {
    const checkProStatus = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsedInfo = JSON.parse(userInfo);
          setIsProUser(parsedInfo.membershipType === 'pro');
        } catch (e) {
          setIsProUser(false);
        }
      }
    };
    
    checkProStatus();
  }, []);

  // Load exercises from localStorage on component mount
  useEffect(() => {
    const savedExercises = JSON.parse(localStorage.getItem('hepExercises') || '[]');
    
    // If not a pro user, limit to one exercise
    if (!isProUser && savedExercises.length > 1) {
      const limitedExercises = [savedExercises[0]];
      setSelectedExercises(limitedExercises);
      localStorage.setItem('hepExercises', JSON.stringify(limitedExercises));
      toast.warning('Free users can only add 1 exercise to HEP. Upgrade to Pro for unlimited exercises.');
    } else {
      setSelectedExercises(savedExercises);
    }
  }, [isProUser]);

  // Save exercises to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hepExercises', JSON.stringify(selectedExercises));
  }, [selectedExercises]);

  // Function to add an exercise to the HEP
  const addExerciseToHEP = (exercise) => {
    // Check if exercise is already in the list
    if (!selectedExercises.some(item => item.id === exercise.id || item._id === exercise._id)) {
      // For non-pro users, limit to only one exercise
      if (!isProUser && selectedExercises.length > 0) {
        toast.warning('Free users can only add 1 exercise to HEP. Upgrade to Pro for unlimited exercises.');
        return;
      }

      const updatedExercises = [...selectedExercises, exercise];
      setSelectedExercises(updatedExercises);
      toast.success(`${exercise.title || exercise.name} added to HEP`);
    } else {
      toast.info('Exercise already in your HEP');
    }
  };

  // Function to remove an exercise from the HEP
  const removeExerciseFromHEP = (exerciseId) => {
    setSelectedExercises(selectedExercises.filter(
      exercise => exercise.id !== exerciseId && exercise._id !== exerciseId
    ));
  };

  // Function to clear all exercises
  const clearExercises = () => {
    setSelectedExercises([]);
    toast.info('HEP cleared');
  };

  return (
    <div className="flex-1 bg-gray-900 text-white pb-16">    
      <ExerciseGallery 
        addExerciseToHEP={addExerciseToHEP} 
        isProUser={isProUser}
        selectedExercises={selectedExercises}
      />
      <ExerciseFooter 
        selectedExercises={selectedExercises} 
        removeExercise={removeExerciseFromHEP} 
        clearExercises={clearExercises} 
      />
    </div>
  );
};

export default ExercisesPage; 