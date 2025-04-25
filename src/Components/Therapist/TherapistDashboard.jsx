import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import EmptyState from './EmptyState';
import ConsultationList from './ConsultationList';
import TherapistHeader from './TherapistHeader';

const TherapistDashboard = () => {
	const navigate = useNavigate();
	const [consultations, setConsultations] = useState([{
		_id: '1',
		patientName: 'Sarah Johnson',
		patientAge: 35,
		patientGender: 'female',
		condition: 'Lower back pain',
		diagnosis: 'Lumbar strain',
		date: '2025-04-23T10:00:00',
		duration: 45,
		sessionType: 'In-Person',
		status: 'Completed',
		location: 'City General Hospital, Room 302'
	},
	{
		_id: '2',
		patientName: 'Michael Chen',
		patientAge: 42,
		patientGender: 'male',
		condition: 'Rotator cuff injury',
		diagnosis: 'Partial tear',
		date: '2025-04-25T14:30:00',
		duration: 60,
		sessionType: 'In-Person',
		status: 'Scheduled',
		location: 'Sports Medicine Center'
	},
	{
		_id: '3',
		patientName: 'Emma Wilson',
		patientAge: 67,
		patientGender: 'female',
		condition: 'Post-hip replacement',
		diagnosis: 'Recovery phase',
		date: '2025-04-26T09:15:00',
		duration: 45,
		sessionType: 'Home Visit',
		status: 'Scheduled',
		location: '123 Maple Street'
	},
	{
		_id: '4',
		patientName: 'Robert Davis',
		patientAge: 28,
		patientGender: 'male',
		condition: 'ACL rehabilitation',
		diagnosis: 'Post-surgical recovery',
		date: '2025-04-24T13:00:00',
		duration: 60,
		sessionType: 'In-Person',
		status: 'Completed',
		location: 'Sports Medicine Center'
	},
	{
		_id: '5',
		patientName: 'Olivia Martin',
		patientAge: 52,
		patientGender: 'female',
		condition: 'Carpal tunnel syndrome',
		diagnosis: 'Median nerve compression',
		date: '2025-04-28T11:30:00',
		duration: 30,
		sessionType: 'Telehealth',
		status: 'Scheduled',
		location: ''
	}]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const isLoggedIn = !!localStorage.getItem('therapistInfo');

	useEffect(() => {
		// Only fetch consultations if logged in
		if (isLoggedIn) {
			fetchConsultations();
		} else {
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

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<TherapistHeader />

			<main className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Your Consultations</h1>

					{isLoggedIn && (
						<button
							onClick={() => navigate('/new-consultation')}
							className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
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
					<div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded">
						{error}
					</div>
				) : !isLoggedIn ? (
					<EmptyState
						title="Welcome to PhysioConnect"
						message="Please log in to view your consultations and patient data."
						buttonText="Log In"
						onClick={() => document.querySelector('[data-modal="login"]')?.click()}
					/>
				) : consultations.length === 0 ? (
					<EmptyState
						title="No consultations yet"
						message="Start by creating your first patient consultation record."
						buttonText="Create Consultation"
						onClick={() => navigate('/new-consultation')}
					/>
				) : (
					<ConsultationList consultations={consultations} />
				)}
			</main>
		</div>
	);
};

export default TherapistDashboard;