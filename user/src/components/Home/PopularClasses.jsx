import React from 'react';
import { Thermometer, Activity, Heart, Rocket, ChevronRight, Database, MonitorSmartphone } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="p-5 hover:bg-gray-800 rounded-lg transition">
      <div className="bg-purple-600/20 p-3 rounded-lg inline-block mb-3">
        <Icon className="h-6 w-6 text-purple-500" />
      </div>
      <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-2">{description}</p>
    </div>
  );
};

const PopularClasses = () => {
  const features = [
    {
      icon: Thermometer,
      title: "Recovery Programs",
      description: "Post-surgery and injury-specific recovery programs designed by orthopedic specialists."
    },
    {
      icon: Activity,
      title: "Pain Management",
      description: "Targeted exercises for chronic pain relief and long-term management strategies."
    },
    {
      icon: Heart,
      title: "Mobility Improvement",
      description: "Programs to increase your range of motion and improve daily function."
    },
    {
      icon: Database,
      title: "Progress Tracking",
      description: "Track your improvement over time with detailed analytics and progress reports."
    },
    {
      icon: Rocket,
      title: "Performance Enhancement",
      description: "Take your physical capabilities to the next level with advanced programs."
    },
    {
      icon: MonitorSmartphone,
      title: "Anywhere, Anytime",
      description: "Access your exercises on any device, whether at home or on the go."
    }
  ];

  return (
    <div className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-white">Our Popular Programs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularClasses;