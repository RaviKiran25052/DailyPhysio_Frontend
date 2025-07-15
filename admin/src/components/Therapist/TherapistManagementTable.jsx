import { FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';

export default function TherapistManagementTable({ therapists, onUpdate, onBack }) {
	return (
		<main className="flex-1 w-full">
			{/* Back button and search bar */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
				<button
					onClick={onBack}
					className="flex items-center px-4 py-2 mb-4 sm:mb-0 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
				>
					<FaArrowLeft className="mr-2" />
					Go Back
				</button>
			</div>

			<div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-700">
						<thead className="bg-gray-900/50">
							<tr>
								<th className="px-6 py-4 text-sm font-semibold text-purple-300">Name</th>
								<th className="px-6 py-4 text-sm font-semibold text-purple-300">Email</th>
								<th className="px-6 py-4 text-sm font-semibold text-purple-300">Hospital/Clinic</th>
								<th className="px-6 py-4 text-sm font-semibold text-purple-300">Phone Number</th>
								<th className="px-6 py-4 text-sm font-semibold text-purple-300">Specialization</th>
								<th className="px-6 py-4 text-sm font-semibold text-purple-300">Experience</th>
								<th className="px-6 py-4 text-sm font-semibold text-purple-300">Status</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700">
							{therapists.map((therapist) => (
								<tr key={therapist._id} className="hover:bg-gray-700/50 transition duration-150">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										{therapist.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										{therapist.email}
									</td>
									<td className="px-6 py-4 text-sm">
										<div className="text-gray-300">{therapist.workingAt}</div>
										<div className="text-xs text-gray-500">{therapist.address}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										{therapist.phoneNumber}
									</td>
									<td className="px-6 py-4 text-sm text-gray-300">
										{therapist.specializations && therapist.specializations.length > 0 
											? therapist.specializations.join(", ") 
											: "Not specified"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										{therapist.experience ? `${therapist.experience} years` : "Not specified"}
									</td>
									<td className="px-6 py-4">
										<div className="flex space-x-2">
											<button
												onClick={() => onUpdate(therapist._id, 'active')}
												className="px-3 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-md bg-purple-600 hover:bg-purple-500 text-white transition duration-150 shadow-sm"
											>
												<FaCheck className="mr-1" />
												Approve
											</button>
											<button
												onClick={() => onUpdate(therapist._id, 'rejected')}
												className="px-3 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition duration-150 shadow-sm"
											>
												<FaTimes className="mr-1" />
												Decline
											</button>
										</div>
									</td>
								</tr>
							))}
							{therapists.length === 0 && (
								<tr>
									<td colSpan="7" className="px-6 py-10 text-center text-gray-400">
										No therapists found matching your search
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</main >
	);
}