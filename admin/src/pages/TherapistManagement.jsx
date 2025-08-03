import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaSearch, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import TherapistCard from '../components/Therapist/TherapistCard';
import TherapistManagementTable from '../components/Therapist/TherapistManagementTable';

// API URL from environment or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/dailyphysio';

const TherapistManagement = () => {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);
  const [pendingTherapists, setPendingTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [filteredPendingTherapists, setFilteredPendingTherapists] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isCards, setIsCards] = useState(true);

  const fetchTherapists = async () => {
    const loggedInAdmin = localStorage.getItem('adminInfo')
      ? JSON.parse(localStorage.getItem('adminInfo'))
      : sessionStorage.getItem('adminInfo')
        ? JSON.parse(sessionStorage.getItem('adminInfo'))
        : null;

    const token = loggedInAdmin?.token;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/admin/therapists`, config);

      const fetchedTherapists = response.data.therapists || [];
      const fetchedPendingTherapists = response.data.pendingTherapists || [];

      setRequestCount(response.data.requestCount || 0);
      setPendingTherapists(fetchedPendingTherapists);
      setTherapists(fetchedTherapists);
      setFilteredPendingTherapists(fetchedPendingTherapists);
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

  const handleEdit = (therapist) => {
    setSelectedTherapist(therapist);
    setIsModalOpen(true)
  }

  useEffect(() => {
    fetchTherapists();
  }, [isCards]);

  // Handle search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === '') {
      setFilteredTherapists(therapists);
      setFilteredPendingTherapists(pendingTherapists);
    } else {
      const filtered = therapists.filter(
        therapist => therapist.name.toLowerCase().includes(value)
      );
      const filteredPT = pendingTherapists.filter(
        therapist => therapist.name.toLowerCase().includes(value)
      );
      setFilteredPendingTherapists(filteredPT);
      setFilteredTherapists(filtered);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    sessionStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const updateTherapistStatus = async (id, status) => {
    try {
      setProcessing(true);
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      if (!adminInfo || !adminInfo.token) {
        throw new Error('Admin authentication required');
      }

      await axios.put(`${API_URL}/admin/therapists/${id}/approve`,
        { state: status },
        {
          headers: {
            'Authorization': `Bearer ${adminInfo.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchTherapists();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    } finally {
      setIsModalOpen(false);
      setProcessing(false)
    }
  };

  return (
    <main className="p-6">
      {/* Back button at top of the page */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-extrabold text-white">Therapist Management</h2>

        {/* Search and Add buttons */}
        <div className="flex items-center gap-8">
          <div className="relative w-full sm:w-64 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by therapist name..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-800 border border-gray-700 text-primary-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div onClick={() => setIsCards(false)} className="cursor-pointer relative flex items-center justify-center w-10 h-10 rounded-full bg-primary-600/10 border-2 border-primary-500 group-hover:scale-105 transition-transform duration-300">
            <FaBell className="text-white relative z-10" />
            {requestCount > 0 &&
              <>
                <div className="absolute animate-ping h-full w-full bg-primary-500 opacity-75 rounded-full"></div>
                <span className="absolute -top-2 -right-2 bg-white text-primary-900 text-[10px] font-bold rounded-full px-1.5 py-0.5 shadow">
                  {requestCount}
                </span>
              </>
            }
          </div>
        </div>
      </div>

      {/* Therapist Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        isCards ?
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTherapists.length > 0 ? (
              filteredTherapists.map(therapist => (
                <TherapistCard
                  key={therapist._id}
                  therapist={therapist}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-400 text-lg">No therapists found</p>
              </div>
            )}
          </div>
          : <TherapistManagementTable therapists={filteredPendingTherapists} onEdit={handleEdit} onUpdate={updateTherapistStatus} onBack={() => { setIsCards(true); setSearchTerm('') }} />
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 max-w-md border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Update Status for {selectedTherapist.name}
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Status
              </label>
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                  defaultValue={selectedTherapist.status}
                  onChange={(e) => setSelectedTherapist({ ...selectedTherapist, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => updateTherapistStatus(selectedTherapist._id, selectedTherapist.status)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition duration-150"
                disabled={processing}
              >
                {processing ?
                  <div className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md opacity-75">
                    <FaSpinner className="animate-spin mr-2" /> Updating...
                  </div>
                  : "Update"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TherapistManagement; 