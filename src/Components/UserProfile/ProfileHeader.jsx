import React from 'react';

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-purple-900 text-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex flex-col md:flex-row items-center">
        {/* User Avatar */}
        <div className="w-24 h-24 bg-purple-700 rounded-full flex items-center justify-center mb-4 md:mb-0 mr-0 md:mr-6">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={`${user.name}'s avatar`} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{user?.name || "User Name"}</h1>
          <p className="text-purple-300 mb-2">{user?.title || "Physical Therapist"}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
            {user?.location && (
              <div className="flex items-center text-sm text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {user.location}
              </div>
            )}
            
            {user?.organization && (
              <div className="flex items-center text-sm text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {user.organization}
              </div>
            )}
            
            {user?.memberSince && (
              <div className="flex items-center text-sm text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Member since {user.memberSince}
              </div>
            )}
          </div>

          <p className="text-gray-300 text-sm mb-4 max-w-2xl">
            {user?.bio || "No bio available"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-6">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Edit Profile
          </button>
          <button className="bg-transparent border border-purple-500 hover:bg-purple-900 text-purple-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Share Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 