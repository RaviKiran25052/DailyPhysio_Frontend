import React from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-purple-900/50 to-gray-800 rounded-xl p-8 md:p-12">
          <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
            <img
              src="/assets/start your healing.jpg"
              alt="People exercising"
              className="rounded-lg shadow-lg"
            />
          </div>

          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-white">Start your healing journey today!</h2>
            <p className="text-gray-300 mb-6">
              Join thousands of patients who have improved their quality of life with our expert-guided exercise programs. Whether you're recovering from surgery or managing chronic pain, we have the right program for you.
            </p>
            <button onClick={() => navigate("/exercises")} className="px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 transition font-medium">
              Get Started for Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;