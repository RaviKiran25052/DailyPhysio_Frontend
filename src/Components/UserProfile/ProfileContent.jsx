import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PersonalInfo from './ProfileSections/PersonalInfo';
import MyExercises from './ProfileSections/MyExercises';
import MyRoutines from './ProfileSections/MyRoutines';
import MyFavorites from './ProfileSections/MyFavorites';
import Following from './ProfileSections/Following';
import AccountSettings from './ProfileSections/AccountSettings';

const ProfileContent = ({ userData, updateUserData }) => {
  return (
    <div className="flex-1 bg-gray-900 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <Routes>
          <Route path="/" element={<Navigate to="info" replace />} />
          <Route 
            path="info" 
            element={<PersonalInfo userData={userData} updateUserData={updateUserData} />} 
          />
          <Route 
            path="exercises" 
            element={<MyExercises userData={userData} />} 
          />
          <Route 
            path="routines" 
            element={<MyRoutines userData={userData} />} 
          />
          <Route 
            path="favorites" 
            element={<MyFavorites userData={userData} />} 
          />
          <Route 
            path="following" 
            element={<Following userData={userData} />} 
          />
          <Route 
            path="settings" 
            element={<AccountSettings userData={userData} updateUserData={updateUserData} />} 
          />
        </Routes>
      </div>
    </div>
  );
};

export default ProfileContent; 