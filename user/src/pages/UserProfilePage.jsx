import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import ProfileInfo from '../components/Profile/ProfileInfo';
import MyExercises from '../components/Profile/MyExercises';
import MyFavorites from '../components/Profile/MyFavorites';
import MyRoutines from '../components/Profile/MyRoutines';
import Following from '../components/Profile/Following';
import axios from 'axios';
import HandleExercise from '../components/Exercises/HandleExercise';
import MembershipManagement from '../components/Profile/MembershipManagement';
import { User, Dumbbell, Heart, Users, Crown, ChevronLeft, ChevronRight, BriefcaseMedical } from 'lucide-react';
import ConsultedExercises from '../components/Profile/ConsultedExercises';

const API_URL = process.env.REACT_APP_API_URL;

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef(null);

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
      case 'consultation':
        return <ConsultedExercises />;
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
      { id: 'consultation', icon: <BriefcaseMedical size={20} />, label: 'Consulted' },
      { id: 'membership', icon: <Crown size={20} />, label: 'Membership' }
    ];

    const scroll = (direction) => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollAmount = direction === 'left' ? -100 : 100;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

    return (
      <div className="bg-gray-800 rounded-lg mb-4 relative">
        {/* Left arrow button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 text-gray-300 p-1 rounded-r-md z-10 hover:bg-gray-600"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Tabs container */}
        <div
          ref={scrollContainerRef}
          className="flex justify-between overflow-hidden mx-8 scroll-smooth"
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-4 flex-shrink-0 ${activeTab === tab.id
                  ? 'text-purple-500 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-300'
                }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right arrow button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 text-gray-300 p-1 rounded-l-md z-10 hover:bg-gray-600"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
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