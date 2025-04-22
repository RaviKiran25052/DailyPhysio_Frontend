import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminExerciseForm from './AdminExerciseForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminExerciseList = () => {
  const navigate = useNavigate();
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = window.innerWidth < 768 ? 8 : 15;
  const [adminToken, setAdminToken] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalExercises, setTotalExercises] = useState(0);

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

    setAdminToken(loggedInAdmin.token);

    // Fetch exercises
    fetchExercises(loggedInAdmin.token);

    // Add window resize listener for responsive pagination
    const handleResize = () => {
      setCurrentPage(1); // Reset to first page on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  // Apply search filter - modified to use backend search
  useEffect(() => {
    // Only search if there's a token available
    if (adminToken && searchTerm.trim() !== '') {
      const delayDebounceFn = setTimeout(() => {
        fetchExercisesWithSearch(adminToken, searchTerm);
      }, 500);
      
      return () => clearTimeout(delayDebounceFn);
    } else if (adminToken && searchTerm.trim() === '') {
      // If search term is cleared, fetch all exercises
      fetchExercises(adminToken);
    }
  }, [searchTerm, adminToken]);

  const fetchExercises = async (token, page = 1) => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Add pagination parameters to the API call
      const response = await axios.get(
        `${API_URL}/exercises?pageNumber=${page}&pageSize=${itemsPerPage}`, 
        config
      );
      
      const { exercises: fetchedExercises, pages, total } = response.data;
      
      setFilteredExercises(fetchedExercises);
      setCurrentPage(page);
      setTotalPages(pages);
      setTotalExercises(total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('Failed to load exercises');
      setLoading(false);
    }
  };

  const fetchExercisesWithSearch = async (token, query, page = 1) => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Use the keyword parameter for search with pagination
      const response = await axios.get(
        `${API_URL}/exercises?keyword=${encodeURIComponent(query)}&pageNumber=${page}&pageSize=${itemsPerPage}`, 
        config
      );
      
      const { exercises: fetchedExercises, pages, total } = response.data;
      
      setFilteredExercises(fetchedExercises);
      setCurrentPage(page);
      setTotalPages(pages);
      setTotalExercises(total);
      setLoading(false);
    } catch (error) {
      console.error('Error searching exercises:', error);
      toast.error('Failed to search exercises');
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setSelectedExercise(null);
  };

  const handleViewExercise = (exercise) => {
    setSelectedExercise(exercise);
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleDeleteExercise = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        };
        
        await axios.delete(`${API_URL}/exercises/${id}`, config);
        
        toast.success('Exercise deleted successfully');
        
        // Refresh the exercise list with a delay to ensure backend is updated
        refreshExercisesList(currentPage);
        
        if (selectedExercise && selectedExercise._id === id) {
          setSelectedExercise(null);
          setShowEditForm(false);
        }
      } catch (error) {
        console.error('Error deleting exercise:', error);
        toast.error(error.response?.data?.message || 'Failed to delete exercise');
      }
    }
  };

  const refreshExercisesList = (page = 1) => {
    setTimeout(() => {
      fetchExercises(adminToken, page);
    }, 300);
  };

  const handleSaveExercise = async (exerciseData, isEdit = false) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      };
      
      if (isEdit && selectedExercise) {
        // Handle edit
        await axios.put(
          `${API_URL}/exercises/${selectedExercise._id}`, 
          exerciseData, 
          config
        );
        
        toast.success('Exercise updated successfully');
      } else {
        // Handle add
        await axios.post(
          `${API_URL}/exercises`, 
          exerciseData, 
          config
        );
        
        toast.success('Exercise created successfully');
      }
      
      // Refresh the exercise list with a delay to ensure backend is updated
      refreshExercisesList(1); // Go back to first page after add/edit
      
      setShowAddForm(false);
      setShowEditForm(false);
      setSelectedExercise(null);
    } catch (error) {
      console.error('Error saving exercise:', error);
      toast.error(error.response?.data?.message || 'Failed to save exercise');
    }
  };

  const goBack = () => {
    if (showAddForm) {
      setShowAddForm(false);
    } else if (showEditForm) {
      setShowEditForm(false);
    } else if (selectedExercise) {
      setSelectedExercise(null);
    } else {
      // Navigate to admin home page
      navigate('/admin/home');
    }
  };

  const navigateToAdminHome = () => {
    navigate('/admin/home');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Actual search is handled in the useEffect
  };

  // Pagination logic
  const indexOfLastExercise = currentPage * itemsPerPage;
  const indexOfFirstExercise = indexOfLastExercise - itemsPerPage;
  const currentExercises = filteredExercises;

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      if (searchTerm.trim() !== '') {
        fetchExercisesWithSearch(adminToken, searchTerm, pageNumber);
      } else {
        fetchExercises(adminToken, pageNumber);
      }
    }
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
          {!showAddForm && !showEditForm && !selectedExercise && !loading && (
            <div className="relative w-full sm:w-64 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, category, position..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-800 border border-gray-700 text-purple-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">
            {showAddForm ? 'Add New Exercise' : 
             showEditForm ? 'Edit Exercise' :
             selectedExercise ? selectedExercise.title : 
             'Exercise Management'}
          </h2>
          
          {(showAddForm || showEditForm || selectedExercise) && (
            <button 
              onClick={goBack}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-400 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
          )}
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        {/* Form Component */}
        {(showAddForm || showEditForm) && !loading && (
          <AdminExerciseForm 
            exercise={selectedExercise}
            isEdit={showEditForm}
            onSave={handleSaveExercise}
            adminToken={adminToken}
          />
        )}
        
        {/* View Single Exercise */}
        {selectedExercise && !showEditForm && !showAddForm && !loading && (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-4">{selectedExercise.title}</h3>
                  <p className="text-purple-300 mb-4">{selectedExercise.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedExercise.category && (
                      <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                        Category: {selectedExercise.category}
                      </span>
                    )}
                    {selectedExercise.position && (
                      <span className="bg-gray-700 text-purple-300 px-3 py-1 rounded-full text-sm">
                        Position: {selectedExercise.position}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEditExercise(selectedExercise)}
                      className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDeleteExercise(selectedExercise._id)}
                      className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {selectedExercise.image && (
                    <div>
                      <h4 className="text-sm font-medium text-purple-400 mb-2">Exercise Image</h4>
                      <img 
                        src={selectedExercise.image} 
                        alt={selectedExercise.title} 
                        className="max-h-64 rounded-md"
                      />
                    </div>
                  )}
                  
                  {selectedExercise.video && (
                    <div>
                      <h4 className="text-sm font-medium text-purple-400 mb-2">Exercise Video</h4>
                      <video 
                        src={selectedExercise.video} 
                        controls 
                        className="max-h-64 w-full rounded-md"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Exercise List and Add Exercise Card */}
        {!showAddForm && !showEditForm && !selectedExercise && !loading && (
          <>
            {/* Add Exercise Card - Centered and Styled */}
            <div className="flex justify-center mb-10">
              <div 
                onClick={handleAddExercise}
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-700 hover:border-purple-500 w-full max-w-md"
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaPlus className="text-purple-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-medium text-purple-400">Add New Exercise</h3>
                  <p className="mt-2 text-purple-300">Click to create a new exercise</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mt-10 mb-6">
              Saved Exercises
              <span className="text-base ml-2 text-purple-300">({totalExercises} found)</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentExercises.map((exercise) => (
                <div 
                  key={exercise._id}
                  className="bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-700 hover:border-purple-500"
                  onClick={() => handleViewExercise(exercise)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-purple-400">{exercise.title}</h3>
                    <p className="mt-2 text-white line-clamp-2">{exercise.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {exercise.category && (
                        <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded-full text-xs">
                          {exercise.category}
                        </span>
                      )}
                      {exercise.position && (
                        <span className="bg-gray-700 text-purple-300 px-2 py-1 rounded-full text-xs">
                          {exercise.position}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {totalExercises === 0 && (
              <div className="text-center py-12">
                <p className="text-purple-300">No exercises found. {searchTerm ? 'Try a different search term or ' : ''}Click "Add New Exercise" to create one.</p>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-800 text-purple-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {/* Render pages smartly for large page counts */}
                  {[...Array(totalPages).keys()].map(number => {
                    // Always show first and last page
                    // Also show 1 page before and after current page
                    // and use ellipsis for the rest
                    const pageNumber = number + 1;
                    
                    if (
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageNumber
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-800 text-purple-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      // Show ellipsis for skipped pages
                      return (
                        <span key={pageNumber} className="px-2 text-gray-500">...</span>
                      );
                    }
                    
                    // Don't render other pages
                    return null;
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 text-purple-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminExerciseList;