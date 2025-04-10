import React from 'react';
import { format, formatDistance } from 'date-fns';

const UserActivity = ({ activities = [] }) => {
  // Function to get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'exercise_created':
        return (
          <div className="h-8 w-8 rounded-full bg-green-900 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'exercise_edited':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        );
      case 'patient_assigned':
        return (
          <div className="h-8 w-8 rounded-full bg-yellow-800 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
        );
      case 'exercise_shared':
        return (
          <div className="h-8 w-8 rounded-full bg-purple-800 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 text-white">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <p className="text-gray-400">No recent activity to display.</p>
      ) : (
        <div className="divide-y divide-gray-800">
          {activities.map((activity) => (
            <div key={activity.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start">
                {getActivityIcon(activity.type)}
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-white">{activity.title}</h3>
                    <span className="text-sm text-gray-400">
                      {formatDistance(activity.date, new Date(), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1">{activity.description}</p>
                  
                  {activity.relatedItems && activity.relatedItems.length > 0 && (
                    <div className="flex mt-2 flex-wrap">
                      {activity.relatedItems.map((item, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-purple-300 mr-2 mb-2"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {format(activity.date, 'MMMM d, yyyy - h:mm a')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activities.length > 0 && (
        <div className="mt-4 text-center">
          <button className="px-4 py-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default UserActivity; 