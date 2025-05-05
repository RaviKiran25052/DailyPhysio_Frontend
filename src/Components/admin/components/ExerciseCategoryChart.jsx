import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExerciseCategoryChart = ({ categoryData }) => {
	// Convert object to array for chart
	const data = Object.entries(categoryData || {})
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
							bottom: 50,
						}}
						layout="vertical"
					>
						<CartesianGrid strokeDasharray="3 3" horizontal={false} />
						<XAxis type="number" />
						<YAxis
							dataKey="name"
							type="category"
							width={100}
							tick={{ fontSize: 12 }}
							tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 10)}...` : value}
						/>
						<Tooltip
							formatter={(value, name, props) => [`${value} exercises`, 'Count']}
							labelFormatter={(label) => label}
						/>
						<Bar dataKey="value" fill="#8B5CF6" />
					</BarChart>
				</ResponsiveContainer>
			) : (
				<div className="h-full flex items-center justify-center text-gray-500">
					No category data available
				</div>
			)}
		</div>
	);
};

export default ExerciseCategoryChart;