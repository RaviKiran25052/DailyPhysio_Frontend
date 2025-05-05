import React from 'react';
import { 
  FaUsers, 
  FaDumbbell, 
  FaUserMd, 
  FaUserCheck, 
  FaCheckCircle, 
  FaUserPlus 
} from 'react-icons/fa';

const StatCard = ({ title, value, icon, color, percentChange }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`rounded-full p-3 ${color}`}>
            {icon}
          </div>
          <div className="ml-5">
            <h3 className="text-gray-400 text-sm uppercase font-semibold">{title}</h3>
            <div className="flex items-end">
              <span className="text-2xl font-bold text-white">{value}</span>
              {percentChange && (
                <span className={`ml-2 text-sm font-medium ${percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {percentChange >= 0 ? '+' : ''}{percentChange}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`h-1 ${color}`}></div>
    </div>
  );
};

const StatisticsCards = ({ stats }) => {
  // Mock percentage changes - in a real app, these would come from the backend
  const mockChanges = {
    users: 12.5,
    exercises: 8.3,
    therapists: 5.2,
    activeUsers: 15.7,
    completedExercises: -3.2,
    newUsers: 22.1
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="Total Users" 
        value={stats.users} 
        icon={<FaUsers className="text-white text-xl" />} 
        color="bg-blue-600" 
        percentChange={mockChanges.users}
      />
      
      <StatCard 
        title="Total Exercises" 
        value={stats.exercises} 
        icon={<FaDumbbell className="text-white text-xl" />} 
        color="bg-purple-600" 
        percentChange={mockChanges.exercises}
      />
      
      <StatCard 
        title="Therapists" 
        value={stats.therapists} 
        icon={<FaUserMd className="text-white text-xl" />} 
        color="bg-green-600" 
        percentChange={mockChanges.therapists}
      />
      
      <StatCard 
        title="Active Users" 
        value={stats.activeUsers} 
        icon={<FaUserCheck className="text-white text-xl" />} 
        color="bg-yellow-600" 
        percentChange={mockChanges.activeUsers}
      />
      
      <StatCard 
        title="Completed Exercises" 
        value={stats.completedExercises} 
        icon={<FaCheckCircle className="text-white text-xl" />} 
        color="bg-red-600" 
        percentChange={mockChanges.completedExercises}
      />
      
      <StatCard 
        title="New Users This Month" 
        value={stats.newUsersThisMonth} 
        icon={<FaUserPlus className="text-white text-xl" />} 
        color="bg-indigo-600" 
        percentChange={mockChanges.newUsers}
      />
    </div>
  );
};

export default StatisticsCards;
