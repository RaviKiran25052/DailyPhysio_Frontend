import React from 'react';

const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
      {/* Left Content */}
      <div className="w-full md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Unlock Your Full <span className="text-purple-500">Physical</span> Potential with ExerciseMD
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Access professional exercise programs designed by orthopedic experts.
          Recover better, move better, feel better.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 transition text-white font-medium">
            Get Started
          </button>
          <button className="px-6 py-3 border border-purple-600 rounded-md hover:bg-purple-600/10 transition text-white font-medium">
            View Exercises
          </button>
        </div>
      </div>
      
      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end">
        <div className="relative">
          <div className="absolute -z-10 top-0 right-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
          <img 
            src="/assets/Exercise-in-Recovery.jpg" 
            alt="Person exercising" 
            className="rounded-lg shadow-xl max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;