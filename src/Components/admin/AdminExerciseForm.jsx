import React, { useState, useEffect } from 'react';
import { FaImage, FaVideo } from 'react-icons/fa';

const AdminExerciseForm = ({ exercise, isEdit, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    position: '',
    image: null,
    video: null,
    imagePreview: '',
    videoPreview: ''
  });

  useEffect(() => {
    if (isEdit && exercise) {
      setFormData({
        name: exercise.name || '',
        description: exercise.description || '',
        category: exercise.category || '',
        position: exercise.position || '',
        image: null,
        video: null,
        imagePreview: exercise.imageUrl || '',
        videoPreview: exercise.videoUrl || ''
      });
    }
  }, [isEdit, exercise]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setFormData({
        ...formData,
        [name]: file,
        [`${name}Preview`]: previewUrl
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for saving
    const exerciseData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      position: formData.position,
      imageUrl: formData.imagePreview,
      videoUrl: formData.videoPreview
    };
    
    // Pass the data back to parent component
    onSave(exerciseData, isEdit);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-purple-400 mb-2">
            Exercise Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-purple-400 mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              placeholder="Enter category (e.g. Strength, Flexibility)"
              className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-purple-400 mb-2">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleFormChange}
              placeholder="Enter position (e.g. Standing, Seated)"
              className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-purple-400 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleFormChange}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-purple-400 mb-2">
              Exercise Image
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="image"
                className="px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-purple-400 bg-gray-700 hover:bg-gray-600 cursor-pointer flex items-center"
              >
                <FaImage className="mr-2" />
                {formData.image ? 'Change Image' : 'Upload Image'}
              </label>
            </div>
            
            {formData.imagePreview && (
              <div className="mt-4 relative">
                <img 
                  src={formData.imagePreview} 
                  alt="Exercise preview" 
                  className="max-h-48 rounded-md"
                />
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="video" className="block text-sm font-medium text-purple-400 mb-2">
              Exercise Video
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="video"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="video"
                className="px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-purple-400 bg-gray-700 hover:bg-gray-600 cursor-pointer flex items-center"
              >
                <FaVideo className="mr-2" />
                {formData.video ? 'Change Video' : 'Upload Video'}
              </label>
            </div>
            
            {formData.videoPreview && (
              <div className="mt-4">
                <video 
                  src={formData.videoPreview} 
                  controls 
                  className="max-h-48 rounded-md"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isEdit ? 'Update Exercise' : 'Create Exercise'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminExerciseForm;