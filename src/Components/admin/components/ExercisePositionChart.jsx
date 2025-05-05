import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExercisePositionChart = ({ positionData }) => {
	// Convert object to array for chart
	const data = Object.entries(positionData || {})
		.map(([name, value]) => ({ name, value }))
		.filter(item => item.value > 0)
		.sort((a, b) => b.value - a.value); // Sort by value descending

	return (
		<div className="h-64">
			{data.length > 0 ? (
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="name"
							tick={{ fontSize: 12 }}
							interval={0}
							tickFormatter={(value) => value.length > 8 ? `${value.substring(0, 6)}...` : value}
							angle={-45}
							textAnchor="end"
							height={60}
						/>
						<YAxis />
						<Tooltip
							formatter={(value, name, props) => [`${value} exercises`, 'Count']}
							labelFormatter={(label) => label}
						/>
						<Bar dataKey="value" fill="#10B981" />
					</BarChart>
				</ResponsiveContainer>
			) : (
				<div className="h-full flex items-center justify-center text-gray-500">
					No position data available
				</div>
			)}
		</div>
	);
};

export default ExercisePositionChart;