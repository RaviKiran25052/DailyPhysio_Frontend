import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TherapistStatusChart = ({ statusData }) => {
	// Status color mapping
	const statusColors = {
		active: '#10B981',  // green
		inactive: '#F59E0B', // amber
		rejected: '#EF4444', // red
		pending: '#3B82F6',  // blue
	};

	// Convert object to array for chart
	const data = Object.entries(statusData || {})
		.map(([name, value]) => ({
			name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
			value,
			color: statusColors[name] || '#6B7280' // Default gray if status doesn't match
		}))
		.filter(item => item.value > 0);

	const COLORS = data.map(item => item.color);

	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
		if (percent < 0.05) return null;

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
						<Tooltip formatter={(value) => [`${value} therapists`, 'Count']} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			) : (
				<div className="h-full flex items-center justify-center text-gray-500">
					No therapist status data available
				</div>
			)}
		</div>
	);
};

export default TherapistStatusChart;