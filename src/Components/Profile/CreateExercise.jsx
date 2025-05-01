import { Cross, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { FiSave, FiPlusCircle, FiX, FiCheck, FiVideo, FiImage, FiTag, FiList } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateExercise() {
	const [exercise, setExercise] = useState({
		title: '',
		description: '',
		instruction: '',
		videos: [],
		images: [],
		reps: 0,
		hold: 0,
		set: 0,
		perform: {
			count: 0,
			type: 'hour'
		},
		category: '',
		subCategory: '',
		position: '',
		customPosition: '',
		isPremium: false,
		type: 'public'
	});

	const [customPositionEnabled, setCustomPositionEnabled] = useState(false);
	const [availableSubCategories, setAvailableSubCategories] = useState([]);
	const [videoFiles, setVideoFiles] = useState([]);
	const [imageFiles, setImageFiles] = useState([]);
	const [selectedVideoPreview, setSelectedVideoPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	
	const navigate = useNavigate();

	const positions = ["Kneeling", "Prone", "Quadruped", "Side Lying", "Sitting", "Standing", "Supine"];

	const categories = [
		'Ankle and Foot', 'Cervical', 'Education', 'Elbow and Hand',
		'Hip and Knee', 'Lumbar Thoracic', 'Oral Motor', 'Shoulder', 'Special'
	];

	const validSubCategories = {
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

	// Get the token from localStorage
	const getToken = () => {
		return localStorage.getItem('token');
	};

	// Configure axios with auth headers
	const api = axios.create({
		baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
	});

	// Add auth token to requests
	api.interceptors.request.use(
		(config) => {
			const token = getToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	useEffect(() => {
		if (exercise.category) {
			setAvailableSubCategories(validSubCategories[exercise.category] || []);
			setExercise(prev => ({ ...prev, subCategory: '' }));
		}
	}, [exercise.category]);

	useEffect(() => {
		if (exercise.position === 'Other') {
			setCustomPositionEnabled(true);
		} else {
			setCustomPositionEnabled(false);
			setExercise(prev => ({ ...prev, customPosition: '' }));
		}
	}, [exercise.position]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name === 'perform.count') {
			setExercise(prev => ({
				...prev,
				perform: { ...prev.perform, count: value }
			}));
		} else if (name === 'perform.type') {
			setExercise(prev => ({
				...prev,
				perform: { ...prev.perform, type: value }
			}));
		} else {
			setExercise(prev => ({
				...prev,
				[name]: type === 'checkbox' ? checked : value
			}));
		}
	};

	const handleVideoUpload = (e) => {
		if (e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files);
			const newVideoFiles = [...videoFiles];

			newFiles.forEach(file => {
				const reader = new FileReader();
				reader.onload = () => {
					newVideoFiles.push({
						file,
						url: URL.createObjectURL(file)
					});
					setVideoFiles([...newVideoFiles]);
				};
				reader.readAsArrayBuffer(file);
			});

			setExercise(prev => ({
				...prev,
				videos: [...prev.videos, ...newFiles.map(file => file.name)]
			}));
		}
	};

	const handleImageUpload = (e) => {
		if (e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files);
			const newImageFiles = [...imageFiles];

			newFiles.forEach(file => {
				const reader = new FileReader();
				reader.onload = () => {
					newImageFiles.push({
						file,
						preview: reader.result
					});
					setImageFiles([...newImageFiles]);
				};
				reader.readAsDataURL(file);
			});

			setExercise(prev => ({
				...prev,
				images: [...prev.images, ...newFiles.map(file => file.name)]
			}));
		}
	};

	const removeVideo = (index) => {
		const newVideos = [...videoFiles];
		if (newVideos[index].url) {
			URL.revokeObjectURL(newVideos[index].url);
		}
		newVideos.splice(index, 1);
		setVideoFiles(newVideos);

		setExercise(prev => ({
			...prev,
			videos: prev.videos.filter((_, i) => i !== index)
		}));

		if (selectedVideoPreview === index) {
			setSelectedVideoPreview(null);
		}
	};

	const removeImage = (index) => {
		const newImages = [...imageFiles];
		newImages.splice(index, 1);
		setImageFiles(newImages);

		setExercise(prev => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index)
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Prepare final data with actual position value
			const finalPosition = exercise.position === 'Other' ? exercise.customPosition : exercise.position;
			
			// Create FormData object for file uploads
			const formData = new FormData();
			
			// Add exercise data as JSON string
			formData.append('title', exercise.title);
			formData.append('description', exercise.description);
			formData.append('instruction', exercise.instruction);
			formData.append('reps', exercise.reps);
			formData.append('hold', exercise.hold);
			formData.append('set', exercise.set);
			formData.append('perform[count]', exercise.perform.count);
			formData.append('perform[type]', exercise.perform.type);
			formData.append('category', exercise.category);
			formData.append('subCategory', exercise.subCategory);
			formData.append('position', finalPosition);
			formData.append('isPremium', exercise.isPremium);
			formData.append('type', exercise.type);
			
			// Add image files
			imageFiles.forEach((imageData, index) => {
				formData.append('images', imageData.file);
			});
			
			// Add video files
			videoFiles.forEach((videoData, index) => {
				formData.append('videos', videoData.file);
			});
			
			// Send data to the server
			const response = await api.post('/exercises/add', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			
			// Handle success
			console.log('Exercise created:', response.data);
			alert('Exercise created successfully!');
			
			// Redirect to exercises page or detail page
			navigate('/exercises');
			
		} catch (error) {
			console.error('Error creating exercise:', error);
			setError(error.response?.data?.message || 'Failed to create exercise. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg text-gray-200">
			<h1 className="text-3xl font-bold text-center text-purple-400 mb-8">Create New Exercise</h1>

			{error && (
				<div className="bg-red-500 text-white p-3 rounded-lg mb-6">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Info Section */}
				<div className="bg-gray-700 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
						<FiList className="mr-2" /> Basic Information
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-gray-300 font-medium mb-2" htmlFor="title">
								Title
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={exercise.title}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
								required
							/>
						</div>

						<div>
							<label className="block text-gray-300 font-medium mb-2" htmlFor="position">
								Position
							</label>
							<select
								id="position"
								name="position"
								value={exercise.position}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
								required
							>
								<option value="">Select Position</option>
								{positions.map(pos => (
									<option key={pos} value={pos}>{pos}</option>
								))}
								<option value="Other">Other</option>
							</select>
						</div>
					</div>

					{customPositionEnabled && (
						<div className="mt-4">
							<label className="block text-gray-300 font-medium mb-2" htmlFor="customPosition">
								Custom Position
							</label>
							<input
								type="text"
								id="customPosition"
								name="customPosition"
								value={exercise.customPosition}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
								required
							/>
						</div>
					)}

					<div className="mt-4">
						<label className="block text-gray-300 font-medium mb-2" htmlFor="description">
							Description
						</label>
						<textarea
							id="description"
							name="description"
							value={exercise.description}
							onChange={handleChange}
							rows="3"
							className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
							required
						/>
					</div>

					<div className="mt-4">
						<label className="block text-gray-300 font-medium mb-2" htmlFor="instruction">
							Instructions
						</label>
						<textarea
							id="instruction"
							name="instruction"
							value={exercise.instruction}
							onChange={handleChange}
							rows="5"
							className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
							required
						/>
					</div>
				</div>

				{/* Category Section */}
				<div className="bg-gray-700 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
						<FiTag className="mr-2" /> Categories
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-gray-300 font-medium mb-2" htmlFor="category">
								Category
							</label>
							<select
								id="category"
								name="category"
								value={exercise.category}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
								required
							>
								<option value="">Select Category</option>
								{categories.map((cat) => (
									<option key={cat} value={cat}>{cat}</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-gray-300 font-medium mb-2" htmlFor="subCategory">
								Sub Category
							</label>
							<select
								id="subCategory"
								name="subCategory"
								value={exercise.subCategory}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
								disabled={!exercise.category}
								required
							>
								<option value="">Select Sub Category</option>
								{availableSubCategories.map((subCat) => (
									<option key={subCat} value={subCat}>{subCat}</option>
								))}
							</select>
						</div>
					</div>

					<div className="mt-6">
						<div className="flex items-center">
							<span className="text-gray-300 font-medium mr-4">Type:</span>
							<label className="inline-flex items-center mr-6">
								<input
									type="radio"
									name="type"
									value="public"
									checked={exercise.type === "public"}
									onChange={handleChange}
									className="form-radio h-5 w-5 text-purple-600"
								/>
								<span className="ml-2 text-gray-300">Public</span>
							</label>
							<label className="inline-flex items-center">
								<input
									type="radio"
									name="type"
									value="private"
									checked={exercise.type === "private"}
									onChange={handleChange}
									className="form-radio h-5 w-5 text-purple-600"
								/>
								<span className="ml-2 text-gray-300">Private</span>
							</label>
						</div>
					</div>
					
					<div className="mt-6 flex items-center">
						<label className="flex items-center cursor-pointer">
							<span className="mr-3 text-gray-300 font-medium">Premium Exercise</span>
							<div className="relative">
								<input
									type="checkbox"
									id="isPremium"
									name="isPremium"
									checked={exercise.isPremium}
									onChange={handleChange}
									className="sr-only"
								/>
								<div className={`block w-14 h-8 rounded-full transition ${exercise.isPremium ? 'bg-purple-600' : 'bg-gray-500'}`}></div>
								<div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${exercise.isPremium ? 'translate-x-6' : ''}`}></div>
							</div>
						</label>
					</div>
				</div>

				{/* Performance Section */}
				<div className="bg-gray-700 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-purple-300 mb-4">Performance Details</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div>
							<label className="block text-gray-300 font-medium mb-2" htmlFor="perform.count">
								Perform Count
							</label>
							<input
								type="number"
								id="perform.count"
								name="perform.count"
								value={exercise.perform.count}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
							/>
						</div>

						<div>
							<label className="block text-gray-300 font-medium mb-2" htmlFor="perform.type">
								Perform Type
							</label>
							<select
								id="perform.type"
								name="perform.type"
								value={exercise.perform.type}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
							>
								<option value="hour">Hour</option>
								<option value="day">Day</option>
								<option value="week">Week</option>
							</select>
						</div>

						<div>
							<label className="block text-gray-300 font-medium mb-2" htmlFor="reps">
								Reps
							</label>
							<input
								type="number"
								id="reps"
								name="reps"
								value={exercise.reps}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
							/>
						</div>

						<div>
							<label className="block text-gray-300 font-medium mb-2" htmlFor="hold">
								Hold (seconds)
							</label>
							<input
								type="number"
								id="hold"
								name="hold"
								value={exercise.hold}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
							/>
						</div>
					</div>

					<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-gray-300 font-medium mb-2" htmlFor="set">
								Sets
							</label>
							<input
								type="number"
								id="set"
								name="set"
								value={exercise.set}
								onChange={handleChange}
								min="0"
								className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
							/>
						</div>
					</div>
				</div>

				{/* Media Section */}
				<div className="bg-gray-700 p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
						<FiVideo className="mr-2" /> Videos
					</h2>

					<div className="flex items-center">
						<label className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg cursor-pointer hover:bg-gray-500 transition">
							<FiPlusCircle className="mr-2" /> Upload Video Files
							<input
								type="file"
								accept="video/*"
								onChange={handleVideoUpload}
								multiple
								className="hidden"
							/>
						</label>
					</div>

					{selectedVideoPreview !== null && videoFiles[selectedVideoPreview] && (
						<div className="relative mt-4 bg-gray-800 p-3 rounded-lg">
							<span className='absolute top-3 right-3 p-1 bg-red-600 hover:bg-red-800 text-white rounded-lg cursor-pointer' onClick={() => setSelectedVideoPreview(null)}><X size={18} /></span>
							<h3 className="text-lg font-medium text-purple-300 mb-2">Video Preview</h3>
							<video
								controls
								className="w-full rounded-lg max-h-64"
								src={videoFiles[selectedVideoPreview].url}
							>
								Your browser does not support the video tag.
							</video>
						</div>
					)}

					<div className="mt-4 max-h-60 overflow-y-auto pr-2">
						{videoFiles.length > 0 ? (
							videoFiles.map((fileData, index) => (
								<div key={index} className="flex items-center bg-gray-600 p-3 rounded-lg mb-2">
									<FiVideo className="text-purple-400 mr-2" />
									<span
										className="flex-grow truncate text-gray-300 cursor-pointer hover:text-purple-300"
										onClick={() => setSelectedVideoPreview(index)}
									>
										{fileData.file.name}
									</span>
									<button
										type="button"
										onClick={() => removeVideo(index)}
										className="ml-2 text-red-400 hover:text-red-300 focus:outline-none"
									>
										<FiX className="inline-block" />
									</button>
								</div>
							))
						) : (
							<p className="text-gray-400 text-center py-4">No video files uploaded yet.</p>
						)}
					</div>

					<h2 className="text-xl font-semibold text-purple-300 mt-8 mb-4 flex items-center">
						<FiImage className="mr-2" /> Images
					</h2>

					<div className="flex items-center">
						<label className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg cursor-pointer hover:bg-gray-500 transition">
							<FiPlusCircle className="mr-2" /> Upload Image Files
							<input
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								multiple
								className="hidden"
							/>
						</label>
					</div>

					<div className="mt-4 overflow-x-auto pb-4 custom-scrollbar">
						<div className="flex space-x-4" style={{ minWidth: 'min-content' }}>
							{imageFiles.length > 0 ? (
								imageFiles.map((imageData, index) => (
									<div key={index} className="relative group flex-shrink-0" style={{ width: '200px' }}>
										<div className="h-40 w-full bg-gray-600 rounded-lg overflow-hidden">
											{imageData.preview ? (
												<img
													src={imageData.preview}
													alt={`Exercise image ${index + 1}`}
													className="w-full h-full object-cover"
												/>
											) : (
												<img src="/api/placeholder/400/320" alt="placeholder" className="w-full h-full object-cover" />
											)}
										</div>
										<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
											<button
												type="button"
												onClick={() => removeImage(index)}
												className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700 focus:outline-none"
											>
												<FiX className="inline-block" />
											</button>
										</div>
										<p className="mt-1 text-sm text-gray-400 truncate">{imageData.file.name}</p>
									</div>
								))
							) : (
								<div className="w-full">
									<p className="text-gray-400 text-center py-8">No image files uploaded yet.</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<button
						type="submit"
						disabled={loading}
						className={`px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						{loading ? (
							<>
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Processing...
							</>
						) : (
							<>
								<FiSave className="mr-2" /> Create Exercise
							</>
						)}
					</button>
				</div>
			</form>

			<style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
			 height: 4px;
			 width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #4B5563;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #8B5CF6;
          border-radius: 8px;
        }
      `}</style>
		</div>
	);
}