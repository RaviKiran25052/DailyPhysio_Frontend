import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Profile/Sidebar';
import ProfileInfo from '../Components/Profile/ProfileInfo';
import MyExercises from '../Components/Profile/MyExercises';
import MyFavorites from '../Components/Profile/MyFavorites';
import MyRoutines from '../Components/Profile/MyRoutines';
import Following from '../Components/Profile/Following';
import axios from 'axios';
import HandleExercise from '../Components/HandleExercise';

const API_URL = process.env.REACT_APP_API_URL;

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUserData = async () => {
      try {
        
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (apiError) {
        console.error('Error fetching profile data:', apiError);
      }
    };
    fetchUserData();
  }, []);

  // Render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo user={userData} />;
      case 'myexercises':
        return <MyExercises />;
      case 'routines':
        return <MyRoutines user={userData} />;
      case 'favorites':
        return <MyFavorites />;
      case 'following':
        return <Following />;
      case 'create':
        return <HandleExercise />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 md:sticky top-20 h-fit">
            <Sidebar
              userData={userData}
              currentPath={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 