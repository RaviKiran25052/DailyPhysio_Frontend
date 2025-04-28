import React from 'react'
import { FileEdit, Globe, Lock } from 'lucide-react';

const EmptyState = ({ type, onCreate }) => {
	return (
		<div className="text-center py-12">
			<div className="flex justify-center mb-4">
				{type === 'public' ? (
					<Globe size={48} className="text-purple-400" />
				) : (
					<Lock size={48} className="text-gray-400" />
				)}
			</div>
			<p className={`italic mb-6 ${type === 'public' ? 'text-purple-400' : 'text-gray-400'}`}>
				You have no {type} exercises
			</p>
			<button
				className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition flex items-center justify-center mx-auto"
				onClick={() => onCreate(type)}
			>
				<FileEdit size={16} className="mr-2" />
				Create {type === 'public' ? 'Public' : 'Private'} Exercise
			</button>
		</div>
	);
};

export default EmptyState