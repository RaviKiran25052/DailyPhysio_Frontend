import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiSearchLine, RiAddLine, RiMailLine, RiUserLine, RiCalendarLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import UserCreationModal from '../components/Modals/UserCreationModal';

const API_URL = process.env.REACT_APP_API_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      const response = await axios.get(`${API_URL}/therapist/users`, {
        headers: { Authorization: `Bearer ${therapistInfo.token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      toast.error('Failed to fetch users');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      await axios.post(`${API_URL}/therapist/users`, {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        creator: {
          createdBy: 'therapist',
          createdById: therapistInfo._id
        }
      }, {
        headers: { Authorization: `Bearer ${therapistInfo.token}` }
      });

      toast.success('User created successfully');
      setShowUserModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 w-64 text-white"
            />
          </div>
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RiAddLine />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <RiUserLine className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{user.fullName}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <RiMailLine className="mr-1" />
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <RiCalendarLine className="mr-2" />
                  <span>Created: {formatDate(user.createdAt)}</span>
                </div>
                <span className={`px-3 py-1 rounded-full ${user.membership?.type === 'free'
                  ? 'bg-blue-500/20 text-blue-400'
                  : user.membership?.type === 'monthly'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : user.membership?.type === 'yearly'
                      ? 'bg-purple-500/20 text-purple-500'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                  {user.membership?.type || 'No Plan'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No users found</div>
          <div className="text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first user'}
          </div>
        </div>
      )}

      {/* User Creation Modal */}
      {showUserModal && (
        <UserCreationModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setFormData({
              name: '',
              email: '',
              password: '',
              confirmPassword: ''
            });
          }}
          formData={formData}
          handleInputChange={handleInputChange}
          onContinue={handleCreateUser}
        />
      )}
    </div>
  );
};

export default UserManagement; 