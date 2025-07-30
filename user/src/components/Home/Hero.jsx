import React from 'react';

const Hero = () => {

  return (
    <div className="bg-white relative overflow-hidden">      
      <div className="container mx-auto py-16 md:py-24 px-4 md:px-20 flex flex-col md:flex-row items-center relative z-10">
        {/* Left Content */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <p className="text-primary-500 uppercase tracking-wider mb-3 font-semibold">DailyPhysio PRO is Coming!</p>
          <h1 className="text-3xl md:text-5xl font-semibold mb-6 text-gray-700">
            Unlock Your Full <span className="text-primary-500">Physical</span> Potential with DailyPhysio
          </h1>
          <p className="text-base md:text-lg text-gray-500 mb-8">
            Access professional exercise programs designed by orthopedic experts.
            Recover better, move better, feel better.
          </p>
        </div>
        
        {/* Right Image Section */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/assets/Exercise-in-Recovery.jpg" 
                alt="Exercise in Recovery" 
                className="max-w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 to-transparent"></div>
            </div>
            
            {/* Simple glow effect */}
            <div className="absolute -z-1 -inset-2 bg-purple-500/10 blur-xl rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;