import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MyRoutines from './MyRoutines';

// Sample data for demonstration
const sampleRoutines = [
  {
    _id: "681c77ad62baa5cf7f4c4196",
    name: "Ankle Dorsiflexion with Band",
    reps: 6,
    hold: 1,
    complete: 1,
    perform: {
      count: 1,
      type: "week"
    },
    updatedAt: new Date().toISOString(),
    exercise: {
      _id: "681b812cd542c4b4a66fd51d",
      title: "Ankle Dorsiflexion with Band",
      description: "Strengthens the anterior tibialis muscle and improves ankle mobility",
      instruction: "Sit with legs extended. Loop resistance band around the top of your foot, holding the ends. Pull toes toward shin against resistance, then slowly return to starting position.",
      video: null,
      image: [
        "https://picsum.photos/400/200",
        "https://res.cloudinary.com/dpzyuwcgn/image/upload/v1746869826/hep2go/images/f1ipj2vh8u38tgmuglzt.png"
      ],
      views: 45,
      favorites: 1,
      category: "Ankle and Foot",
      subCategory: "Elastic Band",
      position: "Sitting",
      isPremium: false,
      custom: {
        createdBy: "therapist",
        type: "public",
        creatorId: "680be0413ae24b5bb123c3a1"
      }
    }
  }
];

// This component is for demonstration purposes only
const PrintDemo = () => {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Routines Print Demo</h1>
          <p className="mb-6">
            This page demonstrates printing functionality:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>A "Print All" button next to the title to print all routines</li>
            <li>Individual "Print" buttons for each routine</li>
            <li>Printed pages include all routine data, descriptions, and images</li>
          </ul>
          <div className="mt-8">
            <MyRoutines user={{ _id: "user123" }} />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default PrintDemo;

// To test this functionality, you would replace the original data fetching with sample data:
// In MyRoutines.jsx, replace the fetchRoutines function with:
/*
const fetchRoutines = async () => {
  try {
    // Use sample data for demonstration
    setRoutines(sampleRoutines);
  } catch (error) {
    console.error('Error fetching routines:', error);
    toast.error('Failed to load routines');
  } finally {
    setLoading(false);
  }
};
*/ 