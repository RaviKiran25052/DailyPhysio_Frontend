import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, Edit, Eye, Repeat, Trash, X, Printer } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PrintRoutine from './PrintRoutine';

const API_URL = process.env.REACT_APP_API_URL || '';

const MyRoutines = ({ user }) => {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRoutine, setEditRoutine] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState(null);
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

      const response = await axios.get(`${API_URL}/routines/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRoutines(response.data.data);
      console.log(response.data.data);
      
    } catch (error) {
      console.error('Error fetching routines:', error);
      toast.error('Failed to load routines');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoutine = (routine) => {
    navigate(`/exercise/${routine.exerciseId._id}`, {
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
        `${API_URL}/routines/${editRoutine._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the local state
      setRoutines(routines.map(r =>
        r._id === editRoutine._id ? { ...r, ...formData } : r
      ));

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
      await axios.delete(`${API_URL}/routines/${routineToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the local state
      setRoutines(routines.filter(r => r._id !== routineToDelete._id));

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" >
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center justify-between">
        <div className="flex items-center">
          <Activity className="mr-2 text-purple-500" size={24} />
          Workout Routines
        </div>
        {routines.length > 0 && (
          <PrintRoutine routines={routines} />
        )}
      </h2>

      {
        routines.length > 0 ? (
          <div className="grid gap-6">
            {routines.map(routine => (
              <div
                key={routine._id}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:shadow-purple-900/20 transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold text-xl text-white group-hover:text-purple-400 transition-colors">
                        {routine.name}
                      </h3>
                      <p className="text-sm text-gray-400 flex items-center mt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                        {routine.exerciseId?.category || routine.exercise?.category}
                        <span className="mx-2">•</span>
                        {routine.exerciseId?.position || routine.exercise?.position}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewRoutine(routine)}
                        className="p-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg text-white flex items-center transition-colors duration-200"
                        aria-label="View routine"
                      >
                        <Eye size={16} className="mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <PrintRoutine routines={routines} singleRoutine={routine} />
                      <button
                        onClick={() => handleEditClick(routine)}
                        className="p-2 text-sm border-2 border-purple-600 hover:bg-purple-500 rounded-lg text-purple-600 hover:text-white transition-colors duration-200"
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
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div className="bg-gray-900 rounded-lg p-3 border-l-4 border-purple-500">
                      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Reps</span>
                      <span className="font-semibold text-lg text-white flex items-center">
                        <Repeat size={14} className="text-purple-400 mr-1" />
                        {routine.reps}
                      </span>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-3 border-l-4 border-blue-500">
                      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Hold</span>
                      <span className="font-semibold text-lg text-white flex items-center">
                        <Clock size={14} className="text-blue-400 mr-1" />
                        {routine.hold}s
                      </span>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-3 border-l-4 border-green-500">
                      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Complete</span>
                      <span className="font-semibold text-lg text-white flex items-center">
                        <Activity size={14} className="text-green-400 mr-1" />
                        {routine.complete}
                      </span>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-3 border-l-4 border-amber-500">
                      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Perform</span>
                      <span className="font-semibold text-lg text-white flex items-center">
                        {routine.perform.count}/{routine.perform.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      Last modified: {new Date(routine.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-dashed border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-900/30">
              <Activity size={32} className="text-purple-400" />
            </div>
            <p className="text-purple-400 text-lg mb-2">No routines found</p>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Create your first workout routine to start tracking your fitness journey
            </p>
          </div>
        )
      }
      {/* Edit Routine Popup */}
      {
        showEditPopup && editRoutine && (
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
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        className="w-1/2 px-2 py-2 bg-gray-700 border border-gray-600 rounded-l text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={`count-${i + 1}`} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <select
                        name="performType"
                        value={formData.perform.type}
                        onChange={handleChange}
                        className="w-1/2 px-2 py-2 bg-gray-700 border-l-0 border border-gray-600 rounded-r text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                >
                  Update Routine
                </button>
              </form>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation Popup */}
      {
        showDeletePopup && routineToDelete && (
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
        )
      }
    </div >
  );
};

export default MyRoutines;