import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement
} from 'chart.js';
import { RiUserLine, RiFileListLine, RiRunLine, RiUserFollowLine } from 'react-icons/ri';

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement
);

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [analyticsData, setAnalyticsData] = useState({
		consultations: 0,
		followers: 0,
		createdUsers: 0,
		createdExercises: 0,
		monthlyConsultations: [],
		exerciseCategories: {}
	});

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
				const response = await axios.get(`${API_URL}/therapist/analytics`, {
					headers: {
						Authorization: `Bearer ${therapistInfo.token}`
					}
				});

				setAnalyticsData(response.data);
				setLoading(false);
			} catch (err) {
				console.error('Error fetching analytics:', err);
				setError('Failed to load analytics data');
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, []);

	// Get last 6 months for labels
	const getLastSixMonths = () => {
		const months = [];
		const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'];

		for (let i = 5; i >= 0; i--) {
			const d = new Date();
			d.setMonth(d.getMonth() - i);
			months.push(monthNames[d.getMonth()]);
		}
		return months;
	};

	// Bar chart data
	const barData = {
		labels: getLastSixMonths(),
		datasets: [
			{
				label: 'Monthly Consultations',
				data: analyticsData.monthlyConsultations,
				backgroundColor: 'rgba(147, 51, 234, 0.5)',
				borderColor: 'rgb(147, 51, 234)',
				borderWidth: 1,
			},
		],
	};

	// Doughnut chart data
	const doughnutData = {
		labels: Object.keys(analyticsData.exerciseCategories || {}),
		datasets: [
			{
				data: Object.values(analyticsData.exerciseCategories || {}),
				backgroundColor: [
					'rgba(147, 51, 234, 0.7)',
					'rgba(168, 85, 247, 0.7)',
					'rgba(192, 132, 252, 0.7)',
					'rgba(216, 180, 254, 0.7)',
					'rgba(233, 213, 255, 0.7)',
				],
				borderColor: [
					'rgb(147, 51, 234)',
					'rgb(168, 85, 247)',
					'rgb(192, 132, 252)',
					'rgb(216, 180, 254)',
					'rgb(233, 213, 255)',
				],
				borderWidth: 1,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
				labels: {
					color: 'white'
				}
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: { color: 'white' },
				grid: { color: 'rgba(255, 255, 255, 0.1)' }
			},
			x: {
				ticks: { color: 'white' },
				grid: { color: 'rgba(255, 255, 255, 0.1)' }
			}
		}
	};

	const doughnutOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
				labels: {
					color: 'white'
				}
			}
		}
	};

	if (loading) {
		return (
			<div className="p-6 flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-6 py-4 rounded-lg">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			{/* Analytics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
					<div className="flex items-center justify-between mb-4">
						<div className="text-gray-400">Total Consultations</div>
						<RiFileListLine className="text-purple-500" size={24} />
					</div>
					<div className="text-3xl font-bold">{analyticsData.consultations}</div>
					<div className="text-sm text-gray-400 mt-2">Lifetime consultations</div>
				</div>

				<div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
					<div className="flex items-center justify-between mb-4">
						<div className="text-gray-400">Followers</div>
						<RiUserFollowLine className="text-purple-500" size={24} />
					</div>
					<div className="text-3xl font-bold">{analyticsData.followers}</div>
					<div className="text-sm text-gray-400 mt-2">Total followers</div>
				</div>

				<div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
					<div className="flex items-center justify-between mb-4">
						<div className="text-gray-400">Created Users</div>
						<RiUserLine className="text-purple-500" size={24} />
					</div>
					<div className="text-3xl font-bold">{analyticsData.createdUsers}</div>
					<div className="text-sm text-gray-400 mt-2">Users created by you</div>
				</div>

				<div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
					<div className="flex items-center justify-between mb-4">
						<div className="text-gray-400">Created Exercises</div>
						<RiRunLine className="text-purple-500" size={24} />
					</div>
					<div className="text-3xl font-bold">{analyticsData.createdExercises}</div>
					<div className="text-sm text-gray-400 mt-2">Total exercises created</div>
				</div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
					<h3 className="text-xl font-semibold mb-4">Consultation Trends</h3>
					<Bar data={barData} options={chartOptions} />
				</div>

				<div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
					<h3 className="text-xl font-semibold mb-4">Exercise Categories</h3>
					<div className="h-[300px] flex items-center justify-center">
						<Doughnut data={doughnutData} options={doughnutOptions} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
