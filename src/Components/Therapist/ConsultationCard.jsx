import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaStethoscope, FaMapMarkerAlt } from 'react-icons/fa';

const ConsultationCard = ({ consultation }) => {
	const navigate = useNavigate();

	// Format date
	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'short', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	return (
		<div
			className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
			onClick={() => navigate(`/consultation/${consultation._id}`)}
		>
			<div className="p-5 border-b border-gray-700">
				<div className="flex justify-between items-start">
					<h3 className="text-lg font-semibold text-white truncate">
						{consultation.patientName}
					</h3>
					<span className={`px-2 py-1 text-xs rounded-full ${consultation.status === 'Completed' ? 'bg-green-900 text-green-300' : consultation.status === 'Scheduled' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'}`}>
						{consultation.status}
					</span>
				</div>
			</div>

			<div className="p-5 space-y-3">
				<div className="flex items-center text-gray-400">
					<FaCalendarAlt className="mr-2 text-purple-500" />
					<span>{formatDate(consultation.date)}</span>
				</div>

				<div className="flex items-center text-gray-400">
					<FaUser className="mr-2 text-purple-500" />
					<span>{consultation.patientAge} years, {consultation.patientGender}</span>
				</div>

				<div className="flex items-center text-gray-400">
					<FaStethoscope className="mr-2 text-purple-500" />
					<span>{consultation.condition}</span>
				</div>

				{consultation.location && (
					<div className="flex items-center text-gray-400">
						<FaMapMarkerAlt className="mr-2 text-purple-500" />
						<span className="truncate">{consultation.location}</span>
					</div>
				)}
			</div>

			<div className="bg-gray-900 px-5 py-3">
				<div className="flex justify-between items-center">
					<span className="text-sm text-gray-400">
						{consultation.sessionType}
					</span>
					<span className="text-purple-500 font-medium">
						{consultation.duration} min
					</span>
				</div>
			</div>
		</div>
	);
};

export default ConsultationCard;