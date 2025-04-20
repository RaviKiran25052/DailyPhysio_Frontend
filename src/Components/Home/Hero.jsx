import React from 'react';

const Hero = () => {

  return (
    <div className="bg-gray-900 relative overflow-hidden">
      {/* Purple gradient focused at top center */}
      <div className="absolute w-full h-full inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center relative z-10">
        {/* Left Content */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <p className="text-purple-400 uppercase tracking-wider mb-3 font-medium">ExerciseMD PRO is Coming!</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Unlock Your Full <span className="text-purple-500">Physical</span> Potential with ExerciseMD
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Access professional exercise programs designed by orthopedic experts.
            Recover better, move better, feel better.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              // onClick={handleGetStarted}
              className="px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 transition text-white font-medium"
            >
              Get Started
            </button>
            <button 
              // onClick={handleViewExercises}
              className="px-6 py-3 border border-purple-600 rounded-md hover:bg-purple-600/10 transition text-white font-medium"
            >
              View Exercises
            </button>
          </div>
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