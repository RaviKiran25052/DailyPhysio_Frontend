import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const UserDistributionChart = ({ userData }) => {
	const data = [
		{ name: 'Regular Users', value: userData.regularUsersCount || 0, color: '#3B82F6' },
		{ name: 'Pro Users', value: userData.proUsersCount || 0, color: '#8B5CF6' },
		{ name: 'Therapist Created', value: userData.therapistCreatedUsersCount || 0, color: '#10B981' }
	].filter(item => item.value > 0);

	const COLORS = data.map(item => item.color);

	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
		const RADIAN = Math.PI / 180;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	return (
		<div className="h-64">
			{data.length > 0 ? (
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={renderCustomizedLabel}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip formatter={(value) => [`${value} users`, 'Count']} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			) : (
				<div className="h-full flex items-center justify-center text-gray-500">
					No user data available
				</div>
			)}
		</div>
	);
};

export default UserDistributionChart;