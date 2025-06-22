import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUsers, FaCrown } from 'react-icons/fa';
import { FaUserDoctor } from "react-icons/fa6";
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  const [premiumUsers, setPremiumUsers] = useState([]);
  const [therapistUsers, setTherapistUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'premium', 'therapist'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Check if admin is logged in
    const loggedInAdmin = localStorage.getItem('adminInfo')
      ? JSON.parse(localStorage.getItem('adminInfo'))
      : sessionStorage.getItem('adminInfo')
        ? JSON.parse(sessionStorage.getItem('adminInfo'))
        : null;

    if (!loggedInAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchUsers(loggedInAdmin.token);
  }, [navigate]);

  const fetchUsers = async (token) => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch users from the backend
      const response = await axios.get(`${API_URL}/users`, config);
      const allUsers = response.data || [];

      // Separate regular and premium users
      const regular = allUsers.filter(user => user.membership.type === 'free');
      const premium = allUsers.filter(user => (user.membership.type === 'yearly' || user.membership.type === 'monthly'));
      const thrptUsers = allUsers.filter(user => user.creator.createdBy === 'therapist');

      setUsers(allUsers);
      setRegularUsers(regular);
      setPremiumUsers(premium);
      setTherapistUsers(thrptUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setLoading(false);

      // If token is invalid, redirect to login
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const value = e.target.value.toLowerCase();

    if (value === '') {
      // If search is cleared, reset to all users
      const regular = users.filter(user => user.role === 'isUser' && user.membership.type === 'free');
      const premium = users.filter(user => user.role === 'isUser' && (user.membership.type === 'yearly' || user.membership.type === 'monthly'));
      const therapist = users.filter(user => user.role === 'isUser' && user.creator.createdBy === 'therapist');

      setRegularUsers(regular);
      setPremiumUsers(premium);
      setTherapistUsers(therapist);
    } else {
      // Filter users based on search term
      const filteredRegular = users.filter(
        user =>
          user.role === 'isUser' &&
          user.membership.type === 'free' &&
          (user.fullName.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value))
      );

      const filteredPremium = users.filter(
        user =>
          user.role === 'isUser' &&
          (user.membership.type === 'yearly' || user.membership.type === 'monthly') &&
          (user.fullName.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value))
      );

      const filteredTherapistUsers = users.filter(
        user =>
          user.role === 'isUser' &&
          user.creator.createdBy === 'therapist' &&
          (user.fullName.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value))
      );

      setRegularUsers(filteredRegular);
      setPremiumUsers(filteredPremium);
      setTherapistUsers(filteredTherapistUsers);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  // Calculate days remaining for premium users
  const calculateDaysRemaining = (user) => {
    if (!user.membership || !user.membership.paymentDate) return 'N/A';

    const paymentDate = new Date(user.membership.paymentDate);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - paymentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (user.membership.type === 'monthly') {
      return Math.max(0, 30 - diffDays);
    } else if (user.membership.type === 'yearly') {
      return Math.max(0, 365 - diffDays);
    }

    return 'N/A';
  };

  // Get current page of users
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentRegularUsers = regularUsers.slice(indexOfFirstUser, indexOfLastUser);
  const currentPremiumUsers = premiumUsers.slice(indexOfFirstUser, indexOfLastUser);
  const currentTherapistUsers = therapistUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function formatDateTime(isoString) {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

    return `${day}/${month}/${year}, ${formattedTime}`;
  }

  return (
    <main className="p-6">
      {/* Back button at top of the page */}
      <div className="flex justify-between items-center mb-6">
        {/* Search bar */}
        <h2 className="text-3xl font-extrabold text-white">User Management</h2>
        <div className="relative w-full sm:w-64 md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-800 border border-gray-700 text-purple-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => handleTabChange('users')}
            className={`${activeTab === 'users'
              ? 'border-purple-500 text-purple-500'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium flex items-center`}
          >
            <FaUsers className="mr-2" />
            Regular Users
            <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${activeTab === 'users' ? 'bg-purple-900 text-purple-300' : 'bg-gray-800 text-gray-300'
              }`}>
              {regularUsers.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('premium')}
            className={`${activeTab === 'premium'
              ? 'border-purple-500 text-purple-500'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium flex items-center`}
          >
            <FaCrown className="mr-2" />
            Premium Users
            <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${activeTab === 'premium' ? 'bg-purple-900 text-purple-300' : 'bg-gray-800 text-gray-300'
              }`}>
              {premiumUsers.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('therapist')}
            className={`${activeTab === 'therapist'
              ? 'border-purple-500 text-purple-500'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium flex items-center`}
          >
            <FaUserDoctor className="mr-2" />
            Therapist Users
            <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${activeTab === 'therapist' ? 'bg-purple-900 text-purple-300' : 'bg-gray-800 text-gray-300'
              }`}>
              {therapistUsers.length}
            </span>
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Regular Users Table */}
          {activeTab === 'users' && (
            <>
              <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      S.No
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Created On
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {currentRegularUsers.length > 0 ? (
                    currentRegularUsers.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-purple-300">
                          {indexOfFirstUser + index + 1}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-white">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                          {formatDateTime(user.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-400">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination for Regular Users */}
              {regularUsers.length > itemsPerPage && (
                <div className="flex justify-center mt-4">
                  <nav className="flex items-center space-x-1">
                    {Array.from({ length: Math.ceil(regularUsers.length / itemsPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === index + 1
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-purple-400 hover:bg-gray-700'
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </>
          )}

          {/* Premium Users Table */}
          {activeTab === 'premium' && (
            <>
              <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      S.No
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Plan Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Days Remaining
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {currentPremiumUsers.length > 0 ? (
                    currentPremiumUsers.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-purple-300">
                          {indexOfFirstUser + index + 1}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-white">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-purple-300">
                          <span className="px-2 py-1 text-sm text-black bg-yellow-600 rounded-full">
                            {user.membership.type === 'monthly' ? 'Monthly' : 'Yearly'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                          {formatDateTime(user.membership.paymentDate)}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                          {calculateDaysRemaining(user)} days
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-400">
                        No premium users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination for Premium Users */}
              {premiumUsers.length > itemsPerPage && (
                <div className="flex justify-center mt-4">
                  <nav className="flex items-center space-x-1">
                    {Array.from({ length: Math.ceil(premiumUsers.length / itemsPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === index + 1
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-purple-400 hover:bg-gray-700'
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </>
          )}

          {/* Premium Users Table */}
          {activeTab === 'therapist' && (
            <>
              <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      S.No
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Created By
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-purple-400 uppercase tracking-wider">
                      Created on
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {currentTherapistUsers.length > 0 ? (
                    currentTherapistUsers.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-purple-300">
                          {indexOfFirstUser + index + 1}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-white">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-purple-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                          {user.therapistName}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                          {formatDateTime(user.membership.paymentDate)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-400">
                        No users created by Therapists
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination for Premium Users */}
              {therapistUsers.length > itemsPerPage && (
                <div className="flex justify-center mt-4">
                  <nav className="flex items-center space-x-1">
                    {Array.from({ length: Math.ceil(therapistUsers.length / itemsPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === index + 1
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-purple-400 hover:bg-gray-700'
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
};

export default UserManagement; 