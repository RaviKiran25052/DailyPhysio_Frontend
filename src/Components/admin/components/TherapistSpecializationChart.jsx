import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TherapistSpecializationChart = ({ specializationData }) => {
	// Convert object to array for chart
	const data = Object.entries(specializationData || {})
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
							width={120}
							tick={{ fontSize: 12 }}
							tickFormatter={(value) => value.length > 14 ? `${value.substring(0, 12)}...` : value}
						/>
						<Tooltip
							formatter={(value, name, props) => [`${value} therapists`, 'Count']}
							labelFormatter={(label) => label}
						/>
						<Bar dataKey="value" fill="#3B82F6" />
					</BarChart>
				</ResponsiveContainer>
			) : (
				<div className="h-full flex items-center justify-center text-gray-500">
					No specialization data available
				</div>
			)}
		</div>
	);
};

export default TherapistSpecializationChart;