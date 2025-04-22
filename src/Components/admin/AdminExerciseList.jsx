import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

// Import sub-components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ExerciseTabs from './components/ExerciseTabs';
import ExerciseGrid from './components/ExerciseGrid';
import ExerciseDetail from './components/ExerciseDetail';
import ExerciseFormModal from './components/ExerciseFormModal';
import Pagination from './components/Pagination';
import { FaPlus } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminExerciseList = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
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
  const [activeTab, setActiveTab] = useState('all');
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    premium: 0,
    custom: 0
  });
  const [isDataFetching, setIsDataFetching] = useState(false);

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

    // Initial data fetch
    const initializeData = async () => {
      await fetchTabCounts(loggedInAdmin.token);
      await fetchExercisesByTab(loggedInAdmin.token, 'all', 1);
    };

    initializeData();

    // Add window resize listener for responsive pagination
    const handleResize = () => {
      setCurrentPage(1); // Reset to first page on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  // Handle tab changes without double loading
  useEffect(() => {
    if (adminToken && !isDataFetching) {
      setIsDataFetching(true);
      fetchExercisesByTab(adminToken, activeTab, 1).finally(() => {
        setIsDataFetching(false);
      });
    }
  }, [activeTab, adminToken]);

  // Apply search filter with debounce
  useEffect(() => {
    if (!adminToken || isDataFetching) return;

    const delayDebounceFn = setTimeout(() => {
      setIsDataFetching(true);
      if (searchTerm.trim() !== '') {
        fetchExercisesWithSearch(adminToken, searchTerm, activeTab).finally(() => {
          setIsDataFetching(false);
        });
      } else {
        fetchExercisesByTab(adminToken, activeTab, 1).finally(() => {
          setIsDataFetching(false);
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, adminToken]);

  const fetchTabCounts = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [allResponse, premiumResponse, customResponse] = await Promise.all([
        axios.get(`${API_URL}/exercises?count=true`, config),
        axios.get(`${API_URL}/exercises?isPremium=true&count=true`, config),
        axios.get(`${API_URL}/exercises?isCustom=true&count=true`, config)
      ]);

      setTabCounts({
        all: allResponse.data.total || 0,
        premium: premiumResponse.data.total || 0,
        custom: customResponse.data.total || 0
      });

      return true;
    } catch (error) {
      console.error('Error fetching tab counts:', error);
      toast.error('Failed to load exercise counts');
      return false;
    }
  };

  const fetchExercisesByTab = async (token, tab, page = 1) => {
    switch (tab) {
      case 'premium':
        return fetchExercises(token, page, true, false);
      case 'custom':
        return fetchExercises(token, page, false, true);
      default: // 'all'
        return fetchExercises(token, page);
    }
  };

  const fetchExercises = async (token, page = 1, isPremium = null, isCustom = null) => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Build URL based on filters
      let url = `${API_URL}/exercises?pageNumber=${page}&pageSize=${itemsPerPage}`;
      if (isPremium !== null) url += `&isPremium=${isPremium}`;
      if (isCustom !== null) url += `&isCustom=${isCustom}`;

      const response = await axios.get(url, config);

      const { exercises: fetchedExercises, pages, total } = response.data;

      setExercises(fetchedExercises);
      setCurrentPage(page);
      setTotalPages(pages);
      setTotalExercises(total);
      setLoading(false);

      return true;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('Failed to load exercises');
      setLoading(false);
      return false;
    }
  };

  const fetchExercisesWithSearch = async (token, query, tab, page = 1) => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Build URL based on filters and tab
      let url = `${API_URL}/exercises?keyword=${encodeURIComponent(query)}&pageNumber=${page}&pageSize=${itemsPerPage}`;

      // Add tab-specific parameters
      if (tab === 'premium') url += '&isPremium=true';
      if (tab === 'custom') url += '&isCustom=true';

      const response = await axios.get(url, config);

      const { exercises: fetchedExercises, pages, total } = response.data;

      setExercises(fetchedExercises);
      setCurrentPage(page);
      setTotalPages(pages);
      setTotalExercises(total);
      setLoading(false);

      return true;
    } catch (error) {
      console.error('Error searching exercises:', error);
      toast.error('Failed to search exercises');
      setLoading(false);
      return false;
    }
  };

  const handleAddExercise = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setSelectedExercise(null);
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
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

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setCurrentPage(1);
      setSearchTerm('');
    }
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

        // Set loading to true to indicate refresh is happening
        setLoading(true);

        // Refresh the data
        await fetchTabCounts(adminToken);
        await fetchExercisesByTab(adminToken, activeTab, currentPage);

        if (selectedExercise && selectedExercise._id === id) {
          setSelectedExercise(null);
          setShowEditForm(false);
        }
      } catch (error) {
        console.error('Error deleting exercise:', error);
        toast.error(error.response?.data?.message || 'Failed to delete exercise');
        setLoading(false);
      }
    }
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
        await axios.put(
          `${API_URL}/exercises/${selectedExercise._id}`,
          exerciseData,
          config
        );

        toast.success('Exercise updated successfully');
      } else {
        await axios.post(`${API_URL}/exercises`, exerciseData, config);
        toast.success('Exercise created successfully');
      }

      // Close the modal
      handleCloseModal();

      // Refresh the data
      setLoading(true);
      await fetchTabCounts(adminToken);
      await fetchExercisesByTab(adminToken, activeTab, 1);
    } catch (error) {
      console.error('Error saving exercise:', error);
      toast.error(error.response?.data?.message || 'Failed to save exercise');
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages && !isDataFetching) {
      setIsDataFetching(true);
      if (searchTerm.trim() !== '') {
        fetchExercisesWithSearch(adminToken, searchTerm, activeTab, pageNumber).finally(() => {
          setIsDataFetching(false);
        });
      } else {
        fetchExercisesByTab(adminToken, activeTab, pageNumber).finally(() => {
          setIsDataFetching(false);
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Header
          title="Exercise Management"
          onHomeClick={() => navigate('/admin/home')}
        />

        {selectedExercise && !showEditForm && (
          <ExerciseDetail
            exercise={selectedExercise}
            onEdit={handleEditExercise}
            onDelete={handleDeleteExercise}
            onBack={() => setSelectedExercise(null)}
          />
        )}

        {!selectedExercise && (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              <button
                onClick={handleAddExercise}
                className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FaPlus className="mr-2" />
                Add Exercise
              </button>
            </div>

            <ExerciseTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              counts={tabCounts}
            />

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                <ExerciseGrid
                  exercises={exercises}
                  totalExercises={totalExercises}
                  onViewExercise={handleViewExercise}
                  searchTerm={searchTerm}
                />

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* Modal for Add/Edit Exercise */}
        <ExerciseFormModal
          isOpen={showAddForm || showEditForm}
          onClose={handleCloseModal}
          exercise={selectedExercise}
          isEdit={showEditForm}
          onSave={handleSaveExercise}
          adminToken={adminToken}
        />
      </main>
    </div>
  );
};

export default AdminExerciseList;