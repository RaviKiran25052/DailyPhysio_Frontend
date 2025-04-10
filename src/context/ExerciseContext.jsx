import React, { createContext, useContext, useState, useEffect } from 'react';

const ExerciseContext = createContext();

export const useExerciseContext = () => {
  return useContext(ExerciseContext);
};

export const ExerciseProvider = ({ children }) => {
  // Get saved exercises from sessionStorage or set empty array
  const [selectedExercises, setSelectedExercises] = useState(() => {
    const saved = sessionStorage.getItem('selectedExercises');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Save to sessionStorage whenever selectedExercises changes
  useEffect(() => {
    sessionStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));
  }, [selectedExercises]);

  // Add an exercise to the selected list
  const addExercise = (exercise) => {
    // Check if exercise is already in the list
    if (!selectedExercises.some(ex => ex.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  // Remove an exercise from the selected list
  const removeExercise = (exerciseId) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== exerciseId));
  };

  // Clear all selected exercises
  const clearExercises = () => {
    setSelectedExercises([]);
  };

  // Set active tab (for the footer)
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ExerciseContext.Provider
      value={{
        selectedExercises,
        addExercise,
        removeExercise,
        clearExercises,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseContext; 