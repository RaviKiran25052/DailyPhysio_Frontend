import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaNotesMedical, FaPlus } from 'react-icons/fa';
import EmptyState from './EmptyState';
import ConsultationList from './ConsultationList';
import TherapistHeader from './TherapistHeader';
import FeaturedSection from './FeaturedSection';
import TherapistLogin from './TherapistLogin';
import TherapistRegister from './TherapistRegister';
import AccountNotActivatedModal from './AccountNotActivatedModal';
import RegistrationSuccessModal from './RegistrationSuccessModal';

const TherapistDashboard = () => {
	const navigate = useNavigate();
	const [consultations, setConsultations] = useState([{
		_id: "60d21b4967d0d8992e610c85",
		therapist_id: {
			_id: "60d21b4967d0d8992e610c01",
			name: "Dr. Sarah Johnson",
			specialty: "Physical Therapy"
		},
		patient_id: {
			_id: "60d21b4967d0d8992e610c02",
			name: "Michael Thompson",
			email: "michael.t@example.com"
		},
		recommendedExercises: [
			"60d21b4967d0d8992e610d01",
			"60d21b4967d0d8992e610d02",
			"60d21b4967d0d8992e610d03"
		],
		request: {
			status: "active",
			activeDays: 12
		},
		notes: "Patient showing improvement in mobility. Continue with current exercise regimen.",
		createdAt: "2025-04-01T10:30:00.000Z",
		updatedAt: "2025-04-20T14:15:00.000Z"
	},
	{
		_id: "60d21b4967d0d8992e610c86",
		therapist_id: {
			_id: "60d21b4967d0d8992e610c03",
			name: "Dr. James Wilson",
			specialty: "Occupational Therapy"
		},
		patient_id: {
			_id: "60d21b4967d0d8992e610c04",
			name: "Emily Rodriguez",
			email: "emily.r@example.com"
		},
		recommendedExercises: [
			"60d21b4967d0d8992e610d04",
			"60d21b4967d0d8992e610d05"
		],
		request: {
			status: "inactive",
			activeDays: 30
		},
		notes: "Treatment completed. Patient has regained full functionality. Schedule follow-up in 3 months.",
		createdAt: "2025-03-15T09:45:00.000Z",
		updatedAt: "2025-04-15T11:20:00.000Z"
	},
	{
		_id: "60d21b4967d0d8992e610c87",
		therapist_id: {
			_id: "60d21b4967d0d8992e610c05",
			name: "Dr. Lisa Chen",
			specialty: "Speech Therapy"
		},
		patient_id: {
			_id: "60d21b4967d0d8992e610c06",
			name: "David Brown",
			email: "david.b@example.com"
		},
		recommendedExercises: [],
		request: {
			status: "active",
			activeDays: 5
		},
		notes: "Initial assessment completed. Comprehensive treatment plan to be developed.",
		createdAt: "2025-04-19T13:00:00.000Z",
		updatedAt: "2025-04-21T16:45:00.000Z"
	},
	{
		_id: "60d21b4967d0d8992e610c88",
		therapist_id: {
			_id: "60d21b4967d0d8992e610c07",
			name: "Dr. Robert Martinez"
		},
		patient_id: {
			_id: "60d21b4967d0d8992e610c08",
			name: "Sophia Williams"
		},
		recommendedExercises: [
			"60d21b4967d0d8992e610d06",
			"60d21b4967d0d8992e610d07",
			"60d21b4967d0d8992e610d08",
			"60d21b4967d0d8992e610d09"
		],
		request: {
			status: "active",
			activeDays: 22
		},
		createdAt: "2025-03-28T11:15:00.000Z",
		updatedAt: "2025-04-22T10:30:00.000Z"
	},
	{
		_id: "60d21b4967d0d8992e610c89",
		therapist_id: null,
		patient_id: {
			_id: "60d21b4967d0d8992e610c10",
			name: "John Smith"
		},
		request: {
			status: "inactive",
			activeDays: 0
		},
		createdAt: "2025-04-24T09:00:00.000Z",
		updatedAt: "2025-04-24T09:00:00.000Z"
	}]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const [showNotActivatedModal, setShowNotActivatedModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('therapistInfo')) {
			const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
			if (therapistInfo.status === 'active') {
				setIsLoggedIn(true);
				fetchConsultations();
			} else {
				setIsLoggedIn(false);
				setLoading(false);
			}
		} else {
			setIsLoggedIn(false);
			setLoading(false);
		}
	}, [isLoggedIn]);

	const fetchConsultations = async () => {
		try {
			setLoading(true);
			const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));

			// Get therapist ID from stored data
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/therapist/consultations/`,
				{
					headers: {
						Authorization: `Bearer ${therapistInfo.token}`
					}
				}
			);

			setConsultations(response.data);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching consultations:', error);
			setError('Failed to load your consultations');
			setLoading(false);
		}
	};

	const toggleAuthModals = () => {
		setShowLoginModal(!showLoginModal);
		setShowRegisterModal(!showRegisterModal);
	}

	const handleLoginClose = (isVerfied, isSubmitted) => {
		setShowLoginModal(false);

		if (isVerfied) {
			setIsLoggedIn(true);
			navigate('/therapist/');
		} else if (isSubmitted) {
			setShowNotActivatedModal(true);
		}
	}

	const handleRegisterClose = (isSuccess) => {
		setShowRegisterModal(false);
		if (isSuccess) {
			setShowSuccessModal(true);
		}
	}

	const handleNotActivatedClose = () => {
		setShowNotActivatedModal(false);
		setShowLoginModal(true);
	}

	const handleSuccessModalClose = () => {
		setShowSuccessModal(false);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<TherapistHeader
				onLogin={() => setShowLoginModal(true)}
				onRegister={() => setShowRegisterModal(true)}
			/>

			<main className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">
						{isLoggedIn ? 'Your Consultations' : 'Welcome to ExerciseMD'}
					</h1>

					{isLoggedIn && (
						<button
							onClick={() => navigate('/new-consultation')}
							className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-white"
						>
							<FaPlus size={14} />
							<span>New Consultation</span>
						</button>
					)}
				</div>

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
					</div>
				) : error ? (
					<div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-6 py-4 rounded-lg">
						<div className="flex items-center">
							<svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							{error}
						</div>
					</div>
				) : !isLoggedIn ? (
					<FeaturedSection onLogin={() => setShowLoginModal(true)} onRegister={() => setShowRegisterModal(true)} />
				) : consultations.length === 0 ? (
					<EmptyState
						title="No consultations yet"
						message="Start by creating your first patient consultation record."
						buttonText="Create Consultation"
						onClick={() => navigate('/new-consultation')}
						icon={<FaNotesMedical size={48} />}
					/>
				) : (
					<ConsultationList consultations={consultations} />
				)}
			</main>

			{/* Footer */}
			<footer className="bg-gray-800 border-t border-gray-700 py-6 mt-12">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center mb-4 md:mb-0">
							<svg className="w-6 h-6 text-purple-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M17 2L12 7L7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M12 7V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							<span className="text-white font-medium">ExerciseMD</span>
						</div>
						<div className="text-gray-400 text-sm">
							© 2025 ExerciseMD. All rights reserved.
						</div>
					</div>
				</div>
			</footer>

			{showLoginModal && <TherapistLogin onClose={handleLoginClose} onRegister={toggleAuthModals} />}
			{showRegisterModal && <TherapistRegister onClose={handleRegisterClose} onLogin={toggleAuthModals} />}
			{showNotActivatedModal && <AccountNotActivatedModal onLgin={handleNotActivatedClose} onClose={() => setShowNotActivatedModal(false)} />}
			{showSuccessModal && <RegistrationSuccessModal onClose={handleSuccessModalClose} />}
		</div>
	);
};

export default TherapistDashboard;