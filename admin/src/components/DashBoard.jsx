import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DashBoard = () => {
	const [loading, setLoading] = useState(true);
	const [analyticsData, setAnalyticsData] = useState({
		users: {
			regularUsersCount: 0,
			proUsersCount: 0,
			monthlyCount: 0,
			yearlyCount: 0,
			therapistCreatedUsersCount: 0,
			proUserExercisesCount: 0
		},
		exercises: {
			exercisesByCreator: {
				therapist: 0,
				proUser: 0,
				admin: 0
			},
			categoryCounts: {},
			positionCounts: {},
			premiumCount: 0,
			freeCount: 0
		},
		therapists: {
			statusCounts: {
				active: 0,
				inactive: 0,
				rejected: 0,
				pending: 0,
				total: 0
			},
			genderCounts: {
				male: 0,
				female: 0,
				other: 0
			},
			specializationCounts: {}
		},
	});
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear();
		navigate('/admin/login');
	};

	useEffect(() => {
		// Check if admin is logged in
		const loggedInAdmin = localStorage.getItem('adminInfo')
			? JSON.parse(localStorage.getItem('adminInfo'))
			: null;

		if (!loggedInAdmin) {
			navigate('/admin/login');
			return;
		}

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

	const userMembershipData = [
		{ name: 'Free', value: analyticsData?.users?.regularUsersCount - analyticsData?.users?.monthlyCount - analyticsData?.users?.yearlyCount },
		{ name: 'Monthly', value: analyticsData?.users?.monthlyCount },
		{ name: 'Yearly', value: analyticsData?.users?.yearlyCount }
	];

	const exercisesByCreatorData = [
		{ name: 'Admin', value: analyticsData?.exercises?.exercisesByCreator?.admin },
		{ name: 'Therapist', value: analyticsData?.exercises?.exercisesByCreator?.therapist },
		{ name: 'Pro Users', value: analyticsData?.exercises?.exercisesByCreator?.proUser }
	];

	const therapistStatusData = [
		{ name: 'Active', value: analyticsData?.therapists?.statusCounts?.active },
		{ name: 'Inactive', value: analyticsData?.therapists?.statusCounts?.inactive },
		{ name: 'Rejected', value: analyticsData?.therapists?.statusCounts?.rejected }
	];

	// Format data for bar charts
	const categoryCountsData = Object.entries(analyticsData?.exercises?.categoryCounts)
		.map(([name, value]) => ({ name, value }))
		.filter(item => item.value > 0);

	const positionCountsData = Object.entries(analyticsData?.exercises?.positionCounts)
		.map(([name, value]) => ({ name, value }))
		.filter(item => item.value > 0);

	const specializationCountsData = Object.entries(analyticsData?.therapists?.specializationCounts)
		.map(([name, value]) => ({ name, value }))
		.filter(item => item.value > 0);

	// Purple color variants for the charts
	const purpleColors = [
		'rgb(233, 213, 255)', // purple-100
		'rgb(221, 189, 255)', // purple-200
		'rgb(196, 149, 253)', // purple-300
		'rgb(168, 101, 245)', // purple-400
		'rgb(147, 64, 236)', // purple-500
		'rgb(128, 38, 219)', // purple-600
		'rgb(109, 24, 192)', // purple-700
		'rgb(88, 17, 158)', // purple-800
		'rgb(73, 13, 130)', // purple-900
	];

	// Custom Recharts Tooltip component
	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-gray-800 text-white p-2 rounded-md border border-purple-500 shadow-lg">
					<p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
				</div>
			);
		}
		return null;
	};

	// Function to get gradient colors for each dataset
	// This creates a visual distinction between charts without modifying purpleColors
	const getChartColors = (dataIndex) => {
		switch (dataIndex) {
			case 0: // Lighter purples for User membership
				return [purpleColors[1], purpleColors[3], purpleColors[5]];
			case 1: // Medium purples for Exercises by Creator
				return [purpleColors[2], purpleColors[4], purpleColors[6]];
			case 2: // Darker purples for Therapist Status
				return [purpleColors[4], purpleColors[6], purpleColors[8]];
			default:
				return purpleColors;
		}
	};

	const renderDonutChart = (data, title, icon, index) => {
		const chartColors = getChartColors(index);

		return (
			<div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl shadow-lg p-5 border border-purple-600/50 transition-all duration-300 hover:shadow-xl hover:border-purple-500">
				<div className="flex items-center justify-center mb-3">
					<div className="p-2 bg-purple-700/30 rounded-lg mr-2">
						{icon}
					</div>
					<h3 className="text-lg font-semibold text-purple-200">{title}</h3>
				</div>
				<div className="bg-gray-800/40 rounded-lg p-3 backdrop-blur-sm">
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={data}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={80}
									paddingAngle={5}
									dataKey="value"
									labelLine={false}
								>
									{data.map((entry, cellIndex) => (
										<Cell
											key={`cell-${cellIndex}`}
											fill={chartColors[cellIndex % chartColors.length]}
											className="filter drop-shadow-md hover:brightness-110 transition-all"
										/>
									))}
								</Pie>
								<Tooltip content={<CustomTooltip />} />
								<Legend
									formatter={(value) => <span className="text-purple-200 text-sm">{value}</span>}
									wrapperStyle={{ paddingTop: "8px" }}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		);
	};

	const userIcon = (
		<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
		</svg>
	);

	const exerciseIcon = (
		<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
		</svg>
	);

	const therapistIcon = (
		<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
		</svg>
	);

	return (
		<>
			{loading ?
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
				</div>
				:
				<div className="bg-gray-900 text-white px-6">
					{/* SECTION 1: INFO CARDS */}
					<h2 className="text-2xl font-bold mb-6 text-purple-100 border-b border-purple-500 pb-2">
						Overview Stats
					</h2>
					<div className="grid grid-cols-4 gap-6 mb-8">
						{/* Card 1: User Counts */}
						<div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl shadow-lg p-4 border border-purple-700/50 transition-all duration-300 hover:shadow-xl hover:scale-102 hover:border-purple-500">
							<div className="flex items-center mb-3">
								<div className="p-2 bg-purple-700/30 rounded-lg mr-3">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-purple-200">User Types</h3>
							</div>
							<div className="h-px mb-2 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
							<div className="space-y-1">
								<div className="flex justify-between items-center">
									<p className="text-sm text-purple-300 font-medium">Regular Users</p>
									<p className="text-2xl font-bold text-white">{analyticsData?.users?.regularUsersCount}</p>
								</div>
								<div className="flex justify-between items-center">
									<p className="text-sm text-purple-300 font-medium">Pro Users</p>
									<p className="text-2xl font-bold text-white">{analyticsData?.users?.proUsersCount}</p>
								</div>
							</div>
						</div>

						{/* Card 2: User Creation Sources */}
						<div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl shadow-lg p-4 border border-purple-600/50 transition-all duration-300 hover:shadow-xl hover:scale-102 hover:border-purple-400">
							<div className="flex items-center mb-3">
								<div className="p-2 bg-purple-600/30 rounded-lg mr-3">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-purple-200">User Sources</h3>
							</div>
							<div className="h-px mb-2 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
							<div className="space-y-1">
								<div className="flex justify-between items-center">
									<p className="text-sm text-purple-200 font-medium">Users Registered</p>
									<p className="text-2xl font-bold text-white">{analyticsData?.users?.regularUsersCount + analyticsData?.users?.proUsersCount - analyticsData?.users?.therapistCreatedUsersCount}</p>
								</div>
								<div className="flex justify-between items-center">
									<p className="text-sm text-purple-200 font-medium">Therapist Created</p>
									<p className="text-2xl font-bold text-white">{analyticsData?.users?.therapistCreatedUsersCount}</p>
								</div>
							</div>
						</div>

						{/* Card 3: Exercise Types */}
						<div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl shadow-lg p-4 border border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:scale-102 hover:border-purple-300">
							<div className="flex items-center mb-3">
								<div className="p-2 bg-purple-500/30 rounded-lg mr-3">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-purple-100">Exercise Types</h3>
							</div>
							<div className="h-px mb-2 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
							<div className="space-y-1">
								<div className="flex justify-between items-center">
									<p className="text-sm text-purple-100 font-medium">Free Exercises</p>
									<p className="text-2xl font-bold text-white">{analyticsData?.exercises?.freeCount}</p>
								</div>
								<div className="flex justify-between items-center">
									<p className="text-sm text-purple-100 font-medium">Premium Exercises</p>
									<p className="text-2xl font-bold text-white">{analyticsData?.exercises?.premiumCount}</p>
								</div>
							</div>
						</div>

						{/* Card 4: Active Therapists */}
						<div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl shadow-lg p-4 border border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:scale-102 hover:border-purple-200">
							<div className="flex items-center mb-3">
								<div className="p-2 bg-purple-400/30 rounded-lg mr-3">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-purple-50">Therapists</h3>
							</div>
							<div className="h-px mb-2 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
							<div className="space-y-1">
								<div className="flex justify-between items-center">
									<p className="text-sm text-purple-100 font-medium">Active Therapists</p>
									<p className="text-2xl font-bold text-white">{analyticsData?.therapists?.statusCounts?.active}</p>
								</div>
								<div className="flex justify-between items-center">
									<p className="text-sm text-purple-100 font-medium">Total Therapists</p>
									<p className="text-2xl font-bold text-white">{analyticsData?.therapists?.statusCounts?.total}</p>
								</div>
							</div>
						</div>
					</div>

					{/* SECTION 2: DOUGHNUT CHARTS */}
					<h2 className="text-2xl font-bold mb-6 text-purple-100 border-b border-purple-500 pb-2 flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
						Distribution Analysis
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						{renderDonutChart(userMembershipData, "User Membership", userIcon, 0)}
						{renderDonutChart(exercisesByCreatorData, "Exercises by Creator", exerciseIcon, 1)}
						{renderDonutChart(therapistStatusData, "Therapist Status", therapistIcon, 2)}
					</div>

					{/* SECTION 3: BAR CHARTS */}
					<h2 className="text-2xl font-bold mb-6 text-purple-100 border-b border-purple-500 pb-2 flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						Detailed Breakdowns
					</h2>
					<div className="space-y-8">
						{/* Bar Chart 1: Exercise Categories */}
						<div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl shadow-lg p-5 border border-purple-600/50 transition-all duration-300 hover:shadow-xl hover:border-purple-500">
							<div className="flex items-center mb-4">
								<div className="p-2 bg-purple-700/30 rounded-lg mr-3">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-purple-200">Exercise Categories</h3>
							</div>
							<div className="bg-gray-800/40 rounded-lg p-4 backdrop-blur-sm">
								<div className="h-64">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={categoryCountsData}
											margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
										>
											<defs>
												{purpleColors.map((color, index) => (
													<linearGradient key={`gradient-${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
														<stop offset="5%" stopColor={color} stopOpacity={0.9} />
														<stop offset="95%" stopColor={color} stopOpacity={0.6} />
													</linearGradient>
												))}
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
											<XAxis
												dataKey="name"
												stroke="#a78bfa"
												angle={-45}
												textAnchor="end"
												height={80}
												tick={{ fontSize: 12, fill: "#d8b4fe" }}
												tickLine={{ stroke: "#a78bfa" }}
											/>
											<YAxis
												stroke="#a78bfa"
												tick={{ fill: "#d8b4fe" }}
												tickLine={{ stroke: "#a78bfa" }}
											/>
											<Tooltip
												content={<CustomTooltip />}
												wrapperStyle={{
													background: "rgba(45, 25, 66, 0.9)",
													border: "1px solid rgba(168, 85, 247, 0.4)",
													borderRadius: "0.5rem",
													boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
												}}
											/>
											<Bar
												dataKey="value"
												animationDuration={1500}
												className="transition-all duration-300"
											>
												{categoryCountsData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill='#a246ff'
														className="cursor-pointer"
													/>
												))}
											</Bar>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>

						{/* Bar Chart 2: Exercise Positions (Horizontal) */}
						<div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl shadow-lg p-5 border border-purple-600/50 transition-all duration-300 hover:shadow-xl hover:border-purple-500">
							<div className="flex items-center mb-4">
								<div className="p-2 bg-purple-700/30 rounded-lg mr-3">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-purple-200">Exercise Positions</h3>
							</div>
							<div className="bg-gray-800/40 rounded-lg p-4 backdrop-blur-sm">
								<div className="h-64">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											layout="vertical"
											data={positionCountsData}
											margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
										>
											<defs>
												{purpleColors.map((color, index) => (
													<linearGradient key={`gradient-pos-${index}`} id={`posGradient${index}`} x1="0" y1="0" x2="1" y2="0">
														<stop offset="5%" stopColor={color} stopOpacity={0.9} />
														<stop offset="95%" stopColor={color} stopOpacity={0.6} />
													</linearGradient>
												))}
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} opacity={0.3} />
											<XAxis
												type="number"
												stroke="#a78bfa"
												tick={{ fill: "#d8b4fe" }}
												tickLine={{ stroke: "#a78bfa" }}
											/>
											<YAxis
												dataKey="name"
												type="category"
												stroke="#a78bfa"
												tick={{ fontSize: 12, fill: "#d8b4fe" }}
												width={80}
												tickLine={{ stroke: "#a78bfa" }}
											/>
											<Tooltip
												content={<CustomTooltip />}
												wrapperStyle={{
													background: "rgba(45, 25, 66, 0.9)",
													border: "1px solid rgba(168, 85, 247, 0.4)",
													borderRadius: "0.5rem",
													boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
												}}
											/>
											<Bar
												dataKey="value"
												animationDuration={1500}
												className="transition-all duration-300"
											>
												{positionCountsData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill="#a246ff"
														className="cursor-pointer"
													/>
												))}
											</Bar>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>

						{/* Bar Chart 3: Therapist Specializations (Horizontal) */}
						<div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl shadow-lg p-5 border border-purple-600/50 transition-all duration-300 hover:shadow-xl hover:border-purple-500">
							<div className="flex items-center mb-4">
								<div className="p-2 bg-purple-700/30 rounded-lg mr-3">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-purple-200">Therapist Specializations</h3>
							</div>
							<div className="bg-gray-800/40 rounded-lg p-4 backdrop-blur-sm">
								<div className="h-64">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											layout="vertical"
											data={specializationCountsData}
											margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
										>
											<defs>
												{purpleColors.map((color, index) => (
													<linearGradient key={`gradient-spec-${index}`} id={`specGradient${index}`} x1="0" y1="0" x2="1" y2="0">
														<stop offset="5%" stopColor={color} stopOpacity={0.9} />
														<stop offset="95%" stopColor={color} stopOpacity={0.6} />
													</linearGradient>
												))}
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} opacity={0.3} />
											<XAxis
												type="number"
												stroke="#a78bfa"
												tick={{ fill: "#d8b4fe" }}
												tickLine={{ stroke: "#a78bfa" }}
											/>
											<YAxis
												dataKey="name"
												type="category"
												stroke="#a78bfa"
												tick={{ fontSize: 12, fill: "#d8b4fe" }}
												width={100}
												tickLine={{ stroke: "#a78bfa" }}
											/>
											<Tooltip
												content={<CustomTooltip />}
												wrapperStyle={{
													background: "rgba(45, 25, 66, 0.9)",
													border: "1px solid rgba(168, 85, 247, 0.4)",
													borderRadius: "0.5rem",
													boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
												}}
											/>
											<Bar
												dataKey="value"
												animationDuration={1500}
												className="transition-all duration-300"
											>
												{specializationCountsData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill="#a246ff"
														className="cursor-pointer"
													/>
												))}
											</Bar>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>
				</div>
			}
		</>
	)
}

export default DashBoard