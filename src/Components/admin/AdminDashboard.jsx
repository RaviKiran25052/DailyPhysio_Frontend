import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCards from './components/StatCards';
import UserDistributionChart from './components/UserDistributionChart';
import ExerciseCreationChart from './components/ExerciseCreationChart';
import ExerciseCategoryChart from './components/ExerciseCategoryChart';
import ExercisePositionChart from './components/ExercisePositionChart';
import TherapistSpecializationChart from './components/TherapistSpecializationChart';
import TherapistStatusChart from './components/TherapistStatusChart';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
	const navigate = useNavigate();
	const [adminInfo, setAdminInfo] = useState(null);
	const [analyticsData, setAnalyticsData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleLogout = () => {
		localStorage.clear();
		sessionStorage.clear();
		navigate('/admin/login');
	};

	useEffect(() => {
		// Check if admin is logged in
		const loggedInAdmin = localStorage.getItem('adminInfo')
			? JSON.parse(localStorage.getItem('adminInfo'))
			: sessionStorage.getItem('adminInfo')
				? JSON.parse(sessionStorage.getItem('adminInfo'))
				: null;

		if (!loggedInAdmin) {
			navigate('/admin/login');
			return;
		}

		setAdminInfo(loggedInAdmin);

		// Fetch analytics data
		const fetchAnalytics = async () => {
			try {
				setLoading(true);
				const config = {
					headers: {
						Authorization: `Bearer ${loggedInAdmin.token}`,
					},
				};

				const { data } = await axios.get(`${BASE_URL}/admin/analytics`, config);

				if (data.success) {
					setAnalyticsData(data.data);
				} else {
					toast.error('Failed to load analytics data');
				}

				setLoading(false);
			} catch (error) {
				console.error('Error fetching analytics:', error);
				setLoading(false);
				toast.error('Failed to load dashboard data');

				// If token is invalid, redirect to login
				if (error.response && error.response.status === 401) {
					handleLogout();
				}
			}
		};

		fetchAnalytics();
	}, [navigate]);

	// Calculate totals
	const calculateTotals = () => {
		if (!analyticsData) return { users: 0, exercises: 0, therapists: 0 };

		const users =
			(analyticsData.users.regularUsersCount || 0) +
			(analyticsData.users.proUsersCount || 0) +
			(analyticsData.users.therapistCreatedUsersCount || 0);

		const exercises =
			(analyticsData.exercises.exercisesByCreator.therapist || 0) +
			(analyticsData.exercises.exercisesByCreator.proUser || 0) +
			(analyticsData.exercises.exercisesByCreator.admin || 0);

		const therapists = Object.values(analyticsData.therapists.statusCounts).reduce((sum, count) => sum + count, 0);

		return { users, exercises, therapists };
	};

	const totals = calculateTotals();

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Sidebar */}
			<Sidebar isOpen={sidebarOpen} />

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header
					adminInfo={adminInfo}
					handleLogout={handleLogout}
					toggleSidebar={toggleSidebar}
				/>

				{/* Dashboard Content */}
				<main className="flex-1 overflow-y-auto bg-gray-50 p-4">
					<div className="max-w-7xl mx-auto">
						<h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>

						{loading ? (
							<div className="flex justify-center items-center h-64">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
							</div>
						) : (
							<>
								{/* Stat Cards */}
								<StatCards totals={totals} analyticsData={analyticsData} />

								{/* Charts Grid */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
									{analyticsData && (
										<>
											{/* User Distribution */}
											<div className="bg-white p-6 rounded-lg shadow">
												<h2 className="text-lg font-medium text-gray-700 mb-4">User Distribution</h2>
												<UserDistributionChart userData={analyticsData.users} />
											</div>

											{/* Exercise Creation Distribution */}
											<div className="bg-white p-6 rounded-lg shadow">
												<h2 className="text-lg font-medium text-gray-700 mb-4">Exercise Creation Source</h2>
												<ExerciseCreationChart exerciseData={analyticsData.exercises.exercisesByCreator} />
											</div>

											{/* Exercise Categories */}
											<div className="bg-white p-6 rounded-lg shadow">
												<h2 className="text-lg font-medium text-gray-700 mb-4">Exercise Categories</h2>
												<ExerciseCategoryChart categoryData={analyticsData.exercises.categoryCounts} />
											</div>

											{/* Exercise Positions */}
											<div className="bg-white p-6 rounded-lg shadow">
												<h2 className="text-lg font-medium text-gray-700 mb-4">Exercise Positions</h2>
												<ExercisePositionChart positionData={analyticsData.exercises.positionCounts} />
											</div>

											{/* Therapist Specializations */}
											<div className="bg-white p-6 rounded-lg shadow">
												<h2 className="text-lg font-medium text-gray-700 mb-4">Therapist Specializations</h2>
												<TherapistSpecializationChart specializationData={analyticsData.therapists.specializationCounts} />
											</div>

											{/* Therapist Status */}
											<div className="bg-white p-6 rounded-lg shadow">
												<h2 className="text-lg font-medium text-gray-700 mb-4">Therapist Status</h2>
												<TherapistStatusChart statusData={analyticsData.therapists.statusCounts} />
											</div>
										</>
									)}
								</div>
							</>
						)}

						{/* Last Updated */}
						{analyticsData && (
							<div className="mt-6 text-sm text-gray-500 text-right">
								Last updated: {new Date(analyticsData.timestamp).toLocaleString()}
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdminDashboard;