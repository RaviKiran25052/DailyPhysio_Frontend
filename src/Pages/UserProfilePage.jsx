import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Components/UserProfile/Header';
import Sidebar from '../Components/UserProfile/Sidebar';
import ProfileInfo from '../Components/UserProfile/ProfileInfo';
import MyExercises from '../Components/UserProfile/ProfileSections/MyExercises';
import MyFavorites from '../Components/UserProfile/ProfileSections/MyFavorites';
import MyRoutines from '../Components/UserProfile/ProfileSections/MyRoutines';
import Following from '../Components/UserProfile/ProfileSections/Following';
import AccountSettings from '../Components/UserProfile/ProfileSections/AccountSettings';

const UserProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Prepare user data with the correct structure for ProfileInfo
  const [userData, setUserData] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    joined: 'January 2023',
    location: 'Boston, MA',
    role: 'Physical Therapist',
    organization: 'ExerciseMD Medical Center'
  });
  
  // Convert to the format expected by ProfileInfo
  const userForProfileInfo = {
    fullName: userData.name,
    email: userData.email,
    specialty: userData.role,
    organization: userData.organization,
    joined: userData.joined,
    location: userData.location,
    bio: 'Dedicated healthcare professional with expertise in physical therapy and rehabilitation.'
  };

  useEffect(() => {
    // Check if user is logged in by looking for data in session storage
    const loggedInUser = sessionStorage.getItem('userData');
    if (!loggedInUser) {
      // If no user data, redirect to login (or use mock data in development)
      // navigate('/login');
    }

    // Reset scroll position when component mounts or path changes
    window.scrollTo(0, 0);
  }, [location.pathname, navigate]);

  // Determine which content to render based on the current path
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/profile' || path === '/mystuff') {
      return <ProfileInfo user={userForProfileInfo} />;
    } else if (path === '/myexercises') {
      return <MyExercises userData={userData} />;
    } else if (path === '/routines') {
      return <MyRoutines userData={userData} />;
    } else if (path === '/favorites') {
      return <MyFavorites userData={userData} />;
    } else if (path === '/following') {
      return <Following userData={userData} />;
    } else if (path === '/settings') {
      return <AccountSettings userData={userData} updateUserData={setUserData} />;
    } else if (path === '/create') {
      // Just show a placeholder for create exercise without any stats
      return (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Create Exercise</h2>
          <p className="text-gray-300">Create exercise form will be implemented here.</p>
        </div>
      );
    } else {
      // Default to profile info if path doesn't match
      return <ProfileInfo user={userForProfileInfo} />;
    }
  };

  // Determine which section is active based on current path
  const getCurrentPath = () => {
    const path = location.pathname;
    if (path === '/profile' || path === '/mystuff') return 'profile';
    if (path === '/myexercises') return 'myexercises';
    if (path === '/routines') return 'routines';
    if (path === '/favorites') return 'favorites';
    if (path === '/following') return 'following';
    if (path === '/create') return 'create';
    if (path === '/settings') return 'settings';
    return 'profile';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header userData={userData} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Sidebar userData={userData} currentPath={getCurrentPath()} />
          </div>
          
          <div className="lg:w-3/4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 