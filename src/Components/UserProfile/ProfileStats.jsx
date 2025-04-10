import React from 'react';
import { format } from 'date-fns';

const ProfileStats = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Activity Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-white">{stats.exercises}</p>
            <p className="text-sm text-gray-400">Exercises</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-white">{stats.protocols}</p>
            <p className="text-sm text-gray-400">Protocols</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-white">{stats.patients}</p>
            <p className="text-sm text-gray-400">Patients</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-white">{stats.favorites}</p>
            <p className="text-sm text-gray-400">Favorites</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-400">Recent Activity</h2>
          <button className="text-sm text-purple-400 hover:text-purple-300 transition">View All</button>
        </div>
        
        <div className="space-y-4">
          {stats.recentActivity.map((activity) => (
            <div 
              key={activity.id} 
              className="flex justify-between items-center p-3 bg-gray-900 rounded-lg hover:bg-gray-850 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-400">{activity.date}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M3 10a7 7 0 1114 0 7 7 0 01-14 0zm7-8a8 8 0 100 16 8 8 0 000-16z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Usage and Goals */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Platform Insights</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-300">Monthly Exercise Goal</span>
              <span className="text-sm text-gray-300">75%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-300">Patient Engagement</span>
              <span className="text-sm text-gray-300">60%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-300">Protocol Completions</span>
              <span className="text-sm text-gray-300">40%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats; 