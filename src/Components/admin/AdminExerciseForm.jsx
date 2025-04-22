import React, { useState, useEffect } from 'react';
import { FaImage, FaVideo } from 'react-icons/fa';

const AdminExerciseForm = ({ exercise, isEdit, onSave, adminToken }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instruction: '',
    category: '',
    subCategory: '',
    position: '',
    image: null,
    video: null,
    imagePreview: '',
    videoPreview: '',
    isPremium: false,
    isCustom: true
  });

  // Available categories
  const categories = [
    'Ankle and Foot',
    'Cervical',
    'Education',
    'Elbow and Hand',
    'Hip and Knee',
    'Lumbar Thoracic',
    'Oral Motor',
    'Shoulder',
    'Special'
  ];

  // Mapping of category to subcategories
  const subCategoryMap = {
    'Ankle and Foot': ['AAROM', 'AROM', 'Ball', 'Bosu', 'Elastic Band', 'Elastic Taping', 'Isometric',
      'Miscellaneous', 'Mobilization', 'PROM', 'Stabilization', 'Stretches'],
    'Cervical': ['AAROM', 'AROM', 'Ball', 'Elastic Band', 'Isometric', 'Miscellaneous', 'Mobilization',
      'PROM', 'Stabilization', 'Stretches'],
    'Education': ['Anatomy', 'Body Mechanics', 'Gait Training', 'Miscellaneous', 'Positioning',
      'Stair Training', 'Transfers'],
    'Elbow and Hand': ['AAROM', 'AROM', 'Ball', 'Closed Chain', 'Elastic Band', 'Elastic Taping',
      'Fine Motor', 'Flexbar', 'Free Weight', 'Gripper', 'Isometric', 'Machines and Cables',
      'Miscellaneous', 'Mobilization', 'PROM', 'Putty', 'Stretches', 'TRX'],
    'Hip and Knee': ['4 Way Hip', 'AAROM', 'AROM', 'Balance', 'Ball', 'Bosu', 'Boxes and Steps',
      'Closed Chain', 'Cones', 'Elastic Band', 'Elastic Taping', 'Foam Roll', 'Free Weight',
      'Glider Disk', 'Isometric', 'Kettlebell', 'Ladder Drills', 'Machines and Cables',
      'Medicine Ball', 'Miscellaneous', 'Mobilization', 'Neural Glides', 'Open Chain',
      'Plyometrics', 'PROM', 'Stretches', 'TRX'],
    'Lumbar Thoracic': ['AROM', 'Ball', 'Bosu', 'Elastic Band', 'Elastic Taping', 'Foam Roll',
      'Free Weight', 'Glider Disk', 'Kettlebell', 'Machines and Cables', 'Medicine Ball',
      'Miscellaneous', 'Mobilization', 'Stabilization', 'Stretches', 'Traction', 'TRX'],
    'Oral Motor': ['Cheeks', 'Lips', 'Miscellaneous', 'Speech', 'Swallow', 'TMJ', 'Tongue'],
    'Shoulder': ['6 Way Shoulder', 'AAROM', 'AROM', 'Ball', 'Bosu', 'Elastic Band', 'Elastic Taping',
      'Foam Roll', 'Free Weight', 'Glider Disk', 'Isometric', 'Kettlebell', 'Machines and Cables',
      'Medicine Ball', 'Miscellaneous', 'Mobilization', 'Neural Glides', 'Pendulum', 'PROM',
      'Pulley', 'Stabilization', 'Stretches', 'TRX', 'Wand'],
    'Special': ['Amputee', 'Aquatics', 'Cardio', 'Miscellaneous', 'Modalities', 'Neuro', 'Oculomotor',
      'Pediatric', 'Vestibular', 'Yoga']
  };

  // Positions list
  const positions = ["Kneeling", "Prone", "Quadruped", "Side Lying", "Sitting", "Standing", "Supine"];

  useEffect(() => {
    if (isEdit && exercise) {
      setFormData({
        title: exercise.title || '',
        description: exercise.description || '',
        instruction: exercise.instruction || '',
        category: exercise.category || '',
        subCategory: exercise.subCategory || '',
        position: exercise.position || '',
        image: null,
        video: null,
        imagePreview: exercise.image || '',
        videoPreview: exercise.video || '',
        isPremium: exercise.isPremium || false,
        isCustom: true
      });
    }
  }, [isEdit, exercise]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });

      // If category changed, reset subCategory
      if (name === 'category') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          subCategory: ''
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      // Create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      
      // In a real application, you would upload the file to a server/storage
      // and then update the form with the URL returned from the server
      // For now, we'll just use the preview URL as a placeholder
      
      // Example of how this could work with a file upload API:
      // const formData = new FormData();
      // formData.append('file', file);
      // 
      // try {
      //   const response = await axios.post(`${API_URL}/upload`, formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //       Authorization: `Bearer ${adminToken}`
      //     }
      //   });
      //   
      //   setFormData({
      //     ...formData,
      //     [name === 'image' ? 'image' : 'video']: response.data.fileUrl,
      //     [`${name}Preview`]: response.data.fileUrl
      //   });
      // } catch (error) {
      //   console.error('Error uploading file:', error);
      // }
      
      // For now, we just update the preview
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
      title: formData.title,
      description: formData.description,
      instruction: formData.instruction,
      category: formData.category,
      subCategory: formData.subCategory,
      position: formData.position,
      image: formData.imagePreview,
      video: formData.videoPreview,
      isPremium: formData.isPremium,
      isCustom: formData.isCustom
    };
    
    // Pass the data back to parent component
    onSave(exerciseData, isEdit);
  };

  // Get available subcategories based on selected category
  const availableSubCategories = formData.category ? subCategoryMap[formData.category] || [] : [];

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-purple-400 mb-2">
            Exercise Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-purple-400 mb-2">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium text-purple-400 mb-2">
              Sub-Category*
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleFormChange}
              required
              disabled={!formData.category}
              className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <option value="">Select a sub-category</option>
              {availableSubCategories.map(subCategory => (
                <option key={subCategory} value={subCategory}>{subCategory}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="position" className="block text-sm font-medium text-purple-400 mb-2">
            Position*
          </label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleFormChange}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option value="">Select a position</option>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-purple-400 mb-2">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleFormChange}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="instruction" className="block text-sm font-medium text-purple-400 mb-2">
            Instructions*
          </label>
          <textarea
            id="instruction"
            name="instruction"
            rows="4"
            value={formData.instruction}
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

        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPremium"
              name="isPremium"
              checked={formData.isPremium}
              onChange={handleFormChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isPremium" className="ml-2 block text-sm font-medium text-purple-400">
              Premium Exercise (Only available to PRO users)
            </label>
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