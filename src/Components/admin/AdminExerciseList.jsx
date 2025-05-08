import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

// Import sub-components
import SearchBar from './components/SearchBar';
import ExerciseTabs from './components/ExerciseTabs';
import ExerciseGrid from './components/ExerciseGrid';
import ExerciseDetail from './components/ExerciseDetail';
import CreateExercise from '../Profile/CreateExercise'
import Pagination from './components/Pagination';
import { FaPlus } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminExerciseList = () => {
  const navigate = useNavigate();
  const [allExercises, setAllExercises] = useState([]);
  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [adminToken, setAdminToken] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalExercises, setTotalExercises] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    premium: 0,
    custom: 0
  });

  useEffect(() => {
    // Check if admin is logged in
    const loggedInAdmin = localStorage.getItem('adminInfo')
      ? JSON.parse(localStorage.getItem('adminInfo'))
      : null;

    if (!loggedInAdmin) {
      navigate('/admin/login');
      return;
    }

    setAdminToken(loggedInAdmin.token);
    // Initial data fetch
    fetchAllExercises(loggedInAdmin.token);

    // Reset to first page on component unmount if needed
    return () => { };
  }, [navigate]);

  // Fetch all exercises from the backend
  const fetchAllExercises = async (token) => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/exercises`, config);

      const { exercises, pagination: paginationData } = response.data;

      setAllExercises(exercises);
      setTotalPages(paginationData.totalPages);
      setTotalExercises(paginationData.total);

      // Calculate tab counts
      const counts = {
        all: exercises.length,
        premium: exercises.filter(ex => ex.isPremium).length,
        custom: exercises.filter(ex =>
          (ex.custom?.createdBy === "proUser" ||
            ex.custom?.createdBy === "therapist") &&
          ex.custom?.type === "public"
        ).length
      };

      setTabCounts(counts);

      // Apply initial filtering based on active tab
      filterExercises(exercises, activeTab, searchTerm, 1);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('Failed to load exercises');
      setLoading(false);
    }
  };

  // Filter exercises based on active tab, search term, and current page
  const filterExercises = (exercises, tab, search, page) => {
    let filtered = [...exercises];

    // Apply tab filter
    if (tab === 'premium') {
      filtered = filtered.filter(ex => ex.isPremium);
    } else if (tab === 'custom') {
      filtered = filtered.filter(ex =>
        (ex.custom?.createdBy === "proUser" || ex.custom?.createdBy === "therapist") &&
        ex.custom?.type === "public"
      );
    }

    // Apply search filter if search term exists
    if (search && search.trim() !== '') {
      const searchLower = search?.toLowerCase();
      filtered = filtered.filter(ex =>
        ex.name?.toLowerCase().includes(searchLower) ||
        ex.category?.toLowerCase().includes(searchLower) ||
        ex.subCategory?.toLowerCase().includes(searchLower) ||
        ex.position?.toLowerCase().includes(searchLower)
      );
    }

    // Calculate total pages for filtered results
    const totalFilteredPages = Math.ceil(filtered.length / 9);

    // Apply pagination
    const startIndex = (page - 1) * 9;
    const endIndex = Math.min(startIndex + 9, filtered.length);
    const paginatedExercises = filtered.slice(startIndex, endIndex);

    setDisplayedExercises(paginatedExercises);
    setTotalPages(totalFilteredPages);
    setCurrentPage(page);
    setTotalExercises(filtered.length);
  };

  // Effect for handling tab changes
  useEffect(() => {
    if (allExercises.length > 0) {
      filterExercises(allExercises, activeTab, searchTerm, 1);
    }
  }, [activeTab]);

  // Effect for handling search with debounce
  useEffect(() => {
    if (allExercises.length === 0) return;

    const delayDebounceFn = setTimeout(() => {
      filterExercises(allExercises, activeTab, searchTerm, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // No need for this effect since itemsPerPage is now fixed at 9

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

        // Remove the deleted exercise from state
        const updatedExercises = allExercises.filter(ex => ex._id !== id);
        setAllExercises(updatedExercises);

        // Update counts and filters
        const counts = {
          all: updatedExercises.length,
          premium: updatedExercises.filter(ex => ex.isPremium).length,
          custom: updatedExercises.filter(ex =>
            (ex.custom?.createdBy === "proUser" ||
              ex.custom?.createdBy === "therapist") &&
            ex.custom?.type === "public"
          ).length
        };
        setTabCounts(counts);

        // Apply filters again with updated data
        filterExercises(updatedExercises, activeTab, searchTerm, currentPage);

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

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      filterExercises(allExercises, activeTab, searchTerm, pageNumber);
    }
  };

  return (
    <main className="p-6 ">
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
          <div className='flex justify-between items-center mb-6'>
            <h2 className="text-3xl font-extrabold text-white">Exercise Management</h2>
            <div className="flex gap-4 items-center">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              <button
                onClick={handleAddExercise}
                className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FaPlus className="mr-2" />
                Add Exercise
              </button>
            </div>
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
                exercises={displayedExercises}
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
      <CreateExercise
        isEdit={showEditForm}
        isOpen={showAddForm || showEditForm}
        onClose={handleCloseModal}
        exercise={selectedExercise}
        adminToken={adminToken}
        onSuccess={() => fetchAllExercises(adminToken)}
      />
    </main>
  );
};

export default AdminExerciseList;