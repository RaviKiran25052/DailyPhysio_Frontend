import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaUsers, FaCrown } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  const [premiumUsers, setPremiumUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'premium'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPremiumUsers, setTotalPremiumUsers] = useState(0);
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
      const response = await axios.get(`${API_URL}/admin/users`, config);
      const allUsers = response.data.users || [];
      
      // Separate regular and premium users
      const regular = allUsers.filter(user => user.role === 'isUser' && (!user.pro || !user.pro.type));
      const premium = allUsers.filter(user => user.role === 'isUser' && user.pro && user.pro.type);
      
      setUsers(allUsers);
      setRegularUsers(regular);
      setPremiumUsers(premium);
      setTotalUsers(regular.length);
      setTotalPremiumUsers(premium.length);
      
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
      const regular = users.filter(user => user.role === 'isUser' && (!user.pro || !user.pro.type));
      const premium = users.filter(user => user.role === 'isUser' && user.pro && user.pro.type);
      
      setRegularUsers(regular);
      setPremiumUsers(premium);
      setTotalUsers(regular.length);
      setTotalPremiumUsers(premium.length);
    } else {
      // Filter users based on search term
      const filteredRegular = users.filter(
        user => 
          user.role === 'isUser' && 
          (!user.pro || !user.pro.type) &&
          (user.fullName.toLowerCase().includes(value) || 
           user.email.toLowerCase().includes(value))
      );
      
      const filteredPremium = users.filter(
        user => 
          user.role === 'isUser' && 
          user.pro && 
          user.pro.type &&
          (user.fullName.toLowerCase().includes(value) || 
           user.email.toLowerCase().includes(value))
      );
      
      setRegularUsers(filteredRegular);
      setPremiumUsers(filteredPremium);
      setTotalUsers(filteredRegular.length);
      setTotalPremiumUsers(filteredPremium.length);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const navigateToAdminHome = () => {
    navigate('/admin/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    sessionStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  // Calculate days remaining for premium users
  const calculateDaysRemaining = (user) => {
    if (!user.pro || !user.pro.paymentDate) return 'N/A';
    
    const paymentDate = new Date(user.pro.paymentDate);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - paymentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (user.pro.type === 'monthly') {
      return Math.max(0, 30 - diffDays);
    } else if (user.pro.type === 'yearly') {
      return Math.max(0, 365 - diffDays);
    }
    
    return 'N/A';
  };

  // Get current page of users
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentRegularUsers = regularUsers.slice(indexOfFirstUser, indexOfLastUser);
  const currentPremiumUsers = premiumUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  // Pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button at top of the page */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <button 
            onClick={navigateToAdminHome}
            className="flex items-center px-4 py-2 mb-4 sm:mb-0 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </button>
          
          {/* Search bar */}
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
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-white">User Management</h2>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => handleTabChange('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium flex items-center`}
            >
              <FaUsers className="mr-2" />
              Regular Users
              <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                activeTab === 'users' ? 'bg-purple-900 text-purple-300' : 'bg-gray-800 text-gray-300'
              }`}>
                {totalUsers}
              </span>
            </button>
            
            <button
              onClick={() => handleTabChange('premium')}
              className={`${
                activeTab === 'premium'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium flex items-center`}
            >
              <FaCrown className="mr-2" />
              Premium Users
              <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                activeTab === 'premium' ? 'bg-purple-900 text-purple-300' : 'bg-gray-800 text-gray-300'
              }`}>
                {totalPremiumUsers}
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                        S.No
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {currentRegularUsers.length > 0 ? (
                      currentRegularUsers.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                            {indexOfFirstUser + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {user.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {user.email}
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
                {totalUsers > itemsPerPage && (
                  <div className="flex justify-center mt-4">
                    <nav className="flex items-center space-x-1">
                      {Array.from({ length: Math.ceil(totalUsers / itemsPerPage) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === index + 1
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                        S.No
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                        Plan Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                        Days Remaining
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {currentPremiumUsers.length > 0 ? (
                      currentPremiumUsers.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                            {indexOfFirstUser + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {user.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                            <span className="px-2 py-1 text-xs bg-purple-900 rounded-full">
                              {user.pro?.type === 'monthly' ? 'Monthly' : 'Yearly'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {calculateDaysRemaining(user)}
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
                {totalPremiumUsers > itemsPerPage && (
                  <div className="flex justify-center mt-4">
                    <nav className="flex items-center space-x-1">
                      {Array.from({ length: Math.ceil(totalPremiumUsers / itemsPerPage) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === index + 1
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
      
      {/* Footer */}
      <footer className="bg-gray-800 py-4 text-center text-gray-400">
        <p>© {new Date().getFullYear()} ExerciseMD Admin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserManagement; 