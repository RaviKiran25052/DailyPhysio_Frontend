import React from 'react';
import { Users, Award, Trophy, Medal } from 'lucide-react';

const TrustedBy = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900/60 to-gray-900 relative overflow-hidden">
      {/* Additional purple gradients for depth */}
      <div className="absolute w-full h-full inset-0">
        <div className="absolute top-10 right-20 w-80 h-80 bg-purple-600/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-indigo-700/30 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl text-center font-bold mb-12 text-white">
            Trusted by 25,000+ patients, clinics and organizations of all sizes
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-purple-900/50 backdrop-blur-sm p-4 rounded-full mb-3 border border-purple-500/30 shadow-lg shadow-purple-500/20">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-xl font-bold text-white">25,000+</p>
              <p className="text-gray-300">Active Users</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-purple-900/50 backdrop-blur-sm p-4 rounded-full mb-3 border border-purple-500/30 shadow-lg shadow-purple-500/20">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-xl font-bold text-white">500+</p>
              <p className="text-gray-300">Certified Programs</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-purple-900/50 backdrop-blur-sm p-4 rounded-full mb-3 border border-purple-500/30 shadow-lg shadow-purple-500/20">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-xl font-bold text-white">100%</p>
              <p className="text-gray-300">Expert Approved</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-purple-900/50 backdrop-blur-sm p-4 rounded-full mb-3 border border-purple-500/30 shadow-lg shadow-purple-500/20">
                <Medal className="h-6 w-6 text-purple-400" />
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