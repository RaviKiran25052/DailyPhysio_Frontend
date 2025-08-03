import MediaCarousel from '../Exercises/MediaCarousel'
import {
	RiCalendarLine, RiUserLine, RiArrowLeftLine, RiRunLine, RiInformationLine
} from 'react-icons/ri';

const ConsultationDetails = ({ consultation, onBack }) => {
	console.log(consultation);

	function getDateDifference(expiresOn) {
		const expiresDate = new Date(expiresOn);
		const today = new Date();
		const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const expiresMidnight = new Date(expiresDate.getFullYear(), expiresDate.getMonth(), expiresDate.getDate());
		const diffTime = expiresMidnight - todayMidnight;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	return (
		<div className="animate-fadeIn">
			<button
				onClick={onBack}
				className="flex items-center space-x-2 mb-6 text-gray-400 hover:text-white border border-gray-400 p-2 rounded-md"
			>
				<RiArrowLeftLine size={20} />
				<span>Back to Consultations</span>
			</button>

			<div className="bg-gray-800 rounded-lg p-6 mb-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center">
					<RiUserLine className="mr-2 text-primary-500" />
					Patient Information
				</h3>
				<div className='flex justify-between items-center'>
					<div className="flex items-center space-x-4">
						<img
							src={consultation.patient_id.profileImage}
							alt={consultation.patient_id.fullName}
							className="w-16 h-16 rounded-full object-cover"
						/>
						<div>
							<div className="font-medium text-lg">
								{consultation.patient_id.fullName}
								<span className={`px-3 py-1 ml-4 rounded-full text-base ${consultation.request.status === 'active'
									? 'bg-green-500 bg-opacity-20 text-green-500'
									: 'bg-yellow-500 bg-opacity-20 text-yellow-500'
									}`}>
									{consultation.request.status}
								</span>
							</div>
							<div className="text-gray-400">{consultation.patient_id.email}</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div className="bg-gray-800 rounded-lg p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<RiCalendarLine className="mr-2 text-primary-500" />
						Duration
					</h3>
					<div className="space-y-3">
						<div>
							<div className="text-gray-400">Created On</div>
							<div className="font-medium">
								{new Date(consultation.createdAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</div>
						</div>
						<div>
							<div className="text-gray-400">Active Days</div>
							<div className="font-medium">{
								getDateDifference(consultation.request?.expiresOn) > 0
									? `${getDateDifference(consultation.request?.expiresOn)} days`
									: `deactivated ${Math.abs(getDateDifference(consultation.request?.expiresOn))} days back`
							}</div>
						</div>
					</div>
				</div>

				<div className="bg-gray-800 rounded-lg p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<RiInformationLine className="mr-2 text-primary-500" />
						Notes
					</h3>
					<p className="text-gray-300">{consultation.notes}</p>
				</div>
			</div>

			<div className="bg-gray-800 rounded-lg p-6 space-y-3">
				<h3 className="text-lg font-semibold flex items-center">
					<RiRunLine className="mr-2 text-primary-500" />
					Recommended Exercises
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{consultation.recommendedExercises.map((exercise) => (
						<div key={exercise._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 relative">
							<div
								className="w-full h-40 object-cover rounded-lg mb-3"
							>
								<MediaCarousel images={exercise.image} video={exercise.video} />
							</div>
							<h4 className="font-medium mb-2">{exercise.title}</h4>
							<div className="text-sm text-gray-400 mb-2">
								{exercise.category} - {exercise.subCategory}
							</div>
							<div className="text-sm">
								<span className="text-primary-500">Sets:</span> {exercise.set} |
								<span className="text-primary-500"> Reps:</span> {exercise.reps} |
								<span className="text-primary-500"> Hold:</span> {exercise.hold}s
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ConsultationDetails;