import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiCloseLine, RiSearchLine, RiArrowLeftLine } from 'react-icons/ri';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

const AddConsultation = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [consultationData, setConsultationData] = useState({
    activeDays: 7,
    notes: '',
  });

  const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));

  useEffect(() => {
    fetchUsers();
    fetchExercises();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${therapistInfo.token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };
  const handleFormSubmission = () => {
    const pass =  formData.password === formData.confirmPassword;
    const email = formData.email.includes('@');
    if (pass && email) {
      setStep(2);
    } else if (!pass) {
      toast.error('Passwords do not match');
    } else if (!email) {
      toast.error('Invalid email');
    }
  };
  const fetchExercises = async () => {
    try {
      const response = await axios.get(`${API_URL}/exercises`, {
        headers: { Authorization: `Bearer ${therapistInfo.token}` }
      });
      setExercises(Array.isArray(response.data) ? response.data : response.data.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setExercises([]);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = userSearchTerm.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const filteredExercises = exercises.filter(exercise => {
    if (!exercise) return false;
    const searchLower = exerciseSearchTerm.toLowerCase();
    return (
      (exercise.title?.toLowerCase().includes(searchLower) || false) ||
      (exercise.description?.toLowerCase().includes(searchLower) || false)
    );
  });

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setStep(2);
  };

  const toggleExerciseSelection = (exercise) => {
    setSelectedExercises(prev =>
      prev.some(ex => ex._id === exercise._id)
        ? prev.filter(ex => ex._id !== exercise._id)
        : [...prev, exercise]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let userId = selectedUser?._id;

      if (!userId && showNewUserForm) {
        // Register new user
        const response = await axios.post(`${API_URL}/users/register`, {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          creator: {
            createdBy: 'therapist',
            createdById: therapistInfo._id
          }
        });

        userId = response.data._id;
      }
      // Create consultation
      const response = await axios.post(
        `${API_URL}/therapist/consultations`,
        {
          userId,
          exercises: selectedExercises.map(ex => ex._id),
          activeDays: parseInt(consultationData.activeDays),
          desp: consultationData.notes
        },
        { headers: { Authorization: `Bearer ${therapistInfo.token}` } }
      );

      if (response.status === 201) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error creating consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">New Consultation</h2>
            <div className="flex mt-2 space-x-4">
              <div className={`text-sm ${step >= 1 ? 'text-primary-400' : 'text-gray-400'}`}>1. Select Patient</div>
              <div className={`text-sm ${step >= 2 ? 'text-primary-400' : 'text-gray-400'}`}>2. Choose Exercises</div>
              <div className={`text-sm ${step >= 3 ? 'text-primary-400' : 'text-gray-400'}`}>3. Finalize</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Step 1: Select User */}
          {step === 1 && (
            <div className="space-y-4">
              {!showNewUserForm ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="relative flex-1 max-w-md">
                      <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-primary-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <button
                      onClick={() => setShowNewUserForm(true)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      New User
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleUserSelect(user)}
                        className="bg-primary-700 p-4 rounded-lg cursor-pointer hover:bg-primary-600 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.profileImage}
                            alt={user.fullName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-white">{user.fullName}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-primary-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Create New User</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowNewUserForm(false)}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleFormSubmission()}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Exercises */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {setSelectedUser(null)
                    setStep(1)}}
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  <RiArrowLeftLine className="mr-2" />
                  Back
                </button>
                <div className="relative flex-1 max-w-md ml-4">
                  <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={exerciseSearchTerm}
                    onChange={(e) => setExerciseSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-primary-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise._id}
                    onClick={() => toggleExerciseSelection(exercise)}
                    className={`bg-primary-700 p-4 rounded-lg cursor-pointer transition-colors ${selectedExercises.some(ex => ex._id === exercise._id)
                        ? 'ring-2 ring-primary-500'
                        : 'hover:bg-primary-600'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-white">{exercise.title}</h3>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedExercises.some(ex => ex._id === exercise._id)
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-gray-500'
                        }`}>
                        {selectedExercises.some(ex => ex._id === exercise._id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{exercise.description}</p>
                    <div className="mt-2 text-sm text-primary-400">
                      {exercise.category} - {exercise.subCategory}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedExercises.length === 0}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Finalize */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  <RiArrowLeftLine className="mr-2" />
                  Back
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Summary</h3>
                  <div className="bg-primary-700 p-4 rounded-lg space-y-4">
                    <div>
                      <div className="text-sm text-gray-400">Patient</div>
                      <div className="font-medium text-white">
                        {selectedUser ? selectedUser.fullName : formData.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Selected Exercises</div>
                      <div className="font-medium text-white">{selectedExercises.length} exercises</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Consultation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Active Days
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={consultationData.activeDays}
                        onChange={(e) => setConsultationData(prev => ({ ...prev, activeDays: e.target.value }))}
                        className="w-full px-4 py-2 bg-primary-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={consultationData.notes}
                        onChange={(e) => setConsultationData(prev => ({ ...prev, notes: e.target.value }))}
                        rows="4"
                        className="w-full px-4 py-2 bg-primary-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Add any additional notes..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Consultation'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddConsultation; 