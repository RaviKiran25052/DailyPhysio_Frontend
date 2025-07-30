import React from 'react';
import { Users, Award, Trophy, Medal } from 'lucide-react';

const TrustedBy = () => {
  return (
    <div className="bg-primary-600 relative overflow-hidden">
      {/* Gradient colors only on left and right sides of background */}
      <div className="absolute w-full h-full inset-0">
        {/* Left side gradient */}
        <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-primary-400 to-transparent"></div>
        {/* Right side gradient */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary-400 to-transparent"></div>
      </div>
      
      <div className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl text-center font-bold mb-12 text-white">
            Trusted by 25,000+ patients, clinics and organizations of all sizes
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 p-4 rounded-full mb-3 border border-primary-500/30 shadow-lg relative">
                <Users className="h-6 w-6 text-primary-400" />
              </div>
              <p className="text-xl font-bold text-white">25,000+</p>
              <p className="text-gray-300">Active Users</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 p-4 rounded-full mb-3 border border-primary-500/30 shadow-lg relative">
                <Trophy className="h-6 w-6 text-primary-400" />
              </div>
              <p className="text-xl font-bold text-white">500+</p>
              <p className="text-gray-300">Certified Programs</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 p-4 rounded-full mb-3 border border-primary-500/30 shadow-lg relative">
                <Award className="h-6 w-6 text-primary-400" />
              </div>
              <p className="text-xl font-bold text-white">100%</p>
              <p className="text-gray-300">Expert Approved</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 p-4 rounded-full mb-3 border border-primary-500/30 shadow-lg relative">
                <Medal className="h-6 w-6 text-primary-400" />
              </div>
              <p className="text-xl font-bold text-white">9000+</p>
              <p className="text-gray-300">Success Stories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;