import React from 'react';
import { 
  FaUser, 
  FaDumbbell, 
  FaUserMd, 
  FaEllipsisH 
} from 'react-icons/fa';

const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'user':
      return (
        <div className="bg-blue-900 p-2 rounded-full">
          <FaUser className="text-blue-400" />
        </div>
      );
    case 'exercise':
      return (
        <div className="bg-purple-900 p-2 rounded-full">
          <FaDumbbell className="text-purple-400" />
        </div>
      );
    case 'therapist':
      return (
        <div className="bg-green-900 p-2 rounded-full">
          <FaUserMd className="text-green-400" />
        </div>
      );
    default:
      return null;
  }
};

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8 border border-gray-700">
      <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-300">Recent Activity</h3>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="divide-y divide-gray-700">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-4 flex items-start">
            <ActivityIcon type={activity.type} />
            
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-200">{activity.action}</p>
              <p className="text-sm text-gray-400">
                {activity.name}
                {activity.user && <span> by {activity.user}</span>}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
            
            <button className="text-gray-400 hover:text-gray-300">
              <FaEllipsisH />
            </button>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="px-6 py-4 text-center text-gray-400">
          No recent activity
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
