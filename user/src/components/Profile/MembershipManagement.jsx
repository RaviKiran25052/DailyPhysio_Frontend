import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RiCheckLine, RiArrowRightLine, RiCoinLine, RiCalendarLine, RiTimeLine } from 'react-icons/ri';
import MembershipUpdateModal from '../Modals/MembershipUpdateModal';

const API_URL = process.env.REACT_APP_API_URL;

const MembershipManagement = () => {
	const [membership, setMembership] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showUpdateModal, setShowUpdateModal] = useState(false);

	useEffect(() => {
		fetchMembershipDetails();
	}, []);

	const fetchMembershipDetails = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(`${API_URL}/users/membership`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			setMembership(response.data);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching membership details:', error);
			toast.error('Failed to load membership data');
			setLoading(false);
		}
	};

	const handleMembershipUpdate = (updatedData) => {
		setMembership(updatedData);
	};

	if (loading) {
		return (
			<div className="p-6 flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
			</div>
		);
	}

	// Default values if membership is null
	const membershipType = membership?.type || 'free';
	const expiryDate = membership?.expiresAt ? new Date(membership.expiresAt) : null;
	const plans = [
		{
			name: 'Free',
			type: 'free',
			price: '$0',
			description: 'Basic features for therapists just starting out',
			features: [
				'Up to 10 patients',
				'5 consultations per month',
				'Basic exercise library',
				'Email support'
			],
			current: membershipType === 'free'
		},
		{
			name: 'Monthly',
			type: 'monthly',
			price: '$19.99',
			period: 'per month',
			description: 'Everything you need for a growing practice',
			features: [
				'Up to 50 patients',
				'Unlimited consultations',
				'Full exercise library',
				'Priority support'
			],
			current: membershipType === 'monthly'
		},
		{
			name: 'Yearly',
			type: 'yearly',
			price: '$199.99',
			period: 'per year',
			description: 'Best value for established practices',
			features: [
				'Unlimited patients',
				'Unlimited consultations',
				'Custom exercise creation',
				'24/7 dedicated support',
				'Advanced analytics'
			],
			current: membershipType === 'yearly',
			popular: true
		}
	];

	return (
		<div className="p-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
				<h2 className="text-2xl font-bold">Membership Management</h2>
			</div>

			{/* Current Plan Summary */}
			<div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
				<div className="flex flex-col md:flex-row justify-between">
					<div>
						<h3 className="text-xl font-semibold mb-2">Your Current Plan</h3>
						<div className="flex items-center mb-4">
							<span className={`text-2xl font-bold ${membershipType === 'free' ? 'text-blue-400' :
									membershipType === 'monthly' ? 'text-yellow-400' : 'text-purple-400'
								}`}>
								{membershipType === 'free' ? 'Free Plan' :
									membershipType === 'monthly' ? 'Monthly Plan' : 'Yearly Plan'}
							</span>
						</div>

						<div className="space-y-2 text-gray-300">
							{expiryDate && (
								<div className="flex items-center">
									<RiCalendarLine className="mr-2 text-purple-400" />
									<span>Expires: {expiryDate.toLocaleDateString()}</span>
								</div>
							)}
							<div className="flex items-center">
								<RiCoinLine className="mr-2 text-purple-400" />
								<span>
									{membershipType === 'free' ? 'Free' :
										membershipType === 'monthly' ? '$19.99/month' : '$199.99/year'}
								</span>
							</div>
							<div className="flex items-center">
								<RiTimeLine className="mr-2 text-purple-400" />
								<span>
									{membershipType === 'free' ? 'Never expires' :
										membershipType === 'monthly' ? 'Renews monthly' : 'Renews yearly'}
								</span>
							</div>
						</div>
					</div>

					<div className="mt-6 md:mt-0">
						<button
							onClick={() => setShowUpdateModal(true)}
							className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
						>
							Update Plan
						</button>
					</div>
				</div>
			</div>

			{/* Available Plans */}
			<h3 className="text-xl font-semibold mb-4">Available Plans</h3>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{plans.map((plan) => (
					<div
						key={plan.type}
						className={`relative bg-gray-800 rounded-xl border ${plan.current ? 'border-purple-500' : 'border-gray-700'
							} p-6 flex flex-col ${plan.popular ? 'transform md:-translate-y-2' : ''}`}
					>
						{plan.popular && (
							<div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
								Popular
							</div>
						)}

						<h4 className="text-lg font-semibold mb-1">{plan.name}</h4>
						<div className="flex items-baseline mb-4">
							<span className="text-2xl font-bold">{plan.price}</span>
							{plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
						</div>

						<p className="text-gray-400 text-sm mb-4">{plan.description}</p>

						<ul className="space-y-2 mb-6 flex-grow">
							{plan.features.map((feature, index) => (
								<li key={index} className="flex items-center">
									<RiCheckLine className="text-green-400 mr-2" />
									<span className="text-sm">{feature}</span>
								</li>
							))}
						</ul>

						{plan.current ? (
							<div className="px-4 py-2 bg-purple-600 bg-opacity-50 text-white text-center rounded-lg">
								Current Plan
							</div>
						) : (
							<button
								onClick={() => {
									setShowUpdateModal(true);
								}}
								className="flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
							>
								<span>Upgrade</span>
								<RiArrowRightLine className="ml-1" />
							</button>
						)}
					</div>
				))}
			</div>

			{/* Payment History */}
			{membership?.payments && membership.payments.length > 0 && (
				<div className="mt-8">
					<h3 className="text-xl font-semibold mb-4">Payment History</h3>
					<div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="bg-gray-700">
										<th className="px-4 py-3 text-left">Date</th>
										<th className="px-4 py-3 text-left">Amount</th>
										<th className="px-4 py-3 text-left">Plan</th>
										<th className="px-4 py-3 text-left">Status</th>
									</tr>
								</thead>
								<tbody>
									{membership.payments.map((payment, index) => (
										<tr key={index} className="border-t border-gray-700">
											<td className="px-4 py-3">{new Date(payment.date).toLocaleDateString()}</td>
											<td className="px-4 py-3">${payment.amount.toFixed(2)}</td>
											<td className="px-4 py-3 capitalize">{payment.plan}</td>
											<td className="px-4 py-3">
												<span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
														payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
															'bg-red-500/20 text-red-400'
													}`}>
													{payment.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}

			{showUpdateModal && (
				<MembershipUpdateModal
					isOpen={showUpdateModal}
					onClose={() => setShowUpdateModal(false)}
					currentPlan={membershipType}
					onUpdate={handleMembershipUpdate}
				/>
			)}
		</div>
	);
};

export default MembershipManagement; 