import React from 'react';
import Navbar from '../HomePage/Navbar';
import Hero from '../HomePage/Hero';
import FeaturedCourses from '../HomePage/FeaturedCourses';
import TrustedBy from '../HomePage/TrustedBy';
import CallToAction from '../HomePage/CallToAction';
import PopularClasses from '../HomePage/PopularClasses';
import Footer from '../HomePage/Footer';

const HomeLayout = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedCourses />
      <TrustedBy />
      <CallToAction />
      <PopularClasses />
      <Footer />
    </div>
  );
};

export default HomeLayout; 