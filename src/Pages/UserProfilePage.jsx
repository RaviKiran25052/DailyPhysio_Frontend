import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Profile/Sidebar';
import ProfileInfo from '../Components/Profile/ProfileInfo';
import MyExercises from '../Components/Profile/MyExercises';
import MyFavorites from '../Components/Profile/MyFavorites';
import MyRoutines from '../Components/Profile/MyRoutines';
import Following from '../Components/Profile/Following';
import axios from 'axios';
import HandleExercise from '../Components/HandleExercise';
import MembershipManagement from '../Components/Profile/MembershipManagement';
import { User, Dumbbell, Heart, Users, Crown } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({});
  const [isMobile, setIsMobile] = useState(false);

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

    // Check if mobile view
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
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
      case 'membership':
        return <MembershipManagement />;
      default:
        return <ProfileInfo />;
    }
  };

  // Mobile horizontal tabs
  const MobileTabBar = () => {
    const tabs = [
      { id: 'profile', icon: <User size={20} />, label: 'Profile' },
      { id: 'routines', icon: <Dumbbell size={20} />, label: 'Routines' },
      { id: 'favorites', icon: <Heart size={20} />, label: 'Favorites' },
      { id: 'following', icon: <Users size={20} />, label: 'Following' },
      { id: 'membership', icon: <Crown size={20} />, label: 'Membership' }
    ];

    return (
      <div className="bg-gray-800 rounded-lg mb-4 overflow-x-auto">
        <div className="flex justify-between min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-4 ${
                activeTab === tab.id 
                  ? 'text-purple-500 border-b-2 border-purple-500' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Tabs - Show only on mobile */}
          {isMobile && <MobileTabBar />}
          
          {/* Desktop Sidebar - Hide on mobile */}
          {!isMobile && (
            <div className="lg:w-1/4 md:sticky top-20 h-fit">
              <Sidebar
                userData={userData}
                currentPath={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          )}

          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 