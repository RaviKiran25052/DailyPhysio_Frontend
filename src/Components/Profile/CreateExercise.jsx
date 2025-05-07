import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { FiSave, FiPlusCircle, FiX, FiVideo, FiImage, FiTag, FiList, FiEdit } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_API_URL || '';

export default function ExerciseForm({ isOpen, isEdit, onClose, exercise = null, adminToken, onSuccess }) {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		instruction: '',
		video: null,
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
		customCategory: '',
		customSubCategory: '',
		customPosition: '',
		isPremium: false,
		type: 'public'
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [customFields, setCustomFields] = useState({
		positionEnabled: false,
		categoryEnabled: false,
		subCategoryEnabled: false
	});
	const [availableSubCategories, setAvailableSubCategories] = useState([]);
	const [videoFile, setVideoFile] = useState(null);
	const [videoPreview, setVideoPreview] = useState(null);
	const [imageFiles, setImageFiles] = useState([]);
	const [existingImages, setExistingImages] = useState([]);
	const [existingVideo, setExistingVideo] = useState(null);

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

	// Initialize form data if in edit mode
	useEffect(() => {

		if (isEdit && exercise) {
			// Determine if we need to enable custom fields
			const categoryIsOther = !categories.includes(exercise.category);
			const positionIsOther = !positions.includes(exercise.position);
			let subCategoryIsOther = false;

			if (!categoryIsOther && exercise.category) {
				const validSubCats = validSubCategories[exercise.category] || [];
				subCategoryIsOther = !validSubCats.includes(exercise.subCategory);
				// Set available subcategories based on category
				setAvailableSubCategories(validSubCats);
			}

			setCustomFields({
				categoryEnabled: categoryIsOther,
				subCategoryEnabled: subCategoryIsOther,
				positionEnabled: positionIsOther
			});

			// Initialize form with exercise data
			setFormData({
				title: exercise.title || '',
				description: exercise.description || '',
				instruction: exercise.instruction || '',
				reps: exercise.reps || 0,
				hold: exercise.hold || 0,
				set: exercise.set || 0,
				perform: {
					count: exercise.perform?.count || 0,
					type: exercise.perform?.type || 'hour'
				},
				category: categoryIsOther ? 'Other' : exercise.category || '',
				subCategory: subCategoryIsOther ? 'Other' : exercise.subCategory || '',
				position: positionIsOther ? 'Other' : exercise.position || '',
				customCategory: categoryIsOther ? exercise.category || '' : '',
				customSubCategory: subCategoryIsOther ? exercise.subCategory || '' : '',
				customPosition: positionIsOther ? exercise.position || '' : '',
				isPremium: exercise.isPremium || false,
				type: exercise.type || 'public'
			});

			setExistingVideo(exercise.video);

			if (exercise.images && exercise.images.length > 0) {
				setExistingImages(exercise.images);
			}
		} else {
			resetForm();
		}
	}, [exercise, isEdit]);

	// Handle category change
	useEffect(() => {
		if (formData.category) {
			if (formData.category === 'Other') {
				setCustomFields(prev => ({ ...prev, categoryEnabled: true }));
				setAvailableSubCategories([]);
				setFormData(prev => ({ ...prev, subCategory: '' }));
			} else {
				setCustomFields(prev => ({ ...prev, categoryEnabled: false }));
				setAvailableSubCategories(validSubCategories[formData.category] || []);
				setFormData(prev => ({ ...prev, customCategory: '' }));
			}
		}
	}, [formData.category]);

	// Handle subcategory change
	useEffect(() => {
		if (formData.subCategory === 'Other' && formData.category !== 'Other') {
			setCustomFields(prev => ({ ...prev, subCategoryEnabled: true }));
		} else {
			setCustomFields(prev => ({ ...prev, subCategoryEnabled: false }));
			setFormData(prev => ({ ...prev, customSubCategory: '' }));
		}
	}, [formData.subCategory, formData.category]);

	// Handle position change
	useEffect(() => {
		if (formData.position === 'Other') {
			setCustomFields(prev => ({ ...prev, positionEnabled: true }));
		} else {
			setCustomFields(prev => ({ ...prev, positionEnabled: false }));
			setFormData(prev => ({ ...prev, customPosition: '' }));
		}
	}, [formData.position]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name === 'perform.count') {
			setFormData(prev => ({
				...prev,
				perform: { ...prev.perform, count: value }
			}));
		} else if (name === 'perform.type') {
			setFormData(prev => ({
				...prev,
				perform: { ...prev.perform, type: value }
			}));
		} else {
			setFormData(prev => ({
				...prev,
				[name]: type === 'checkbox' ? checked : value
			}));
		}
	};

	const handleVideoUpload = (e) => {
		if (e.target.files.length > 0) {
			const file = e.target.files[0];
			setVideoFile(file);
			setVideoPreview(URL.createObjectURL(file));
			setExistingVideo(null);
		}
	};

	const removeVideo = () => {
		if (videoPreview) {
			URL.revokeObjectURL(videoPreview);
		}
		setVideoFile(null);
		setVideoPreview(null);
	};

	const removeExistingVideo = () => {
		setExistingVideo(null);
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
		}
	};

	const removeImage = (index) => {
		const newImages = [...imageFiles];
		newImages.splice(index, 1);
		setImageFiles(newImages);
	};

	const removeExistingImage = (index) => {
		const newImages = [...existingImages];
		newImages.splice(index, 1);
		setExistingImages(newImages);
	};

	const validateForm = () => {
		if (!formData.title.trim()) {
			toast.error('Title is required');
			return false;
		}

		if (!formData.description.trim()) {
			toast.error('Description is required');
			return false;
		}

		if (!formData.instruction.trim()) {
			toast.error('Instructions are required');
			return false;
		}

		if (!formData.category) {
			toast.error('Category is required');
			return false;
		}

		if (formData.category === 'Other' && !formData.customCategory.trim()) {
			toast.error('Custom category is required');
			return false;
		}

		if (formData.category !== 'Other' && !formData.subCategory) {
			toast.error('Sub-category is required');
			return false;
		}

		if (formData.category !== 'Other' && formData.subCategory === 'Other' && !formData.customSubCategory.trim()) {
			toast.error('Custom sub-category is required');
			return false;
		}

		if (!formData.position) {
			toast.error('Position is required');
			return false;
		}

		if (formData.position === 'Other' && !formData.customPosition.trim()) {
			toast.error('Custom position is required');
			return false;
		}

		// In create mode, require at least one media file
		if (!isEdit && !videoFile && imageFiles.length === 0) {
			toast.error('Please upload at least one video or image');
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			// Prepare final data
			const finalPosition = formData.position === 'Other' ? formData.customPosition : formData.position;
			const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;
			const finalSubCategory = formData.category === 'Other'
				? formData.customSubCategory
				: (formData.subCategory === 'Other' ? formData.customSubCategory : formData.subCategory);

			// Create FormData object for file uploads
			const submitData = new FormData();

			// Add all text fields
			submitData.append('title', formData.title);
			submitData.append('description', formData.description);
			submitData.append('instruction', formData.instruction);
			submitData.append('reps', formData.reps);
			submitData.append('hold', formData.hold);
			submitData.append('set', formData.set);
			submitData.append('perform[count]', formData.perform.count);
			submitData.append('perform[type]', formData.perform.type);
			submitData.append('category', finalCategory);
			submitData.append('subCategory', finalSubCategory);
			submitData.append('position', finalPosition);
			submitData.append('isPremium', formData.isPremium);
			submitData.append('custom[type]', formData.type);

			// Add files
			if (videoFile) {
				submitData.append('video', videoFile);
			}

			// If we're in edit mode and there are existing images/videos we want to keep
			if (isEdit) {
				// Add info about existing videos to keep
				if (existingVideo) {
					submitData.append('existingVideo', JSON.stringify(existingVideo));
				} else {
					submitData.append('existingVideo', JSON.stringify());
				}

				// Add info about existing images to keep
				if (existingImages.length) {
					submitData.append('existingImages', JSON.stringify(existingImages));
				}
				
				submitData.append('video', existingVideo);
				submitData.append('images', existingImages);
			}

			// Add new images
			imageFiles.forEach(imageData => {
				submitData.append('images', imageData.file);
			});

			// Create or update based on mode
			let response;
			if (isEdit) {
				response = await axios.put(`${BASE_URL}/exercises/${exercise._id}`, submitData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${adminToken}`
					}
				});
				toast.success('Exercise updated successfully!');
				onClose();
				onSuccess();
			} else {
				response = await axios.post(`${BASE_URL}/exercises/`, submitData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${adminToken}`
					}
				});
				resetForm();
				toast.success('Exercise created successfully!');
				onClose();
				onSuccess();
			}

			console.log('Exercise saved:', response.data);

		} catch (error) {
			console.error('Error saving exercise:', error);
			toast.error(error.response?.data?.message || 'Failed to save exercise. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		// Reset all form state
		setFormData({
			title: '',
			description: '',
			instruction: '',
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
			customCategory: '',
			customSubCategory: '',
			customPosition: '',
			isPremium: false,
			type: 'public'
		});

		// Clear file states
		if (videoPreview) {
			URL.revokeObjectURL(videoPreview);
		}
		setVideoFile(null);
		setVideoPreview(null);
		setImageFiles([]);
		setExistingVideo(null);
		setExistingImages([]);
		setAvailableSubCategories([]);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Overlay */}
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
				onClick={onClose}
			></div>
			<div className="relative max-w-4xl mx-auto h-[90vh] overflow-y-auto custom-scrollbar p-6 bg-gray-800 rounded-xl shadow-lg text-gray-200">
				<h1 className="text-3xl font-bold text-center text-purple-400 mb-8">
					{isEdit ? 'Edit Exercise' : 'Create New Exercise'}
				</h1>
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
									value={formData.title}
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
									value={formData.position}
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

						{customFields.positionEnabled && (
							<div className="mt-4">
								<label className="block text-gray-300 font-medium mb-2" htmlFor="customPosition">
									Custom Position
								</label>
								<input
									type="text"
									id="customPosition"
									name="customPosition"
									value={formData.customPosition}
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
								value={formData.description}
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
								value={formData.instruction}
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
									value={formData.category}
									onChange={handleChange}
									className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
									required
								>
									<option value="">Select Category</option>
									{categories.map((cat) => (
										<option key={cat} value={cat}>{cat}</option>
									))}
									<option value="Other">Other</option>
								</select>
							</div>

							{!customFields.categoryEnabled ? (
								<div>
									<label className="block text-gray-300 font-medium mb-2" htmlFor="subCategory">
										Sub Category
									</label>
									<select
										id="subCategory"
										name="subCategory"
										value={formData.subCategory}
										onChange={handleChange}
										className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
										disabled={!formData.category || formData.category === 'Other'}
										required
									>
										<option value="">Select Sub Category</option>
										{availableSubCategories.map((subCat) => (
											<option key={subCat} value={subCat}>{subCat}</option>
										))}
										<option value="Other">Other</option>
									</select>
								</div>
							) : (
								<div>
									<label className="block text-gray-300 font-medium mb-2" htmlFor="customSubCategory">
										Custom Sub Category
									</label>
									<input
										type="text"
										id="customSubCategory"
										name="customSubCategory"
										value={formData.customSubCategory}
										onChange={handleChange}
										className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
										required
									/>
								</div>
							)}
						</div>

						{customFields.categoryEnabled && (
							<div className="mt-4">
								<label className="block text-gray-300 font-medium mb-2" htmlFor="customCategory">
									Custom Category
								</label>
								<input
									type="text"
									id="customCategory"
									name="customCategory"
									value={formData.customCategory}
									onChange={handleChange}
									className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
									required
								/>
							</div>
						)}

						{customFields.subCategoryEnabled && (
							<div className="mt-4">
								<label className="block text-gray-300 font-medium mb-2" htmlFor="customSubCategory">
									Custom Sub Category
								</label>
								<input
									type="text"
									id="customSubCategory"
									name="customSubCategory"
									value={formData.customSubCategory}
									onChange={handleChange}
									className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
									required
								/>
							</div>
						)}

						<div className="mt-6">
							<div className="flex items-center">
								<span className="text-gray-300 font-medium mr-4">Type:</span>
								<label className="inline-flex items-center mr-6">
									<input
										type="radio"
										name="type"
										value="public"
										checked={formData.type === "public"}
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
										checked={formData.type === "private"}
										onChange={handleChange}
										className="form-radio h-5 w-5 text-purple-600"
									/>
									<span className="ml-2 text-gray-300">Private</span>
								</label>
							</div>
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
									value={formData.perform.count}
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
									value={formData.perform.type}
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
									value={formData.reps}
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
									value={formData.hold}
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
									value={formData.set}
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
							<FiVideo className="mr-2" /> Video
						</h2>

						<div className="flex items-center">
							<label className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg cursor-pointer hover:bg-gray-500 transition">
								<FiPlusCircle className="mr-2" /> Upload Video
								<input
									type="file"
									accept="video/*"
									onChange={handleVideoUpload}
									className="hidden"
								/>
							</label>
						</div>

						{/* Video Preview */}
						{videoPreview && (
							<div className="relative mt-4 bg-gray-800 p-3 rounded-lg">
								<span className='absolute top-3 right-3 p-1 bg-red-600 hover:bg-red-800 text-white rounded-lg cursor-pointer' onClick={removeVideo}>
									<X size={18} />
								</span>
								<h3 className="text-lg font-medium text-purple-300 mb-2">Video Preview</h3>
								<video
									controls
									className="w-full rounded-lg max-h-64"
									src={videoPreview}
								>
									Your browser does not support the video tag.
								</video>
							</div>
						)}

						{/* Existing Video (when editing) */}
						{!videoPreview && existingVideo && (
							<div className="relative mt-4 bg-gray-800 p-3 rounded-lg">
								<span className='absolute top-3 right-3 p-1 bg-red-600 hover:bg-red-800 text-white rounded-lg cursor-pointer' onClick={removeExistingVideo}>
									<X size={18} />
								</span>
								<h3 className="text-lg font-medium text-purple-300 mb-2">Current Video</h3>
								<video
									controls
									className="w-full rounded-lg max-h-64"
									src={existingVideo.url || existingVideo}
								>
									Your browser does not support the video tag.
								</video>
							</div>
						)}

						{/* Video status message */}
						{!videoPreview && !existingVideo && (
							<p className="text-gray-400 text-center py-4 mt-2">No video uploaded yet.</p>
						)}

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

						{/* New Images */}
						{imageFiles.length > 0 && (
							<>
								<h3 className="text-lg font-medium text-purple-300 mt-4 mb-2">New Images</h3>
								<div className="mt-2 overflow-x-auto pb-4 custom-scrollbar">
									<div className="flex space-x-4" style={{ minWidth: 'min-content' }}>
										{imageFiles.map((imageData, index) => (
											<div key={index} className="relative group flex-shrink-0" style={{ width: '200px' }}>
												<div className="h-40 w-full bg-gray-600 rounded-lg overflow-hidden">
													{imageData.preview ? (
														<img
															src={imageData.preview}
															alt={`Exercise img ${index + 1}`}
															className="w-full h-full object-cover"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center bg-gray-700">
															<span className="text-gray-400">Loading...</span>
														</div>
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
										))}
									</div>
								</div>
							</>
						)}

						{/* Existing Images (when editing) */}
						{existingImages.length > 0 && (
							<>
								<h3 className="text-lg font-medium text-purple-300 mt-4 mb-2">Current Images</h3>
								<div className="mt-2 overflow-x-auto pb-4 custom-scrollbar">
									<div className="flex space-x-4" style={{ minWidth: 'min-content' }}>
										{existingImages.map((image, index) => (
											<div key={index} className="relative group flex-shrink-0" style={{ width: '200px' }}>
												<div className="h-40 w-full bg-gray-600 rounded-lg overflow-hidden">
													<img
														src={image.url || image}
														alt={`Exercise img ${index + 1}`}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
													<button
														type="button"
														onClick={() => removeExistingImage(index)}
														className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700 focus:outline-none"
													>
														<FiX className="inline-block" />
													</button>
												</div>
												<p className="mt-1 text-sm text-gray-400 truncate">Existing image {index + 1}</p>
											</div>
										))}
									</div>
								</div>
							</>
						)}

						{/* Image status message */}
						{imageFiles.length === 0 && existingImages.length === 0 && (
							<p className="text-gray-400 text-center py-4 mt-2">No images uploaded yet.</p>
						)}
					</div>

					{/* Submit Button */}
					<div className="flex justify-end space-x-4">
						<button
							type="button"
							onClick={resetForm}
							className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center"
						>
							<FiX className="mr-2" /> Reset Form
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className={`px-6 py-3 ${isSubmitting ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-500'} text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center`}
						>
							{isSubmitting ? (
								<>
									<span className="mr-2 animate-spin">⟳</span> {isEdit ? 'Updating...' : 'Creating...'}
								</>
							) : (
								<>
									<FiSave className="mr-2" /> {isEdit ? 'Save Changes' : 'Create Exercise'}
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
		</div>
	);
}