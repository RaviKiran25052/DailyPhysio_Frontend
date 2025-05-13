import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaTimes, FaUpload } from 'react-icons/fa';

// Available specialization options
const specializationOptions = [
	'Orthopedics',
	'Neurology',
	'Pediatric Therapy',
	'Sports Medicine',
	'Geriatric Care',
	'Manual Therapy',
	'Cardiopulmonary',
	'Sports Rehabilitation',
	'Women\'s Health',
	'Other'
];

const TherapistRegister = ({ onClose, onLogin }) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		specializations: [],
		experience: '',
		gender: 'male',
		workingAt: '',
		address: '',
		phoneNumber: '',
		profilePic: 'https://res.cloudinary.com/dalzs7bc2/image/upload/v1746784719/doc_jcxqwb.png'
	});
	const [errors, setErrors] = useState({});
	const [selectedSpecialization, setSelectedSpecialization] = useState('');
	const [otherSpecialization, setOtherSpecialization] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [profilePicPreview, setProfilePicPreview] = useState(formData.profilePic);
	const fileInputRef = useRef(null);

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});

		// Clear error for this field
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: null
			});
		}
	};

	// Handle profile picture upload
	const handleProfilePicUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validate file type and size
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
			const maxSize = 5 * 1024 * 1024; // 5MB

			if (!allowedTypes.includes(file.type)) {
				setErrors(prev => ({
					...prev,
					profilePic: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP.'
				}));
				return;
			}

			if (file.size > maxSize) {
				setErrors(prev => ({
					...prev,
					profilePic: 'File size should be less than 5MB.'
				}));
				return;
			}

			// Create URL for preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfilePicPreview(reader.result);
				setFormData(prev => ({
					...prev,
					profilePic: reader.result
				}));
			};
			reader.readAsDataURL(file);

			// Clear any previous errors
			if (errors.profilePic) {
				const { profilePic, ...restErrors } = errors;
				setErrors(restErrors);
			}
		}
	};

	// Remove profile picture
	const removeProfilePic = () => {
		setProfilePicPreview('https://res.cloudinary.com/dalzs7bc2/image/upload/v1746784719/doc_jcxqwb.png');
		setFormData(prev => ({
			...prev,
			profilePic: 'https://res.cloudinary.com/dalzs7bc2/image/upload/v1746784719/doc_jcxqwb.png'
		}));
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	// Rest of the existing methods remain the same...
	const handleSpecializationSelect = (e) => {
		setSelectedSpecialization(e.target.value);
	};

	const handleOtherSpecializationChange = (e) => {
		setOtherSpecialization(e.target.value);
	};

	const addSpecialization = () => {
		if (selectedSpecialization === 'Other') {
			if (otherSpecialization.trim() && !formData.specializations.includes(otherSpecialization.trim())) {
				setFormData({
					...formData,
					specializations: [...formData.specializations, otherSpecialization.trim()]
				});
				setOtherSpecialization('');
			}
		} else if (selectedSpecialization && !formData.specializations.includes(selectedSpecialization)) {
			setFormData({
				...formData,
				specializations: [...formData.specializations, selectedSpecialization]
			});
		}

		// Clear error for specializations
		if (errors.specializations) {
			setErrors({
				...errors,
				specializations: null
			});
		}
	};

	const removeSpecialization = (specialization) => {
		setFormData({
			...formData,
			specializations: formData.specializations.filter(s => s !== specialization)
		});
	};

	const validateForm = () => {
		const newErrors = {};

		// Existing validations remain the same...
		if (!formData.name.trim()) {
			newErrors.name = 'Name is required';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email is invalid';
		}

		if (!formData.password) {
			newErrors.password = 'Password is required';
		} else if (formData.password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your password';
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		if (formData.specializations.length === 0) {
			newErrors.specializations = 'At least one specialization is required';
		}

		if (!formData.experience.trim()) {
			newErrors.experience = 'Experience is required';
		}

		if (!formData.workingAt.trim()) {
			newErrors.workingAt = 'Hospital/Clinic name is required';
		}

		if (!formData.address.trim()) {
			newErrors.address = 'Address is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validateForm()) {
			setLoading(true);
			setError('');
			try {
				const { confirmPassword, ...dataToSubmit } = formData;
				await axios.post(
					`${process.env.REACT_APP_API_URL}/therapist/register`,
					dataToSubmit
				);

				onClose(true);
			} catch (error) {
				setError(
					error.response && error.response.data.message
						? error.response.data.message
						: 'Registration failed. Please try again.'
				);
			} finally {
				setLoading(false);
			}
		}
	};

	// Prevent click propagation
	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto" onClick={() => onClose(false)}>
			<div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4" onClick={stopPropagation}>
				<div className="p-6 border-b border-gray-700 flex justify-between items-center">
					<h2 className="text-2xl font-bold text-white">
						Therapist Registration
					</h2>
					<button
						onClick={() => onClose(false)}
						className="text-gray-400 hover:text-white focus:outline-none"
					>
						<FaTimes size={24} />
					</button>
				</div>

				{error && (
					<div className="mx-6 mt-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded">
						{error}
					</div>
				)}

				<div className="p-6 max-h-[70vh] overflow-y-auto">
					{/* Profile Picture Upload */}
					<div className="flex flex-col items-center mb-6">
						<div className="relative w-32 h-32 mb-4">
							<img
								src={profilePicPreview}
								alt="Profile"
								className="w-full h-full rounded-full object-cover border-4 border-purple-600"
							/>
							{profilePicPreview !== 'https://res.cloudinary.com/dalzs7bc2/image/upload/v1746784719/doc_jcxqwb.png' && (
								<button
									onClick={removeProfilePic}
									className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
								>
									<FaTimes size={12} />
								</button>
							)}
						</div>
						<div className="flex items-center space-x-4">
							<input
								type="file"
								ref={fileInputRef}
								accept="image/jpeg,image/png,image/gif,image/webp"
								onChange={handleProfilePicUpload}
								className="hidden"
								id="profilePicUpload"
							/>
							<label
								htmlFor="profilePicUpload"
								className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer"
							>
								<FaUpload className="mr-2" /> Upload Photo
							</label>
						</div>
						{errors.profilePic && (
							<p className="mt-2 text-sm text-red-500">{errors.profilePic}</p>
						)}
					</div>


					<form onSubmit={handleSubmit}>
						<div className="space-y-6">
							{/* Name */}
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className={`w-full px-3 py-2 bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'
										} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
									placeholder="Dr. John Smith"
								/>
								{errors.name && (
									<p className="mt-1 text-sm text-red-500">{errors.name}</p>
								)}
							</div>

							{/* Email */}
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Email <span className="text-red-500">*</span>
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className={`w-full px-3 py-2 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'
										} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
									placeholder="doctor@example.com"
								/>
								{errors.email && (
									<p className="mt-1 text-sm text-red-500">{errors.email}</p>
								)}
							</div>

							{/* Password */}
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Password <span className="text-red-500">*</span>
								</label>
								<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									className={`w-full px-3 py-2 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'
										} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
									placeholder="Enter password"
								/>
								{errors.password && (
									<p className="mt-1 text-sm text-red-500">{errors.password}</p>
								)}
							</div>

							{/* Confirm Password */}
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Confirm Password <span className="text-red-500">*</span>
								</label>
								<input
									type="password"
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									className={`w-full px-3 py-2 bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
										} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
									placeholder="Confirm password"
								/>
								{errors.confirmPassword && (
									<p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
								)}
							</div>

							{/* Specializations */}
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Specializations <span className="text-red-500">*</span>
								</label>

								<div className="flex flex-wrap gap-2 mb-2">
									{formData.specializations.map((spec, index) => (
										<span
											key={index}
											className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full flex items-center"
										>
											{spec}
											<button
												type="button"
												onClick={() => removeSpecialization(spec)}
												className="ml-2 text-white hover:text-gray-200 focus:outline-none"
											>
												<FaTimes size={12} />
											</button>
										</span>
									))}
								</div>

								<div className="flex items-center gap-2 mb-2">
									<select
										value={selectedSpecialization}
										onChange={handleSpecializationSelect}
										className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
									>
										<option value="">Select a specialization</option>
										{specializationOptions.map(option => (
											<option key={option} value={option}>{option}</option>
										))}
									</select>
									<button
										type="button"
										onClick={addSpecialization}
										className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
									>
										Add
									</button>
								</div>

								{selectedSpecialization === 'Other' && (
									<div className="mt-2">
										<input
											type="text"
											value={otherSpecialization}
											onChange={handleOtherSpecializationChange}
											placeholder="Enter specialization"
											className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
										/>
									</div>
								)}

								{errors.specializations && (
									<p className="mt-1 text-sm text-red-500">{errors.specializations}</p>
								)}
							</div>

							{/* Experience */}
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Experience <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="experience"
									value={formData.experience}
									onChange={handleChange}
									className={`w-full px-3 py-2 bg-gray-700 border ${errors.experience ? 'border-red-500' : 'border-gray-600'
										} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
									placeholder="5 years"
								/>
								{errors.experience && (
									<p className="mt-1 text-sm text-red-500">{errors.experience}</p>
								)}
							</div>

							{/* Gender */}
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Gender <span className="text-red-500">*</span>
								</label>
								<div className="flex space-x-4">
									<div className="flex items-center">
										<input
											type="radio"
											id="male"
											name="gender"
											value="male"
											checked={formData.gender === 'male'}
											onChange={handleChange}
											className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600"
										/>
										<label htmlFor="male" className="ml-2 text-sm text-gray-300">
											Male
										</label>
									</div>
									<div className="flex items-center">
										<input
											type="radio"
											id="female"
											name="gender"
											value="female"
											checked={formData.gender === 'female'}
											onChange={handleChange}
											className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600"
										/>
										<label htmlFor="female" className="ml-2 text-sm text-gray-300">
											Female
										</label>
									</div>
								</div>
							</div>

							{/* Hospital/Clinic */}
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Hospital/Clinic Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="workingAt"
									value={formData.workingAt}
									onChange={handleChange}
									className={`w-full px-3 py-2 bg-gray-700 border ${errors.workingAt ? 'border-red-500' : 'border-gray-600'
										} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
									placeholder="City General Hospital"
								/>
								{errors.workingAt && (
									<p className="mt-1 text-sm text-red-500">{errors.workingAt}</p>
								)}
							</div>

							{/* Address */}
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Address <span className="text-red-500">*</span>
								</label>
								<textarea
									name="address"
									value={formData.address}
									onChange={handleChange}
									rows="3"
									className={`w-full px-3 py-2 bg-gray-700 border ${errors.address ? 'border-red-500' : 'border-gray-600'
										} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
									placeholder="123 Medical Center Blvd, New York, NY"
								></textarea>
								{errors.address && (
									<p className="mt-1 text-sm text-red-500">{errors.address}</p>
								)}
							</div>

							{/* Phone Number */}
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Phone Number <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="phoneNumber"
									value={formData.phoneNumber}
									onChange={handleChange}
									className={`w-full px-3 py-2 bg-gray-700 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-600'
										} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
									placeholder="+1 (555) 123-4567"
								/>
								{errors.phoneNumber && (
									<p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
								)}
							</div>

							{/* Form Actions */}
							<div className="flex justify-end">
								<button
									type="submit"
									disabled={loading}
									className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
										} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
								>
									{loading ? 'Registering...' : 'Register'}
								</button>
							</div>
						</div>
					</form>
				</div>

				<div className="p-4 border-t border-gray-700 text-center">
					<p className="text-sm text-gray-400">
						Already have an account?{' '}
						<button
							type="button"
							onClick={onLogin}
							className="font-medium text-purple-500 hover:text-purple-400"
						>
							Login
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default TherapistRegister;