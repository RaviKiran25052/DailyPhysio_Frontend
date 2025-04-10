import React, { useState } from 'react';
import { FaUsers, FaCheckCircle, FaUserMinus } from 'react-icons/fa';

const Following = () => {
  // Mock data for following
  const [following, setFollowing] = useState([
    { id: 1, name: "Dr. Jane Smith", role: "Physical Therapist", avatar: null, isVerified: true, followedDate: "2 months ago" },
    { id: 2, name: "Dr. Robert Johnson", role: "Orthopedic Surgeon", avatar: null, isVerified: true, followedDate: "3 weeks ago" },
    { id: 3, name: "Amy Williams", role: "Athletic Trainer", avatar: null, isVerified: false, followedDate: "1 week ago" }
  ]);
  
  const unfollowUser = (id) => {
    setFollowing(prev => prev.filter(user => user.id !== id));
  };
  
  return (
    <div className="bg-gray-800 shadow-lg overflow-hidden">
      {/* Page Title */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          Following
        </h1>
      </div>

      {/* Single Tab */}
      <div className="flex border-b border-gray-700">
        <div className="flex-1 py-3 px-4 text-center text-blue-400 border-b-2 border-blue-500">
          People You Follow
        </div>
      </div>

      {/* Following List */}
      <div className="p-6">
        {following.length > 0 ? (
          <div className="grid gap-4">
            {following.map(user => (
              <div key={user.id} className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center text-white text-xl font-bold mr-4">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-white">{user.name}</h3>
                        {user.isVerified && (
                          <FaCheckCircle className="ml-2 text-purple-400" size={14} />
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{user.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-4">Following since {user.followedDate}</span>
                    <button 
                      onClick={() => unfollowUser(user.id)}
                      className="p-1.5 rounded-full text-gray-400 hover:bg-red-600 hover:text-white transition"
                      title="Unfollow"
                    >
                      <FaUserMinus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-red-500 italic mb-6">You're not following anyone yet</p>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
              Find People to Follow
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Following; 