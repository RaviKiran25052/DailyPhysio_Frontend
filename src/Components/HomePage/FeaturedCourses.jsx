import React from 'react';

const courseData = [
  {
    id: 1,
    title: 'Knee Rehabilitation',
    category: 'Rehabilitation',
    image: '/assets/routine.jpg',
    difficulty: 'Beginner'
  },
  {
    id: 2,
    title: 'Shoulder Mobility',
    category: 'Mobility',
    image: '/assets/routine.jpg',
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    title: 'Lower Back Strength',
    category: 'Strength',
    image: '/assets/routine.jpg',
    difficulty: 'All Levels'
  },
  {
    id: 4,
    title: 'Post-Surgery Recovery',
    category: 'Rehabilitation',
    image: '/assets/routine.jpg',
    difficulty: 'Beginner'
  },
  {
    id: 5,
    title: 'Balance & Coordination',
    category: 'Functional',
    image: '/assets/routine.jpg',
    difficulty: 'Intermediate'
  },
  {
    id: 6,
    title: 'Sports Injury Prevention',
    category: 'Prevention',
    image: '/assets/routine.jpg',
    difficulty: 'Advanced'
  },
  {
    id: 7,
    title: 'Neck Pain Relief',
    category: 'Pain Management',
    image: '/assets/routine.jpg',
    difficulty: 'All Levels'
  },
  {
    id: 8,
    title: 'Full Body Conditioning',
    category: 'Conditioning',
    image: '/assets/routine.jpg',
    difficulty: 'Intermediate'
  },
];

const CourseCard = ({ course }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 transition">
      <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <span className="text-xs text-purple-400 font-medium">{course.category}</span>
        <h3 className="text-lg font-medium mt-1 text-white">{course.title}</h3>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-gray-400">{course.difficulty}</span>
          <button className="bg-purple-600 hover:bg-purple-700 transition text-white text-sm py-1 px-3 rounded">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedCourses = () => {
  return (
    <div className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Exercise Programs</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courseData.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourses;