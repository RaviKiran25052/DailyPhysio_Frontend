import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, Edit, Eye, FileText, Printer, Repeat, Trash, X, ChevronLeft, ChevronRight, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PrintButton from './PrintButton';

const API_URL = process.env.REACT_APP_API_URL || '';

const MyRoutines = ({ user }) => {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [filteredRoutines, setFilteredRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRoutine, setEditRoutine] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Search, Sort, and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPosition, setFilterPosition] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state for mobile view
  const [currentPage, setCurrentPage] = useState(1);
  const [routinesPerPage] = useState(6);

  const [formData, setFormData] = useState({
    name: '',
    reps: 1,
    hold: 1,
    complete: 1,
    perform: {
      count: 1,
      type: 'day'
    }
  });

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Apply search, sort, and filter
  useEffect(() => {
    let filtered = [...routines];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(routine =>
        routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.exercise?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.exercise?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.exercise?.position?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(routine => 
        routine.exercise?.category?.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Apply position filter
    if (filterPosition !== 'all') {
      filtered = filtered.filter(routine => 
        routine.exercise?.position?.toLowerCase() === filterPosition.toLowerCase()
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.exercise?.category?.toLowerCase() || '';
          bValue = b.exercise?.category?.toLowerCase() || '';
          break;
        case 'position':
          aValue = a.exercise?.position?.toLowerCase() || '';
          bValue = b.exercise?.position?.toLowerCase() || '';
          break;
        case 'reps':
          aValue = a.reps;
          bValue = b.reps;
          break;
        case 'hold':
          aValue = a.hold;
          bValue = b.hold;
          break;
        case 'complete':
          aValue = a.complete;
          bValue = b.complete;
          break;
        case 'updated':
          aValue = new Date(a.updatedAt || a.createdAt);
          bValue = new Date(b.updatedAt || b.createdAt);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredRoutines(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [routines, searchQuery, sortBy, sortOrder, filterCategory, filterPosition]);

  // Get unique categories and positions for filter options
  const getUniqueCategories = () => {
    const categories = routines.map(routine => routine.exercise?.category).filter(Boolean);
    return [...new Set(categories)];
  };

  const getUniquePositions = () => {
    const positions = routines.map(routine => routine.exercise?.position).filter(Boolean);
    return [...new Set(positions)];
  };

  // Get current routines for pagination
  const indexOfLastRoutine = currentPage * routinesPerPage;
  const indexOfFirstRoutine = indexOfLastRoutine - routinesPerPage;
  const currentRoutines = isMobile
    ? filteredRoutines.slice(indexOfFirstRoutine, indexOfLastRoutine)
    : filteredRoutines;

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredRoutines.length / routinesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSortBy('name');
    setSortOrder('asc');
    setFilterCategory('all');
    setFilterPosition('all');
  };

  useEffect(() => {
    if (user?._id) {
      fetchRoutines();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRoutines = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/routines`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRoutines(response.data.data);
    } catch (error) {
      console.error('Error fetching routines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoutine = (routine) => {
    navigate(`/exercise/${routine.exercise._id}`, {
      state: {
        routineData: {
          reps: routine.reps,
          hold: routine.hold,
          complete: routine.complete,
          perform: routine.perform
        }
      }
    });
  };

  const handleEditClick = (routine) => {
    setEditRoutine(routine);
    setFormData({
      name: routine.name,
      reps: routine.reps,
      hold: routine.hold,
      complete: routine.complete,
      perform: {
        count: routine.perform.count,
        type: routine.perform.type
      }
    });
    setShowEditPopup(true);
  };

  const handleDeleteClick = (routine) => {
    setRoutineToDelete(routine);
    setShowDeletePopup(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'performCount') {
      setFormData({
        ...formData,
        perform: {
          ...formData.perform,
          count: parseInt(value)
        }
      });
    } else if (name === 'performType') {
      setFormData({
        ...formData,
        perform: {
          ...formData.perform,
          type: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'name' ? value : parseInt(value)
      });
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.warning('Please login to update routine');
      return;
    }

    try {
      await axios.put(
        `${API_URL}/routines/${editRoutine.routineId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchRoutines();
      toast.success('Routine updated successfully');
      setShowEditPopup(false);
    } catch (error) {
      console.error('Error updating routine:', error);
      toast.error('Failed to update routine');
    }
  };

  const handleConfirmDelete = async () => {
    if (!routineToDelete) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.warning('Please login to delete routine');
      return;
    }

    try {
      await axios.delete(`${API_URL}/routines/${routineToDelete.routineId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchRoutines();
      toast.success('Routine deleted successfully');
      setShowDeletePopup(false);
      setRoutineToDelete(null);
    } catch (error) {
      console.error('Error deleting routine:', error);
      toast.error('Failed to delete routine');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 shadow-lg overflow-hidden p-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Pagination component for mobile view
  const Pagination = () => {
    const pageCount = Math.ceil(filteredRoutines.length / routinesPerPage);

    if (pageCount <= 1) return null;

    return (
      <div className="flex items-center justify-center mt-6 space-x-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-primary-500 hover:bg-gray-700'}`}
        >
          <ChevronLeft size={20} />
        </button>

        <span className="text-sm text-gray-400">
          Page {currentPage} of {pageCount}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === pageCount}
          className={`p-2 rounded-full ${currentPage === pageCount ? 'text-gray-600 cursor-not-allowed' : 'text-primary-500 hover:bg-gray-700'}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl bg-primary-700 rounded-xl p-3 md:p-4 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <Activity className="mr-2 text-primary-500" size={24} />
          Workout Routines
        </h2>
        {user.membership.find(m => m.status === 'active' && m.type !== 'free') && (
          <PrintButton
            routines={routines}
            icon={<Printer size={16} />}
            text="Print All Routines"
          />
        )}
      </div>

      {/* Search, Sort, and Filter Controls */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-primary-700">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search routines by name, exercise, category, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-primary-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Sort and Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-300">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-primary-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="position">Position</option>
              <option value="reps">Reps</option>
              <option value="hold">Hold Time</option>
              <option value="complete">Complete</option>
              <option value="updated">Last Updated</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 text-primary-400 hover:text-primary-300"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1 bg-primary-600 hover:bg-primary-700 rounded text-white text-sm transition-colors"
          >
            <Filter size={16} />
            Filters
          </button>

          {/* Clear Filters */}
          {(searchQuery || sortBy !== 'name' || sortOrder !== 'asc' || filterCategory !== 'all' || filterPosition !== 'all') && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position:</label>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Positions</option>
                {getUniquePositions().map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-400">
          {searchQuery || filterCategory !== 'all' || filterPosition !== 'all' ? (
            <span>
              Showing {filteredRoutines.length} of {routines.length} routines
            </span>
          ) : (
            <span>
              {routines.length} routine{routines.length !== 1 ? 's' : ''} total
            </span>
          )}
        </div>
      </div>

      {/* Routines List */}
      {filteredRoutines.length > 0 ? (
        <div className="grid gap-6">
          {currentRoutines.map((routine, index) => (
            <div
              key={routine.routineId}
              className="bg-gray-800 rounded-xl overflow-hidden border border-primary-700 shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div className="mb-3 sm:mb-0">
                    <h3 className="font-semibold text-lg sm:text-xl text-white group-hover:text-primary-400 transition-colors">
                      {routine.name}
                    </h3>
                    <p className="text-sm text-gray-400 flex items-center mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mr-2"></span>
                      {routine.exercise?.category}
                      <span className="mx-2">•</span>
                      {routine.exercise?.position}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    {/* Desktop action buttons */}
                    <div className="hidden sm:flex gap-2">
                      {user.membership.find(m => m.status === 'active' && m.type !== 'free') && (
                        <PrintButton
                          routines={routine}
                          icon={<FileText size={16} />}
                          text="Print"
                        />
                      )}
                      <button
                        onClick={() => handleViewRoutine(routine)}
                        className="p-2 text-sm bg-primary-600 hover:bg-primary-500 rounded-lg text-white flex items-center transition-colors duration-200"
                        aria-label="View routine"
                      >
                        <Eye size={16} className="mr-1" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleEditClick(routine)}
                        className="p-2 text-sm border-2 border-primary-600 hover:bg-primary-500 rounded-lg text-primary-600 hover:text-white transition-colors duration-200"
                        aria-label="Edit routine"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(routine)}
                        className="p-2 text-sm border-2 border-red-600 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
                        aria-label="Delete routine"
                      >
                        <Trash size={16} />
                      </button>
                    </div>

                    {/* Mobile buttons */}
                    <div className="flex sm:hidden gap-2">
                      {user.membership.find(m => m.status === 'active' && m.type !== 'free') && (
                        <PrintButton
                          routines={routine}
                          icon={<FileText size={16} />}
                          text="Print"
                        />
                      )}
                      <button
                        onClick={() => handleViewRoutine(routine)}
                        className="p-2 bg-primary-600 hover:bg-primary-500 rounded-full text-white"
                        aria-label="View routine"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditClick(routine)}
                        className="p-2 border border-primary-600 hover:bg-primary-600 rounded-full text-primary-600 hover:text-white"
                        aria-label="Edit routine"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(routine)}
                        className="p-2 border border-red-600 rounded-full text-red-600 hover:bg-red-600 hover:text-white"
                        aria-label="Delete routine"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
                  <div className="bg-primary-800 rounded-lg p-2 sm:p-3 border-l-4 border-primary-500">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Reps</span>
                    <span className="font-semibold text-base sm:text-lg text-white flex items-center">
                      <Repeat size={14} className="text-primary-400 mr-1" />
                      {routine.reps}
                    </span>
                  </div>

                  <div className="bg-primary-800 rounded-lg p-2 sm:p-3 border-l-4 border-blue-500">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Hold</span>
                    <span className="font-semibold text-base sm:text-lg text-white flex items-center">
                      <Clock size={14} className="text-blue-400 mr-1" />
                      {routine.hold}s
                    </span>
                  </div>

                  <div className="bg-primary-800 rounded-lg p-2 sm:p-3 border-l-4 border-green-500">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Complete</span>
                    <span className="font-semibold text-base sm:text-lg text-white flex items-center">
                      <Activity size={14} className="text-green-400 mr-1" />
                      {routine.complete}
                    </span>
                  </div>

                  <div className="bg-primary-800 rounded-lg p-2 sm:p-3 border-l-4 border-amber-500">
                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Perform</span>
                    <span className="font-semibold text-base sm:text-lg text-white flex items-center">
                      {routine.perform.count}/{routine.perform.type}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Calendar size={12} className="mr-1" />
                    Last modified: {new Date(routine.updatedAt || routine.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination for mobile view only */}
          {isMobile && <Pagination />}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-xl border border-dashed border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary-900/30">
            <Activity size={32} className="text-primary-400" />
          </div>
          <p className="text-primary-400 text-lg mb-2">
            {routines.length === 0 ? 'No routines found' : 'No routines match your filters'}
          </p>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {routines.length === 0 
              ? 'Create your first workout routine to start tracking your fitness journey'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {routines.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Edit Routine Popup */}
      {showEditPopup && editRoutine && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowEditPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-6">Edit Routine</h2>

            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Routine Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reps
                  </label>
                  <select
                    name="reps"
                    value={formData.reps}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={`reps-${i + 1}`} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hold (seconds)
                  </label>
                  <select
                    name="hold"
                    value={formData.hold}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {[...Array(30)].map((_, i) => (
                      <option key={`hold-${i + 1}`} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Complete
                  </label>
                  <select
                    name="complete"
                    value={formData.complete}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={`complete-${i + 1}`} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Perform
                  </label>
                  <div className="flex">
                    <select
                      name="performCount"
                      value={formData.perform.count}
                      onChange={handleChange}
                      className="w-1/2 px-2 py-2 bg-gray-700 border border-gray-600 rounded-l text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={`count-${i + 1}`} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <select
                      name="performType"
                      value={formData.perform.type}
                      onChange={handleChange}
                      className="w-1/2 px-2 py-2 bg-gray-700 border-l-0 border border-gray-600 rounded-r text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="hour">hour</option>
                      <option value="day">day</option>
                      <option value="week">week</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition-colors"
              >
                Update Routine
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && routineToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Routine</h2>
            <p className="mb-6 text-gray-300">
              Are you sure you want to delete "{routineToDelete.name}"? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRoutines;