import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
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

const Dashboard = () => {
	const [analyticsData, setAnalyticsData] = useState({
		consultations: 150,
		followers: 75,
		createdUsers: 45,
		createdExercises: 30,
		monthlyConsultations: [20, 25, 30, 35, 28, 32],
		exerciseCategories: {
			'Physical Therapy': 15,
			'Occupational Therapy': 8,
			'Speech Therapy': 7
		}
	});

	// Bar chart data
	const barData = {
		labels: ['January', 'February', 'March', 'April', 'May', 'June'],
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
		labels: Object.keys(analyticsData.exerciseCategories),
		datasets: [
			{
				data: Object.values(analyticsData.exerciseCategories),
				backgroundColor: [
					'rgba(147, 51, 234, 0.7)',
					'rgba(168, 85, 247, 0.7)',
					'rgba(192, 132, 252, 0.7)',
				],
				borderColor: [
					'rgb(147, 51, 234)',
					'rgb(168, 85, 247)',
					'rgb(192, 132, 252)',
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

	return (
		<div className="p-6">
			{/* Analytics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
					<div className="flex items-center justify-between mb-4">
						<div className="text-gray-400">Total Consultations</div>
						<RiFileListLine className="text-purple-500" size={24} />
					</div>
					<div className="text-3xl font-bold">{analyticsData.consultations}</div>
				</div>

				<div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
					<div className="flex items-center justify-between mb-4">
						<div className="text-gray-400">Followers</div>
						<RiUserFollowLine className="text-purple-500" size={24} />
					</div>
					<div className="text-3xl font-bold">{analyticsData.followers}</div>
				</div>

				<div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
					<div className="flex items-center justify-between mb-4">
						<div className="text-gray-400">Created Users</div>
						<RiUserLine className="text-purple-500" size={24} />
					</div>
					<div className="text-3xl font-bold">{analyticsData.createdUsers}</div>
				</div>

				<div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
					<div className="flex items-center justify-between mb-4">
						<div className="text-gray-400">Created Exercises</div>
						<RiRunLine className="text-purple-500" size={24} />
					</div>
					<div className="text-3xl font-bold">{analyticsData.createdExercises}</div>
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
