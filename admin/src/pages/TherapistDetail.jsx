import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	ArrowLeft,
	User,
	Calendar,
	Activity,
	Users,
	BookOpen,
	Award,
	Phone,
	MapPin,
	Clock,
	XCircle,
	Eye,
	Lock,
	Crown,
	Building,
	Stethoscope,
	UserCheck,
	CreditCard,
	Star,
	FileText,
	AlertTriangle,
	BarChart3,
	Database
} from 'lucide-react';
import axios from 'axios';
import ConsultationCards from '../components/Therapist/ConsultationCards';
import ExerciseGrid from '../components/Exercises/ExerciseGrid';

const TherapistDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [therapistData, setTherapistData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('overview');

	useEffect(() => {
		const fetchTherapistData = async () => {
			try {
				setLoading(true);

				// API configuration
				const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
				const admin = localStorage.getItem('adminInfo')
					? JSON.parse(localStorage.getItem('adminInfo'))
					: null;
				const token = admin?.token;

				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};

				const response = await axios.get(`${API_URL}/admin/therapists/${id}`, config);
				setTherapistData(response.data);
			} catch (err) {
				setError(err.response?.data?.message || 'Error fetching therapist data');
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchTherapistData();
		}
	}, [id]);

	const handleBackClick = () => {
		navigate(-1);
	};

	const handleView = (exercise) => {
		navigate(`/exercise/${exercise._id}`)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="relative">
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-500 mx-auto mb-4"></div>
						<div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-100 border-t-transparent animate-pulse mx-auto"></div>
					</div>
					<div className="space-y-2">
						<p className="text-purple-200 font-medium">Loading therapist data...</p>
						<p className="text-purple-300 text-sm">Please wait while we fetch the information</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
				<div className="text-center bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl border border-red-500/30 max-w-md w-full shadow-2xl">
					<div className="relative mb-6">
						<div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<AlertTriangle className="w-10 h-10 text-red-400" />
						</div>
						<div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
							<XCircle className="w-4 h-4 text-white" />
						</div>
					</div>
					<h2 className="text-2xl font-bold text-red-100 mb-3">Oops! Something went wrong</h2>
					<p className="text-red-200 mb-6 leading-relaxed">{error}</p>
					<button
						onClick={handleBackClick}
						className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
					>
						<ArrowLeft className="w-4 h-4 mr-2 inline-block" />
						Go Back
					</button>
				</div>
			</div>
		);
	}

	const { therapist, consultations, exercises, users, stats, storageInfo } = therapistData || {};
	console.log(storageInfo);
	
	const StatCard = ({ icon: Icon, title, value, color = 'purple' }) => (
		<div className="group relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
			<div className="flex  justify-between relative bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-xl">
				<div>
					<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
						color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
							color === 'green' ? 'bg-green-500/20 text-green-400' :
								color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
									color === 'red' ? 'bg-red-500/20 text-red-400' :
										color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
											'bg-purple-500/20 text-purple-400'
						}`}>
						<Icon className="w-6 h-6" />
					</div>
					<p className="text-gray-400 text-sm mt-3">{title}</p>
				</div>
				<p className={`text-3xl font-bold ${color === 'purple' ? 'text-purple-400' :
					color === 'blue' ? 'text-blue-400' :
						color === 'green' ? 'text-green-400' :
							color === 'orange' ? 'text-orange-400' :
								color === 'red' ? 'text-red-400' :
									color === 'yellow' ? 'text-yellow-400' :
										'text-purple-400'
					}`}>
					{value}
				</p>
			</div>
		</div>
	);

	const TabButton = ({ id, label, icon: Icon, active, onClick, count }) => (
		<button
			onClick={() => onClick(id)}
			className={`group relative flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${active
				? 'bg-purple-700 text-white shadow-lg shadow-purple-500/25'
				: 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50 hover:border-purple-500/30'
				}`}
		>
			<Icon className="w-5 h-5" />
			<span>{label}</span>
			{count !== undefined && (
				<span className={`px-2 py-1 text-xs rounded-full ${active
					? 'bg-white/20 text-white'
					: 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
					}`}>
					{count}
				</span>
			)}
		</button>
	);

	const getMembershipColor = (type) => {
		switch (type) {
			case 'free':
				return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30';
			case 'monthly':
				return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30';
			case 'yearly':
				return 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30';
			default:
				return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30';
		}
	};

	const EmptyState = ({ icon: Icon, title, description }) => (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
				<Icon className="w-12 h-12 text-gray-500" />
			</div>
			<h3 className="text-xl font-semibold text-gray-300 mb-2">{title}</h3>
			<p className="text-gray-500 mb-6 max-w-md">{description}</p>
		</div>
	);

	const renderOverview = () => (
		<div className="space-y-8">
			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					icon={Calendar}
					title="Total Consultations"
					value={stats?.totalConsultations || 0}
					color="blue"
				/>
				<StatCard
					icon={Activity}
					title="Active Consultations"
					value={stats?.activeConsultations || 0}
					color="green"
				/>
				<StatCard
					icon={BookOpen}
					title="Total Exercises"
					value={stats?.totalExercises || 0}
					color="purple"
				/>
				<StatCard
					icon={Users}
					title="Total Users"
					value={stats?.totalUsers || 0}
					color="orange"
				/>
			</div>

			{/* Recent Activity */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Recent Consultations */}
				<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-gray-100 flex items-center">
							<Calendar className="w-5 h-5 mr-2 text-purple-400" />
							Recent Consultations
						</h3>
						<span className="text-sm text-gray-400">{consultations?.length || 0} total</span>
					</div>
					<div className="space-y-4">
						{consultations?.slice(0, 3).map((consultation) => (
							<div key={consultation._id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
								<div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
									<User className="w-5 h-5 text-white" />
								</div>
								<div className="flex-1">
									<h4 className="font-medium text-gray-200">{consultation.patient_id?.fullName || 'Unknown Patient'}</h4>
									<p className="text-sm text-gray-400">{new Date(consultation.createdAt).toLocaleDateString()}</p>
								</div>
								<span className={`px-3 py-1 text-xs rounded-full border ${consultation.request?.status === 'active'
									? 'bg-green-500/20 text-green-300 border-green-500/30'
									: 'bg-red-500/20 text-red-300 border-red-500/30'
									}`}>
									{consultation.request?.status || 'Unknown'}
								</span>
							</div>
						)) || (
								<div className="text-center py-8">
									<Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
									<p className="text-gray-400">No consultations yet</p>
								</div>
							)}
					</div>
				</div>

				{/* Recent Exercises */}
				<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-gray-100 flex items-center">
							<BookOpen className="w-5 h-5 mr-2 text-purple-400" />
							Recent Exercises
						</h3>
						<span className="text-sm text-gray-400">{exercises?.length || 0} total</span>
					</div>
					<div className="space-y-4">
						{exercises?.slice(0, 3).map((exercise) => (
							<div key={exercise._id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
								<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
									<BookOpen className="w-5 h-5 text-white" />
								</div>
								<div className="flex-1">
									<h4 className="font-medium text-gray-200">{exercise.title}</h4>
									<p className="text-sm text-gray-400">{exercise.category}</p>
								</div>
								<div className="flex items-center space-x-2">
									{exercise.custom?.type === 'public' ? (
										<Eye className="w-4 h-4 text-green-400" />
									) : (
										<Lock className="w-4 h-4 text-yellow-400" />
									)}
									{exercise.isPremium && <Crown className="w-4 h-4 text-purple-400" />}
								</div>
							</div>
						)) || (
								<div className="text-center py-8">
									<BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
									<p className="text-gray-400">No exercises created yet</p>
								</div>
							)}
					</div>
				</div>
			</div>
		</div>
	);

	const renderConsultations = () => (
		<div className="space-y-6">
			{consultations && consultations.length > 0 ? (
				<ConsultationCards consultations={consultations} />
			) : (
				<EmptyState
					icon={Calendar}
					title="No Consultations Yet"
					description="This therapist hasn't conducted any consultations yet. Consultations will appear here once they start working with patients."
				/>
			)}
		</div>
	);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	const renderUsers = () => (
		<div className="space-y-6">
			{users && users.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{users.map((user) => (
						<div key={user._id} className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
										{user.profilePic ?
											<img
												src={user.profilePic}
												alt="profile"
											/>
											:
											<User className="w-6 h-6 text-white" />
										}
									</div>
									<div>
										<h3 className="font-semibold text-gray-100 text-lg">{user.fullName}</h3>
										<p className="text-sm text-gray-400">{user.email}</p>
										<span className="text-xs text-gray-500 flex items-center mt-2">
											<Clock className="w-3 h-3 mr-1" />
											{formatDate(user.createdAt)}
										</span>
									</div>
								</div>
								{user.membership?.length > 0 && (
									<div className="flex flex-wrap gap-1 justify-end">
										{user.membership.map((membership, index) => (
											<span key={index} className={`px-2 py-1 text-xs rounded-full border ${getMembershipColor(membership.type)}`}>
												{membership.type}
											</span>
										))}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			) : (
				<EmptyState
					icon={Users}
					title="No Users created"
					description="This therapist doesn't created users yet."
				/>
			)}
		</div>
	);

	if (!therapist) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
				<div className="text-center bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 max-w-md w-full shadow-2xl">
					<div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
						<User className="w-10 h-10 text-gray-400" />
					</div>
					<h2 className="text-2xl font-bold text-gray-100 mb-3">No Data Available</h2>
					<p className="text-gray-300 mb-6 leading-relaxed">No therapist data available for this request.</p>
					<button
						onClick={handleBackClick}
						className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
					>
						<ArrowLeft className="w-4 h-4 mr-2 inline-block" />
						Go Back
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 p-6">
			{/* Header */}
			<button
				onClick={handleBackClick}
				className="group flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-all duration-200 bg-gray-700/50 hover:bg-gray-600/50 px-4 py-2 mb-6 rounded-lg border border-gray-600/30 hover:border-purple-500/30"
			>
				<ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
				<span>Back</span>
			</button>

			{/* Therapist Details Section */}
			<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-8 shadow-2xl">
				<h2 className="text-2xl font-bold text-gray-100 flex items-center">
					<Stethoscope className="w-6 h-6 mr-3 text-purple-400" />
					Therapist Information
				</h2>
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-6 my-6">
						<div className="relative">
							<div className="w-20 h-20 rounded-full overflow-hidden bg-purple-600 p-1">
								{therapist.profilePic ? (
									<img
										src={therapist.profilePic}
										alt={therapist.name}
										className="w-full h-full object-cover rounded-full"
									/>
								) : (
									<div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center">
										<User className="w-10 h-10 text-white" />
									</div>
								)}
							</div>
							<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
								<div className="w-2 h-2 bg-white rounded-full"></div>
							</div>
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-100 mb-1">{therapist.name}</h1>
							<p className="text-purple-300 text-sm">{therapist.email}</p>
						</div>
					</div>
					<div className='flex flex-col items-end'>
						<div className="flex items-center text-sm gap-2">
							<Database size={18} />
							Data consumed:
						</div>
						<span className='text-yellow-400'>
							{storageInfo?.remainingStorage} / {storageInfo?.storageLimit}
						</span>
						<div className="text-sm">
							current usage: <span className="text-sky-400">{storageInfo.currentUsage}</span>
						</div>
					</div>
				</div>

				{/* Specializations */}
				{therapist.specializations && therapist.specializations.length > 0 && (
					<div className="mb-6 pt-8 border-t border-gray-700/50">
						<h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
							<Award className="w-5 h-5 mr-2 text-purple-400" />
							Specializations
						</h3>
						<div className="flex flex-wrap gap-3">
							{therapist.specializations.map((spec, index) => (
								<span key={index} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 px-4 py-2 rounded-full text-sm border border-purple-500/30 hover:border-purple-400/50 transition-colors">
									{spec}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Bio */}
				{therapist.bio && (
					<div className="mb-6 pt-8 border-t border-gray-700/50">
						<h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
							<FileText className="w-5 h-5 mr-2 text-purple-400" />
							Bio
						</h3>
						<div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
							<p className="text-gray-300 leading-relaxed">{therapist.bio}</p>
						</div>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
					<div className="space-y-6">
						<div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
							<div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
								<Phone className="w-5 h-5 text-green-400" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Phone Number</p>
								<p className="text-gray-200 font-medium">{therapist.phoneNumber}</p>
							</div>
						</div>
						<div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
							<div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
								<MapPin className="w-5 h-5 text-blue-400" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Address</p>
								<p className="text-gray-200 line-clamp-3">{therapist.address}</p>
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
							<div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
								<Building className="w-5 h-5 text-orange-400" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Working At</p>
								<p className="text-gray-200 font-medium">{therapist.workingAt}</p>
							</div>
						</div>
						<div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
							<div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
								<Star className="w-5 h-5 text-yellow-400" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Experience</p>
								<p className="text-gray-200 font-medium">{therapist.experience}</p>
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
							<div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
								<Clock className="w-5 h-5 text-cyan-400" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Joined</p>
								<p className="text-gray-200 font-medium">
									{new Date(therapist.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
							<div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
								<UserCheck className="w-5 h-5 text-pink-400" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Gender</p>
								<p className="text-gray-200 font-medium capitalize">{therapist.gender}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Membership */}
				{therapist.membership && therapist.membership.length > 0 && (
					<div className="pt-8 border-t border-gray-700/50">
						<h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
							<CreditCard className="w-5 h-5 mr-2 text-purple-400" />
							Membership
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{therapist.membership.map((membership, index) => (
								<div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
									<div className="flex items-center space-x-3">
										<div className={`w-3 h-3 rounded-full ${membership.status === 'active' ? 'bg-green-400' : 'bg-red-400'
											}`}></div>
										<div>
											<span className={`px-3 py-1 rounded-full text-sm border ${getMembershipColor(membership.type)}`}>
												{membership.type}
											</span>
											<p className="text-xs text-gray-400 mt-1">
												{membership.status} • {membership.paymentDate ? new Date(membership.paymentDate).toLocaleDateString() : 'No payment date'}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Tabs */}
			<div className="flex flex-wrap gap-4 mb-8">
				<TabButton
					id="overview"
					label="Overview"
					icon={BarChart3}
					active={activeTab === 'overview'}
					onClick={setActiveTab}
				/>
				<TabButton
					id="consultations"
					label="Consultations"
					icon={Calendar}
					active={activeTab === 'consultations'}
					onClick={setActiveTab}
					count={consultations?.length || 0}
				/>
				<TabButton
					id="exercises"
					label="Exercises"
					icon={BookOpen}
					active={activeTab === 'exercises'}
					onClick={setActiveTab}
					count={exercises?.length || 0}
				/>
				<TabButton
					id="users"
					label="Users"
					icon={Users}
					active={activeTab === 'users'}
					onClick={setActiveTab}
					count={users?.length || 0}
				/>
			</div>

			{/* Tab Content */}
			<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
				{activeTab === 'overview' && renderOverview()}
				{activeTab === 'consultations' && renderConsultations()}
				{activeTab === 'exercises' && (
					<ExerciseGrid
						exercises={exercises}
						totalExercises={exercises.length}
						onViewExercise={handleView}
					/>
				)}
				{activeTab === 'users' && renderUsers()}
			</div>
		</div>
	);
};

export default TherapistDetail;