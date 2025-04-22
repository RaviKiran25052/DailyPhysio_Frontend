import React from 'react';

const ExerciseTabs = ({ activeTab, onTabChange, counts }) => {
	const tabs = [
		{ id: 'all', label: 'All', count: counts.all },
		{ id: 'premium', label: 'Premium', count: counts.premium },
		{ id: 'custom', label: 'Custom', count: counts.custom }
	];

	return (
		<div className="border-b border-gray-700 mb-6">
			<div className="flex space-x-4">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={`py-3 px-4 text-lg font-medium border-b-2 ${activeTab === tab.id
								? 'border-purple-500 text-purple-400'
								: 'border-transparent text-gray-400 hover:text-purple-300 hover:border-gray-600'
							}`}
					>
						{tab.label} ({tab.count})
					</button>
				))}
			</div>
		</div>
	);
};

export default ExerciseTabs;