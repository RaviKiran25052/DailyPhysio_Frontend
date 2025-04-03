import React from 'react';
import { Users, Award, Trophy, Medal } from 'lucide-react';

const TrustedBy = () => {
  return (
    <div className="bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl text-center font-bold mb-12">
          Trusted by 25,000+ patients, clinics and organizations of all sizes
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-gray-700 p-4 rounded-full mb-3">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-xl font-bold">25,000+</p>
            <p className="text-gray-400">Active Users</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gray-700 p-4 rounded-full mb-3">
              <Trophy className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-xl font-bold">500+</p>
            <p className="text-gray-400">Certified Programs</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gray-700 p-4 rounded-full mb-3">
              <Award className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-xl font-bold">100%</p>
            <p className="text-gray-400">Expert Approved</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gray-700 p-4 rounded-full mb-3">
              <Medal className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-xl font-bold">9000+</p>
            <p className="text-gray-400">Success Stories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;