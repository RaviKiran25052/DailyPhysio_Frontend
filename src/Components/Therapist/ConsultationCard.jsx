import { FaCalendarAlt, FaStethoscope, FaUser, FaNotesMedical } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ConsultationCard = ({ consultation }) => {
	const navigate = useNavigate();

	// Format date
	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'short', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	// Get status color
	const getStatusColor = (status) => {
		switch (status) {
			case 'active':
				return 'bg-green-900 text-green-300';
			case 'inactive':
				return 'bg-gray-900 text-gray-300';
			default:
				return 'bg-gray-900 text-gray-300';
		}
	};

	return (
		<div
			className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
			onClick={() => navigate(`/consultation/${consultation._id}`)}
		>
			<div className="h-2 bg-purple-600"></div>
			<div className="p-5 border-b border-gray-700">
				<div className="flex justify-between items-start">
					<h3 className="text-lg font-semibold text-white truncate">
						{consultation.patient_id?.name || "Patient"}
					</h3>
					<span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(consultation.request?.status)}`}>
						{consultation.request?.status || "Unknown"}
					</span>
				</div>
			</div>

			<div className="p-5 space-y-4">
				<div className="flex items-center text-gray-400">
					<FaCalendarAlt className="mr-3 text-purple-500" />
					<span>{formatDate(consultation.createdAt)}</span>
				</div>

				<div className="flex items-center text-gray-400">
					<FaUser className="mr-3 text-purple-500" />
					<span>Therapist: {consultation.therapist_id?.name || "Unknown"}</span>
				</div>

				<div className="flex items-center text-gray-400">
					<FaStethoscope className="mr-3 text-purple-500" />
					<span className="truncate">Active days: {consultation.request?.activeDays || 0}</span>
				</div>

				{consultation.notes && (
					<div className="flex items-center text-gray-400">
						<FaNotesMedical className="mr-3 text-purple-500" />
						<span className="truncate">{consultation.notes}</span>
					</div>
				)}
			</div>

			<div className="bg-gray-900 px-5 py-4">
				<div className="flex justify-between items-center">
					<span className="text-sm text-gray-400">
						Recommended exercises: {consultation.recommendedExercises?.length || 0}
					</span>
					<span className="text-purple-500 font-medium">
						{new Date(consultation.updatedAt || consultation.createdAt).toLocaleDateString()}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ConsultationCard;