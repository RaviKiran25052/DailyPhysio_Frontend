import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaPlus, FaSearch, FaSave, FaUser, FaClipboardList } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TherapistConsultation() {
	const [step, setStep] = useState(1);
	const [users, setUsers] = useState([]);
	const [exercises, setExercises] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [selectedExercises, setSelectedExercises] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showNewUserForm, setShowNewUserForm] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [consultationData, setConsultationData] = useState({
		activeDays: 7,
		notes: '',
	});

	const API_URL = process.env.REACT_APP_API_URL;
	const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
	const therapistToken = therapistInfo?.token || '';

	useEffect(() => {
		fetchUsers();
		fetchExercises();
	}, []);

	useEffect(() => {
		if (searchTerm) {
			const filtered = users.filter(user =>
				user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email?.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredUsers(filtered);
		} else {
			setFilteredUsers(users);
		}
	}, [searchTerm, users]);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/therapist/users`, {
				headers: { Authorization: `Bearer ${therapistToken}` }
			});
			setUsers(response.data);
			setFilteredUsers(response.data);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching users:', error);
			toast.error('Failed to fetch users');
			setLoading(false);
		}
	};

	const fetchExercises = async () => {
		try {
			const response = await axios.get(`${API_URL}/therapist/exercises`, {
				headers: { Authorization: `Bearer ${therapistToken}` }
			});
			setExercises(response.data);
		} catch (error) {
			console.error('Error fetching exercises:', error);
			toast.error('Failed to fetch exercises');
		}
	};

	const handleUserSelect = (user) => {
		setSelectedUser(user);
		setStep(2);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleConsultationChange = (e) => {
		const { name, value } = e.target;
		setConsultationData({
			...consultationData,
			[name]: value
		});
	};

	const toggleExerciseSelection = (exercise) => {
		if (selectedExercises.some(ex => ex._id === exercise._id)) {
			setSelectedExercises(selectedExercises.filter(ex => ex._id !== exercise._id));
		} else {
			setSelectedExercises([...selectedExercises, exercise]);
		}
	};

	const registerNewUser = async () => {
		if (formData.password !== formData.confirmPassword) {
			toast.error('Passwords do not match');
			return null;
		}

		try {
			const response = await axios.post(`${API_URL}/users/register`, {
				fullName: formData.name,
				email: formData.email,
				password: formData.password,
			});

			if (response.status === 201) {
				toast.success('User registered successfully', {
					position: "top-center"
				});
				return response.data.user;
			}
		} catch (error) {
			console.error('Registration error:', error);
			toast.error('Registration failed: ' + (error.response?.data?.message || 'Unknown error'), {
				position: "top-center"
			});
			return null;
		}
	};

	const submitConsultation = async () => {
		try {
			setLoading(true);

			// First register user if needed
			let patientId = selectedUser?._id;

			if (!patientId && showNewUserForm) {
				const newUser = await registerNewUser();
				if (!newUser) {
					setLoading(false);
					return;
				}
				patientId = newUser._id;
			}

			if (!patientId) {
				toast.error('Please select or create a user');
				setLoading(false);
				return;
			}

			// Create consultation
			const consultationPayload = {
				userId: patientId,
				exercises: selectedExercises.map(ex => ex._id),
				activeDays: parseInt(consultationData.activeDays),
				desp: consultationData.notes
			};

			const response = await axios.post(
				`${API_URL}/therapist/consultations`,
				consultationPayload,
				{ headers: { Authorization: `Bearer ${therapistToken}` } }
			);

			if (response.status === 201) {
				toast.success('Consultation created successfully');
				resetForm();
			}
		} catch (error) {
			console.error('Error creating consultation:', error);
			toast.error('Failed to create consultation: ' + (error.response?.data?.message || 'Unknown error'));
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setStep(1);
		setSelectedUser(null);
		setSelectedExercises([]);
		setFormData({
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		});
		setConsultationData({
			activeDays: 7,
			notes: '',
		});
		setShowNewUserForm(false);
	};

	const onHomeClick = () => {
		// Navigate to home page or therapist dashboard
		// Add your navigation logic here
	};

	return (
		<div className="min-h-screen bg-gray-900 text-gray-200">
			<ToastContainer />
			<div className="container mx-auto py-8 px-4">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-2xl font-bold text-purple-400">Create New Consultation</h1>
					<button
						onClick={onHomeClick}
						className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
					>
						<FaArrowLeft className="mr-2" />
						Back to Home
					</button>
				</div>

				{/* Progress indicator */}
				<div className="mb-8">
					<div className="flex justify-between mb-2">
						<span className={`font-medium ${step >= 1 ? 'text-purple-400' : 'text-gray-500'}`}>
							1. Select Patient
						</span>
						<span className={`font-medium ${step >= 2 ? 'text-purple-400' : 'text-gray-500'}`}>
							2. Choose Exercises
						</span>
						<span className={`font-medium ${step >= 3 ? 'text-purple-400' : 'text-gray-500'}`}>
							3. Finalize Details
						</span>
					</div>
					<div className="w-full bg-gray-700 rounded-full h-2">
						<div
							className="bg-purple-500 h-2 rounded-full transition-all duration-300"
							style={{ width: `${(step / 3) * 100}%` }}
						></div>
					</div>
				</div>

				{/* Step 1: Select User */}
				{step === 1 && (
					<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
						<h2 className="text-xl font-semibold mb-4 text-purple-300 flex items-center">
							<FaUser className="mr-2" />
							Select a Patient
						</h2>

						{!showNewUserForm ? (
							<>
								<div className="flex mb-4 gap-4">
									<div className="relative flex-1">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FaSearch className="text-gray-400" />
										</div>
										<input
											type="text"
											placeholder="Search users by name or email"
											className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
									</div>
									<button
										onClick={() => setShowNewUserForm(true)}
										className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
									>
										<FaPlus className="mr-2" />
										New User
									</button>
								</div>

								{loading ? (
									<div className="flex justify-center my-8">
										<div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
									</div>
								) : (
									<div className="h-96 overflow-y-auto">
										{filteredUsers.length > 0 ? (
											<ul className="divide-y divide-gray-700">
												{filteredUsers.map((user) => (
													<li
														key={user._id}
														className="py-3 px-2 hover:bg-gray-700 rounded cursor-pointer transition-colors"
														onClick={() => handleUserSelect(user)}
													>
														<div className="flex items-center">
															<div className="bg-purple-700 text-white p-2 rounded-full mr-3">
																{user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
															</div>
															<div>
																<p className="font-medium text-white">{user.fullName}</p>
																<p className="text-sm text-gray-400">{user.email}</p>
															</div>
														</div>
													</li>
												))}
											</ul>
										) : (
											<div className="text-center py-8 text-gray-400">
												No users found. Please create a new user.
											</div>
										)}
									</div>
								)}
							</>
						) : (
							<div className="bg-gray-700 rounded-lg p-4">
								<h3 className="font-medium mb-4 text-purple-300">Create New User</h3>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleInputChange}
											className="w-full px-4 py-2 rounded-md bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											className="w-full px-4 py-2 rounded-md bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
										<input
											type="password"
											name="password"
											value={formData.password}
											onChange={handleInputChange}
											className="w-full px-4 py-2 rounded-md bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
										<input
											type="password"
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleInputChange}
											className="w-full px-4 py-2 rounded-md bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
											required
										/>
									</div>
									<div className="flex gap-3 pt-2">
										<button
											onClick={() => setShowNewUserForm(false)}
											className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
										>
											Cancel
										</button>
										<button
											onClick={() => setStep(2)}
											className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
										>
											Continue
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Step 2: Select Exercises */}
				{step === 2 && (
					<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
						<h2 className="text-xl font-semibold mb-4 text-purple-300 flex items-center">
							<FaClipboardList className="mr-2" />
							Select Exercises
						</h2>

						<div className="mb-4">
							<p className="text-gray-300">
								Selected Patient: <span className="font-medium text-purple-300">
									{selectedUser ? selectedUser.fullName : formData.name}
								</span>
							</p>
						</div>

						<div className="relative mb-4">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FaSearch className="text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search exercises"
								className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						<div className="h-96 overflow-y-auto">
							{exercises.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{exercises.map((exercise) => (
										<div
											key={exercise._id}
											className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedExercises.some(ex => ex._id === exercise._id)
												? 'border-purple-500 bg-purple-900 bg-opacity-20'
												: 'border-gray-700 hover:bg-gray-700'
												}`}
											onClick={() => toggleExerciseSelection(exercise)}
										>
											<div className="flex justify-between items-start">
												<h3 className="font-medium text-purple-300">{exercise.title}</h3>
												<div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedExercises.some(ex => ex._id === exercise._id)
													? 'bg-purple-500'
													: 'border border-gray-500'
													}`}>
													{selectedExercises.some(ex => ex._id === exercise._id) && (
														<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
															<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
														</svg>
													)}
												</div>
											</div>
											<p className="text-sm text-gray-400 mt-2">{exercise.description}</p>
											<div className="mt-2 flex flex-wrap gap-2">
												{exercise.tags?.map((tag, index) => (
													<span key={index} className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
														{tag}
													</span>
												))}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-gray-400">
									No exercises found.
								</div>
							)}
						</div>

						<div className="flex justify-between mt-6">
							<button
								onClick={() => setStep(1)}
								className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
							>
								Back
							</button>
							<button
								onClick={() => setStep(3)}
								className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={selectedExercises.length === 0}
							>
								Continue
							</button>
						</div>
					</div>
				)}

				{/* Step 3: Finalize Consultation */}
				{step === 3 && (
					<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
						<h2 className="text-xl font-semibold mb-4 text-purple-300 flex items-center">
							<FaSave className="mr-2" />
							Finalize Consultation
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="font-medium text-purple-300 mb-3">Patient Information</h3>
								<div className="bg-gray-700 p-4 rounded-lg mb-4">
									<p className="text-gray-300">
										<span className="font-medium">Name:</span> {selectedUser ? selectedUser.fullName : formData.name}
									</p>
									<p className="text-gray-300 mt-2">
										<span className="font-medium">Email:</span> {selectedUser ? selectedUser.email : formData.email}
									</p>
								</div>

								<h3 className="font-medium text-purple-300 mb-3">Selected Exercises ({selectedExercises.length})</h3>
								<div className="bg-gray-700 p-4 rounded-lg h-40 overflow-y-auto">
									{selectedExercises.length > 0 ? (
										<ul className="space-y-2">
											{selectedExercises.map((exercise) => (
												<li key={exercise._id} className="flex items-center">
													<div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
													<span>{exercise.title}</span>
												</li>
											))}
										</ul>
									) : (
										<p className="text-gray-400">No exercises selected</p>
									)}
								</div>
							</div>

							<div>
								<h3 className="font-medium text-purple-300 mb-3">Consultation Details</h3>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-1">Active Days</label>
										<input
											type="number"
											name="activeDays"
											min="1"
											value={consultationData.activeDays}
											onChange={handleConsultationChange}
											className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
										<textarea
											name="notes"
											value={consultationData.notes}
											onChange={handleConsultationChange}
											rows="5"
											className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
											placeholder="Add any additional notes about this consultation..."
										></textarea>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-between mt-6">
							<button
								onClick={() => setStep(2)}
								className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
							>
								Back
							</button>
							<button
								onClick={submitConsultation}
								disabled={loading}
								className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
							>
								{loading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
										Processing...
									</>
								) : (
									<>
										<FaSave className="mr-2" />
										Create Consultation
									</>
								)}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}