import React from 'react';
import { FaUsers, FaDumbbell, FaUserMd, FaCrown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StatCards = ({ totals, analyticsData }) => {
	// Calculate percentages
	const proUserPercentage = analyticsData?.users?.proUsersCount
		? Math.round((analyticsData.users.proUsersCount / totals.users) * 100)
		: 0;

	const premiumExercisesPercentage = analyticsData?.exercises?.premiumCount
		? Math.round((analyticsData.exercises.premiumCount / totals.exercises) * 100)
		: 0;

	const cards = [
		{
			title: 'Total Users',
			count: totals.users,
			icon: FaUsers,
			color: 'blue',
			path: '/admin/users',
			detail: `${analyticsData?.users?.proUsersCount || 0} Pro Users (${proUserPercentage}%)`,
			bgColor: 'bg-blue-100',
			iconColor: 'text-blue-500',
			borderColor: 'border-blue-200',
			detailColor: 'text-blue-600'
		},
		{
			title: 'Total Exercises',
			count: totals.exercises,
			icon: FaDumbbell,
			color: 'green',
			path: '/admin/exercises',
			detail: `${analyticsData?.exercises?.premiumCount || 0} Premium (${premiumExercisesPercentage}%)`,
			bgColor: 'bg-green-100',
			iconColor: 'text-green-500',
			borderColor: 'border-green-200',
			detailColor: 'text-green-600'
		},
		{
			title: 'Therapists',
			count: totals.therapists,
			icon: FaUserMd,
			color: 'purple',
			path: '/admin/therapists',
			detail: `${analyticsData?.therapists?.statusCounts?.active || 0} Active`,
			bgColor: 'bg-purple-100',
			iconColor: 'text-purple-500',
			borderColor: 'border-purple-200',
			detailColor: 'text-purple-600'
		},
		{
			title: 'Pro Subscriptions',
			count: analyticsData?.users?.proUsersCount || 0,
			icon: FaCrown,
			color: 'amber',
			path: '/admin/subscriptions',
			detail: `${analyticsData?.users?.proUserExercisesCount || 0} Pro Exercises Created`,
			bgColor: 'bg-amber-100',
			iconColor: 'text-amber-500',
			borderColor: 'border-amber-200',
			detailColor: 'text-amber-600'
		}
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{cards.map((card, index) => (
				<Link
					to={card.path}
					key={index}
					className={`${card.bgColor} border ${card.borderColor} rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300`}
				>
					<div className="flex items-center justify-between">
						<div className="flex-1">
							<h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
							<div className="mt-1 flex items-baseline">
								<p className="text-3xl font-semibold text-gray-800">{card.count}</p>
							</div>
							<p className={`text-xs mt-2 ${card.detailColor}`}>{card.detail}</p>
						</div>
						<div className={`p-3 rounded-full ${card.bgColor} ${card.iconColor}`}>
							<card.icon className="h-6 w-6" />
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};

export default StatCards;