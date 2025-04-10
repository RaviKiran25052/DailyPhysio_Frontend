import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeLayout from './Components/Layout/HomeLayout';
import ExercisesPage from './Pages/ExercisesPage';
import ExerciseDetailPage from './Pages/ExerciseDetailPage';
import UserProfilePage from './Pages/UserProfilePage';
import { ExerciseProvider } from './context/ExerciseContext';

function App() {
  return (
    <ExerciseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomeLayout />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/mystuff" element={<UserProfilePage />} />
          <Route path="/routines" element={<UserProfilePage />} />
          <Route path="/myexercises" element={<UserProfilePage />} />
          <Route path="/favorites" element={<UserProfilePage />} />
          <Route path="/following" element={<UserProfilePage />} />
          <Route path="/create" element={<UserProfilePage />} />
          <Route path="/settings" element={<UserProfilePage />} />
        </Routes>
      </Router>
    </ExerciseProvider>
  );
}

export default App;