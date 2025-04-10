import React from 'react';
import { Helmet } from 'react-helmet';
import ProfileInfo from './ProfileInfo';
import ProfileStats from './ProfileStats';

const UserProfile = () => {
  // Mock user data - in a real app this would come from an API or context
  const userData = {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joined: '2022-04-15',
    location: 'San Francisco, CA',
    specialty: 'Physical Therapy',
    organization: 'Johnson Rehabilitation Clinic',
    bio: 'Dedicated physical therapist with over 8 years of experience working with athletes and post-surgery rehabilitation. Passionate about helping patients achieve their mobility goals through customized exercise programs.'
  };

  // Mock stats data
  const statsData = {
    exercises: 42,
    protocols: 15,
    patients: 28,
    favorites: 12,
    recentActivity: [
      { id: 1, action: 'Created a new exercise protocol', date: '2023-08-12' },
      { id: 2, action: 'Added 3 exercises to favorites', date: '2023-08-10' },
      { id: 3, action: 'Updated profile information', date: '2023-08-05' },
      { id: 4, action: 'Shared protocol with patient', date: '2023-08-01' }
    ]
  };

  return (
    <>
      <Helmet>
        <title>User Profile | ExerciseMD</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">My Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ProfileInfo user={userData} />
            </div>
            
            <div className="lg:col-span-2">
              <ProfileStats stats={statsData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile; 