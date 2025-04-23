import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaUserMd, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import TherapistCard from './TherapistCard';
import TherapistForm from './TherapistForm';
import DeleteConfirmation from './DeleteConfirmation';

// API URL from environment or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TherapistManagement = () => {
  const navigate = useNavigate();
  const [adminToken, setAdminToken] = useState('');
  const [therapists, setTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [deletingTherapist, setDeletingTherapist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for admin authentication and fetch therapists
  useEffect(() => {
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
    fetchTherapists(loggedInAdmin.token);
  }, [navigate]);

  // Fetch therapists from the backend
  const fetchTherapists = async (token) => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/admin/therapists`, config);
      const fetchedTherapists = response.data.therapists || [];
      console.log(fetchedTherapists);
      
      setTherapists(fetchedTherapists);
      setFilteredTherapists(fetchedTherapists);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast.error('Failed to load therapists');
      setLoading(false);
      
      // If the token is invalid, redirect to login
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredTherapists(therapists);
    } else {
      const filtered = therapists.filter(
        therapist => therapist.name.toLowerCase().includes(value)
      );
      setFilteredTherapists(filtered);
    }
  };

  // Navigate back to admin home
  const navigateToAdminHome = () => {
    navigate('/admin/home');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    sessionStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  // Open the form modal for adding a new therapist
  const handleAddTherapist = () => {
    setEditingTherapist(null);
    setIsFormOpen(true);
  };

  // Open the form modal for editing a therapist
  const handleEditTherapist = (therapist) => {
    setEditingTherapist(therapist);
    setIsFormOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (therapist) => {
    setDeletingTherapist(therapist);
  };

  // Handle form submission for adding/editing therapist
  const handleFormSubmit = async (therapistData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      };

      if (editingTherapist) {
        // Edit existing therapist
        const response = await axios.put(
          `${API_URL}/admin/therapists/${editingTherapist._id}`,
          therapistData,
          config
        );
        
        if (response.data.success) {
          // Update local state
          const updatedTherapists = therapists.map(t => 
            t._id === editingTherapist._id ? response.data.therapist : t
          );
          setTherapists(updatedTherapists);
          setFilteredTherapists(updatedTherapists);
          toast.success('Therapist updated successfully');
        }
      } else {
        // Add new therapist
        const response = await axios.post(
          `${API_URL}/admin/therapists`,
          therapistData,
          config
        );
        
        if (response.data.success) {
          // Add to local state
          const newTherapist = response.data.therapist;
          const updatedTherapists = [...therapists, newTherapist];
          setTherapists(updatedTherapists);
          setFilteredTherapists(updatedTherapists);
          toast.success('Therapist added successfully');
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving therapist:', error);
      const errorMsg = error.response && error.response.data.message 
        ? error.response.data.message 
        : 'Failed to save therapist';
      toast.error(errorMsg);
      
      // If the token is invalid, redirect to login
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  // Handle therapist deletion
  const handleDeleteTherapist = async () => {
    if (deletingTherapist) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        };
        
        const response = await axios.delete(
          `${API_URL}/admin/therapists/${deletingTherapist._id}`,
          config
        );
        
        if (response.data.success) {
          // Update local state
          const updatedTherapists = therapists.filter(
            therapist => therapist._id !== deletingTherapist._id
          );
          setTherapists(updatedTherapists);
          setFilteredTherapists(updatedTherapists);
          toast.success('Therapist deleted successfully');
        }
        setDeletingTherapist(null);
      } catch (error) {
        console.error('Error deleting therapist:', error);
        const errorMsg = error.response && error.response.data.message 
          ? error.response.data.message 
          : 'Failed to delete therapist';
        toast.error(errorMsg);
        
        // If the token is invalid, redirect to login
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
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
          
          {/* Search and Add buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by therapist name..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-800 border border-gray-700 text-purple-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button
              onClick={handleAddTherapist}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:w-auto w-full justify-center"
            >
              <FaPlus className="mr-2" />
              Add Therapist
            </button>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-white">Therapist Management</h2>
        </div>
        
        {/* Therapist Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTherapists.length > 0 ? (
              filteredTherapists.map(therapist => (
                <TherapistCard 
                  key={therapist._id} 
                  therapist={therapist} 
                  onEdit={() => handleEditTherapist(therapist)}
                  onDelete={() => handleDeleteClick(therapist)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-400 text-lg">No therapists found</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Therapist Form Modal */}
      {isFormOpen && (
        <TherapistForm 
          therapist={editingTherapist}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTherapist && (
        <DeleteConfirmation
          therapist={deletingTherapist}
          onCancel={() => setDeletingTherapist(null)}
          onConfirm={handleDeleteTherapist}
        />
      )}
    </div>
  );
};

export default TherapistManagement; 