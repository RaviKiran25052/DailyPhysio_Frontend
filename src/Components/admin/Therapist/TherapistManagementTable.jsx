import { useState, useEffect } from 'react';
import { FaEdit, FaCheck, FaTimes, FaSpinner, FaSearch, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function TherapistManagementTable() {
	const [therapists, setTherapists] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedTherapist, setSelectedTherapist] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [processingId, setProcessingId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		fetchTherapists();
	}, [therapists]);

	const fetchTherapists = async () => {
		try {
			const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
			if (!adminInfo || !adminInfo.token) {
				throw new Error('Admin authentication required');
			}

			const response = await axios.get(`${API_URL}/admin/therapists/all`, {
				headers: {
					'Authorization': `Bearer ${adminInfo.token}`,
					'Content-Type': 'application/json'
				}
			});

			setTherapists(response.data.therapists);
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	};

	const updateTherapistStatus = async (id, status) => {
		try {
			setProcessingId(id);
			const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
			if (!adminInfo || !adminInfo.token) {
				throw new Error('Admin authentication required');
			}
			console.log(`Updating therapist ${id} status to ${status}`);


			await axios.put(`${API_URL}/admin/therapists/${id}/approve`,
				{ state: status },
				{
					headers: {
						'Authorization': `Bearer ${adminInfo.token}`,
						'Content-Type': 'application/json'
					}
				}
			);

			// Update local state
			setTherapists(prevTherapists =>
				prevTherapists.map(therapist =>
					therapist.id === id ? { ...therapist, status } : therapist
				)
			);

		} catch (err) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setProcessingId(null);
			setIsModalOpen(false);
		}
	};

	const openStatusModal = (therapist) => {
		setSelectedTherapist(therapist);
		setIsModalOpen(true);
	};

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const filteredTherapists = therapists.filter(therapist =>
		therapist.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const displayTherapists = filteredTherapists.length > 0 ? filteredTherapists : [];

	return (
		<div className="min-h-screen bg-gray-900 flex flex-col">
			<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
				{/* Back button and search bar */}
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center px-4 py-2 mb-4 sm:mb-0 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
					>
						<FaArrowLeft className="mr-2" />
						Go Back
					</button>

					{/* Search */}
					<div className="flex flex-col sm:flex-row items-center gap-4">
						<div className="relative w-full sm:w-64 md:w-80">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FaSearch className="text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search by therapist name..."
								value={searchTerm}
								onChange={handleSearch}
								className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-800 border border-gray-700 text-purple-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
							/>
						</div>
					</div>
				</div>

				<div className="mb-8">
					<h2 className="text-3xl font-extrabold text-white">Therapist Management</h2>
				</div>

				{/* Loading State */}
				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
					</div>
				) : error ? (
					<div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md relative my-4">
						<strong className="font-bold">Error: </strong>
						<span className="block sm:inline">{error}</span>
					</div>
				) : (
					<div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-700">
								<thead className="bg-gray-900/50">
									<tr>
										<th className="px-6 py-4 text-sm font-semibold text-purple-300">Name</th>
										<th className="px-6 py-4 text-sm font-semibold text-purple-300">Email</th>
										<th className="px-6 py-4 text-sm font-semibold text-purple-300">Hospital/Clinic</th>
										<th className="px-6 py-4 text-sm font-semibold text-purple-300">Phone Number</th>
										<th className="px-6 py-4 text-sm font-semibold text-purple-300">Status</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-700">
									{displayTherapists.map((therapist) => (
										<tr key={therapist.id} className="hover:bg-gray-700/50 transition duration-150">
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
											<td className="px-6 py-4">
												{therapist.status === 'active' && (
													<div className="flex justify-center items-center space-x-3">
														<span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-900/30 text-green-400 border border-green-500/30">
															Verified
														</span>
														<button
															onClick={() => openStatusModal(therapist)}
															className="text-purple-400 hover:text-purple-300 flex items-center transition duration-150"
														>
															<FaEdit className="text-lg" />
														</button>
													</div>
												)}
												{therapist.status === 'rejected' && (
													<div className="flex justify-center items-center space-x-3">
														<span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-red-900/30 text-red-400 border border-red-500/30">
															Rejected
														</span>
														<button
															onClick={() => openStatusModal(therapist)}
															className="text-purple-400 hover:text-purple-300 flex items-center transition duration-150"
														>
															<FaEdit className="text-lg" />
														</button>
													</div>
												)}
												{therapist.status === 'inactive' && (
													<div className="flex justify-center items-center space-x-3">
														<span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
															Inactive
														</span>
														<button
															onClick={() => openStatusModal(therapist)}
															className="text-purple-400 hover:text-purple-300 flex items-center transition duration-150"
														>
															<FaEdit className="text-lg" />
														</button>
													</div>
												)}
												{therapist.status === 'pending' && (
													<div className="flex space-x-2">
														<button
															onClick={() => updateTherapistStatus(therapist._id, 'active')}
															disabled={processingId === therapist._id}
															className="px-3 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-md bg-purple-600 hover:bg-purple-500 text-white transition duration-150 shadow-sm"
														>
															{processingId === therapist._id ? (
																<FaSpinner className="animate-spin mr-1" />
															) : (
																<FaCheck className="mr-1" />
															)}
															Approve
														</button>
														<button
															onClick={() => updateTherapistStatus(therapist._id, 'rejected')}
															disabled={processingId === therapist._id}
															className="px-3 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition duration-150 shadow-sm"
														>
															{processingId === therapist._id ? (
																<FaSpinner className="animate-spin mr-1" />
															) : (
																<FaTimes className="mr-1" />
															)}
															Decline
														</button>
													</div>
												)}
											</td>
										</tr>
									))}
									{displayTherapists.length === 0 && (
										<tr>
											<td colSpan="5" className="px-6 py-10 text-center text-gray-400">
												No therapists found matching your search
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</main>

			{/* Status Update Modal */}
			{isModalOpen && selectedTherapist && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
					<div className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 max-w-md border border-gray-700">
						<h3 className="text-lg font-semibold text-white mb-4">
							Update Status for {selectedTherapist.name}
						</h3>

						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Select Status
							</label>
							<div className="relative">
								<select
									className="block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md"
									defaultValue={selectedTherapist.status}
									onChange={(e) => setSelectedTherapist({ ...selectedTherapist, status: e.target.value })}
									disabled={processingId === selectedTherapist._id}
								>
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
									<option value="rejected">Rejecte</option>
								</select>
							</div>
						</div>

						<div className="flex justify-end space-x-3">
							<button
								onClick={() => setIsModalOpen(false)}
								className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition duration-150"
							>
								Cancel
							</button>
							<button
								onClick={() => updateTherapistStatus(selectedTherapist._id, selectedTherapist.status)}
								disabled={processingId === selectedTherapist._id}
								className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition duration-150"
							>
								{processingId === selectedTherapist._id ?
									<div className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md opacity-75">
										<FaSpinner className="animate-spin mr-2" /> Updating...
									</div>
									: "Update"
								}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}