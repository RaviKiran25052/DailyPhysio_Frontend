import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Profile/Sidebar';
import ProfileInfo from '../Components/Profile/ProfileInfo';
import MyExercises from '../Components/Profile/MyExercises';
import MyFavorites from '../Components/Profile/MyFavorites';
import MyRoutines from '../Components/Profile/MyRoutines';
import Following from '../Components/Profile/Following';
import CreateExercise from '../Components/Profile/CreateExercise';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const UserProfilePage = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fullNameJSON = localStorage.getItem('fullName');
    
    if (!token || !fullNameJSON) {
      nav('/', { replace: true });
      return;
    }

    try {
      // Ideally, fetch the complete user profile from the backend API here
      // This would use the token to authenticate the API request
      const fetchUserData = async () => {
        try {
          // Example API call to get user data
          const parsedToken = token;
          const response = await axios.get(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${parsedToken}` }
          });
          
          if (response.status === 200) {
            // Update with real data from backend
            setUserData(response.data);
          }
        } catch (apiError) {
          console.error('Error fetching profile data:', apiError);
          // We continue with localStorage data if API fails
        }
      };

      // Uncomment to enable API fetch when ready
      fetchUserData();

    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Error loading profile data');
    }

    // Check URL parameters for any actions (like upgrade or specific tab)
    const queryParams = new URLSearchParams(location.search);
    const shouldUpgrade = queryParams.get('upgrade');
    const tab = queryParams.get('tab');
    
    if (shouldUpgrade === 'pro') {
      // Set active tab to settings
      toast.info('Welcome to your Pro membership upgrade page!');
      setActiveTab('settings');
    } else if (tab) {
      // Set the active tab based on the query parameter
      setActiveTab(tab);
    }

    // Reset scroll position when component mounts or path changes
    window.scrollTo(0, 0);
  }, [location.search]);

  // Render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo user={userData} />;
      case 'myexercises':
        return <MyExercises userData={userData} />;
      case 'routines':
        return <MyRoutines userData={userData} />;
      case 'favorites':
        return <MyFavorites userData={userData} />;
      case 'following':
        return <Following userData={userData} />;
      case 'create':
        return <CreateExercise />;
      default:
        return <ProfileInfo user={userData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 md:sticky top-24 h-fit">
            <Sidebar 
              userData={userData} 
              currentPath={activeTab} 
              setActiveTab={setActiveTab} 
            />
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