import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import TherapistHeader from './TherapistHeader';

const NewConsultation = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		patientName: '',
		patientAge: '',
		patientGender: 'male',
		condition: '',
		diagnosis: '',
		treatmentPlan: '',
		date: new Date().toISOString().split('T')[0],
		time: '',
		duration: '30',
		sessionType: 'In-Person',
		status: 'Scheduled',
		notes: '',
		location: ''
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

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

	// Validate form
	const validateForm = () => {
		const newErrors = {};

		if (!formData.patientName.trim()) {
			newErrors.patientName = 'Patient name is required';
		}

		if (!formData.patientAge.trim()) {
			newErrors.patientAge = 'Patient age is required';
		} else if (isNaN(formData.patientAge) || parseInt(formData.patientAge) <= 0) {
			newErrors.patientAge = 'Please enter a valid age';
		}

		if (!formData.condition.trim()) {
			newErrors.condition = 'Condition is required';
		}

		if (!formData.date) {
			newErrors.date = 'Date is required';
		}

		if (!formData.time.trim()) {
			newErrors.time = 'Time is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validateForm()) {
			setLoading(true);
			setError('');

			try {
				const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));

				// Create consultation data
				const consultationData = {
					...formData,
					therapistId: therapistInfo._id || therapistInfo.id,
					patientAge: parseInt(formData.patientAge),
					duration: parseInt(formData.duration)
				};

				const response = await axios.post(
					`${process.env.REACT_APP_API_URL}/consultations`,
					consultationData,
					{
						headers: {
							Authorization: `Bearer ${therapistInfo.token}`
						}
					}
				);

				// Redirect to dashboard on success
				navigate('/dashboard');
			} catch (error) {
				setError(
					error.response && error.response.data.message
						? error.response.data.message
						: 'Failed to create consultation. Please try again.'
				);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<TherapistHeader />

			<div className="container mx-auto px-4 py-8">
				<button
					onClick={() => navigate('/dashboard')}
					className="flex items-center text-gray-400 hover:text-white mb-6"
				>
					<FaArrowLeft className="mr-2" />
					Back to Dashboard
				</button>

				<div className="bg-gray-800 rounded-lg shadow-lg p-6">
					<h2 className="text-2xl font-bold mb-6">New Consultation</h2>

					{error && (
						<div className="mb-6 bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Patient Information */}
							<div className="space-y-6">
								<h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Patient Information</h3>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-1">
										Patient Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="patientName"
										value={formData.patientName}
										onChange={handleChange}
										className={`w-full px-3 py-2 bg-gray-700 border ${errors.patientName ? 'border-red-500' : 'border-gray-600'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
										placeholder="John Doe"
									/>
									{errors.patientName && (
										<p className="mt-1 text-sm text-red-500">{errors.patientName}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-1">
										Age <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										name="patientAge"
										value={formData.patientAge}
										onChange={handleChange}
										className={`w-full px-3 py-2 bg-gray-700 border ${errors.patientAge ? 'border-red-500' : 'border-gray-600'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
										placeholder="42"
									/>
									{errors.patientAge && (
										<p className="mt-1 text-sm text-red-500">{errors.patientAge}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-1">
										Gender
									</label>
									<div className="flex space-x-4">
										<div className="flex items-center">
											<input
												type="radio"
												id="patientMale"
												name="patientGender"
												value="male"
												checked={formData.patientGender === 'male'}
												onChange={handleChange}
												className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600"
											/>
											<label htmlFor="patientMale" className="ml-2 text-sm text-gray-300">
												Male
											</label>
										</div>
										<div className="flex items-center">
											<input
												type="radio"
												id="patientFemale"
												name="patientGender"
												value="female"
												checked={formData.patientGender === 'female'}
												onChange={handleChange}
												className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600"
											/>
											<label htmlFor="patientFemale" className="ml-2 text-sm text-gray-300">
												Female
											</label>
										</div>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-1">
										Condition/Complaint <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="condition"
										value={formData.condition}
										onChange={handleChange}
										className={`w-full px-3 py-2 bg-gray-700 border ${errors.condition ? 'border-red-500' : 'border-gray-600'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
										placeholder="Lower back pain"
									/>
									{errors.condition && (
										<p className="mt-1 text-sm text-red-500">{errors.condition}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-1">
										Diagnosis
									</label>
									<input
										type="text"
										name="diagnosis"
										value={formData.diagnosis}
										onChange={handleChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
										placeholder="Lumbar strain"
									/>
								</div>
							</div>

							{/* Appointment Details */}
							<div className="space-y-6">
								<h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Appointment Details</h3>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-400 mb-1">
											Date <span className="text-red-500">*</span>
										</label>
										<input
											type="date"
											name="date"
											value={formData.date}
											onChange={handleChange}
											className={`w-full px-3 py-2 bg-gray-700 border ${errors.date ? 'border-red-500' : 'border-gray-600'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
										/>
										{errors.date && (
											<p className="mt-1 text-sm text-red-500">{errors.date}</p>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-400 mb-1">
											Time <span className="text-red-500">*</span>
										</label>
										<input
											type="time"
											name="time"
											value={formData.time}
											onChange={handleChange}
											className={`w-full px-3 py-2 bg-gray-700 border ${errors.time ? 'border-red-500' : 'border-gray-600'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
										/>
										{errors.time && (
											<p className="mt-1 text-sm text-red-500">{errors.time}</p>
										)}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-1">
										Duration (minutes)
									</label>
									<select
										name="duration"
										value={formData.duration}
										onChange={handleChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
									>
										<option value="30">30 minutes</option>
										<option value="45">45 minutes</option>
										<option value="60">60 minutes</option>
										<option value="90">90 minutes</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-1">
										Session Type
									</label>
									<select
										name="sessionType"
										value={formData.sessionType}
										onChange={handleChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
									>
										<option value="In-Person">In-Person</option>
										<option value="Telehealth">Telehealth</option>
										<option value="Home Visit">Home Visit</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-1">
										Status
									</label>
									<select
										name="status"
										value={formData.status}
										onChange={handleChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
									>
										<option value="Scheduled">Scheduled</option>
										<option value="In Progress">In Progress</option>
										<option value="Completed">Completed</option>
										<option value="Cancelled">Cancelled</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-400 mb-1">
										Location
									</label>
									<input
										type="text"
										name="location"
										value={formData.location}
										onChange={handleChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
										placeholder="Room 302, City Hospital"
									/>
								</div>
							</div>
						</div>

						{/* Treatment Plan */}
						<div className="mt-6">
							<label className="block text-sm font-medium text-gray-400 mb-1">
								Treatment Plan
							</label>
							<textarea
								name="treatmentPlan"
								value={formData.treatmentPlan}
								onChange={handleChange}
								rows="3"
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
								placeholder="Treatment plan details"
							></textarea>
						</div>

						{/* Notes */}
						<div className="mt-6">
							<label className="block text-sm font-medium text-gray-400 mb-1">
								Additional Notes
							</label>
							<textarea
								name="notes"
								value={formData.notes}
								onChange={handleChange}
								rows="3"
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
								placeholder="Any additional notes..."
							></textarea>
						</div>

						{/* Form Actions */}
						<div className="mt-8 flex justify-end space-x-4">
							<button
								type="button"
								onClick={() => navigate('/dashboard')}
								className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
							>
								{loading ? 'Creating...' : 'Create Consultation'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default NewConsultation;