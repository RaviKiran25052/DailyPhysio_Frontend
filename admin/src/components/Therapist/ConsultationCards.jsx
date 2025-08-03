import { useState } from 'react';
import { RiCalendarLine, RiRunLine } from 'react-icons/ri';
import ConsultationDetails from './ConsultationDetails';

const ConsultationCards = ({ consultations }) => {
	const [isConsultation, setIsConsultation] = useState(false);
	const [consultation, setConsultation] = useState(null);

	const showConsultation = (consultation) => {
		setIsConsultation(true);
		setConsultation(consultation)
	}

	if (isConsultation) {
		return (
			<ConsultationDetails consultation={consultation} onBack={() => setIsConsultation(false)} />
		)
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{consultations.map((consultation) => (
				<div
					key={consultation._id}
					className="bg-gray-800 rounded-xl border border-gray-700 hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
					onClick={() => showConsultation(consultation)}
				>
					<div className="p-6">
						{/* Patient Info */}
						<div className="flex justify-between items-start mb-4">
							<div className='flex items-center space-x-4'>
								<img
									src={consultation.patient_id.profileImage}
									alt={consultation.patient_id.fullName}
									className="w-12 h-12 rounded-full object-cover"
								/>
								<div>
									<div className="font-medium">{consultation.patient_id.fullName}</div>
									<div className="text-sm text-gray-400">{consultation.patient_id.email}</div>
								</div>
							</div>
							{/* Status Badge */}
							<span className={`px-2 rounded-full text-sm ${consultation.request.status === 'active'
								? 'bg-green-500 bg-opacity-20 text-green-500'
								: 'bg-yellow-500 bg-opacity-20 text-yellow-500'
								}`}>
								{consultation.request.status}
							</span>
						</div>

						{/* Date Info */}
						<div className="flex items-center space-x-3 mb-4">
							<RiCalendarLine className="text-primary-500" size={20} />
							<div>
								<div className="text-sm text-gray-400">Created</div>
								<div className="font-medium">{new Date(consultation.createdAt).toLocaleDateString()}</div>
							</div>
						</div>

						{/* Exercise Count */}
						<div className="flex items-center space-x-3 mb-4">
							<RiRunLine className="text-primary-500" size={20} />
							<div>
								<div className="text-sm text-gray-400">Exercises</div>
								<div className="font-medium">{consultation.recommendedExercises.length} assigned</div>
							</div>
						</div>

						{/* Notes Preview */}
						{consultation.notes && (
							<div className="mt-4 pt-4 border-t border-gray-700">
								<div className="text-sm text-gray-400 mb-2">Notes</div>
								<p className="text-sm line-clamp-2">{consultation.notes}</p>
							</div>
						)}

						{/* View Details Button */}
						<button className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
							View Details
						</button>
					</div>
				</div>
			))}
		</div>
	)
}

export default ConsultationCards