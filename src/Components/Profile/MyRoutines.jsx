import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, Edit, Eye, FileText, Printer, Repeat, Trash, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Please allow pop-ups to print routines');
      return;
    }

    const printContent = `
    <!DOCTYPE html>
<html>
<head>
  <title>Workout Routines</title>
  <style>
    @media print {
      body {
        font-family: 'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, sans-serif;
        color: #e5e7eb;
        line-height: 1.6;
        background-color: #111827;
        margin: 0;
        padding: 0;
      }
      
      .page-container {
        max-width: 850px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      
      .page-title {
        text-align: center;
        color: #a78bfa;
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 40px;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      .page-break {
        page-break-after: always;
        height: 0;
        display: block;
      }
      
      .routine-card {
        padding: 30px;
        margin-bottom: 30px;
        border: 1px solid #374151;
        border-radius: 12px;
        background-color: #1f2937;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      }
      
      .routine-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
        color: #f9fafb;
        letter-spacing: -0.5px;
      }
      
      .routine-category {
        font-size: 16px;
        color: #9ca3af;
        margin-bottom: 24px;
        font-style: italic;
      }
      
      .routine-details {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 36px;
      }
      
      .detail-box {
        padding: 16px;
        background-color: #111827;
        border-radius: 10px;
        border-left: 4px solid #8b5cf6;
        transition: transform 0.2s;
      }
      
      .detail-label {
        font-size: 12px;
        text-transform: uppercase;
        color: #9ca3af;
        margin-bottom: 6px;
        letter-spacing: 1px;
      }
      
      .detail-value {
        font-size: 18px;
        font-weight: 600;
        color: #f3f4f6;
      }
      
      .content-section {
        margin-bottom: 32px;
      }
      
      h3 {
        font-size: 20px;
        margin-bottom: 16px;
        color: #a78bfa;
        border-bottom: 1px solid #4b5563;
        padding-bottom: 8px;
      }
      
      p {
        margin: 0 0 16px;
        color: #d1d5db;
        line-height: 1.7;
      }
      
      .routine-images {
        column-count: 2;
        column-gap: 20px;
        margin-bottom: 30px;
      }
      
      .routine-image {
        width: 100%;
        border-radius: 10px;
        margin-bottom: 20px;
        break-inside: avoid;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        border: 1px solid #374151;
      }
      
      .video-link {
        display: inline-block;
        margin-top: 8px;
        color: #8b5cf6;
        text-decoration: none;
        padding: 8px 16px;
        border: 1px solid #8b5cf6;
        border-radius: 6px;
        font-weight: 500;
      }
      
      .routine-footer {
        font-size: 12px;
        color: #6b7280;
        margin-top: 30px;
        text-align: right;
        border-top: 1px solid #374151;
        padding-top: 16px;
      }
      
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <h1 class="page-title">Workout Routines</h1>
    
    ${routines.map((routine, index) => `
      <div class="routine-card">
        <div class="routine-title">${routine.name}</div>
        <div class="routine-category">
          ${routine.exerciseId?.category || routine.exercise?.category} • 
          ${routine.exerciseId?.position || routine.exercise?.position}
        </div>
        
        <div class="routine-details">
          <div class="detail-box">
            <div class="detail-label">Repetitions</div>
            <div class="detail-value">${routine.reps}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Hold Time</div>
            <div class="detail-value">${routine.hold}s</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Completion</div>
            <div class="detail-value">${routine.complete}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Performance</div>
            <div class="detail-value">${routine.perform.count}/${routine.perform.type}</div>
          </div>
        </div>
        
        <div class="content-section">
          <h3>Description</h3>
          <p>${routine.exerciseId?.description || routine.exercise?.description}</p>
        </div>
        
        <div class="content-section">
          <h3>Instructions</h3>
          <p>${routine.exerciseId?.instruction || routine.exercise?.instruction}</p>
        </div>
        
        <div class="content-section">
          <h3>Reference Images</h3>
          <div class="routine-images">
            ${(routine.exerciseId?.image || routine.exercise?.image || []).map(img => `
              <img class="routine-image" src="${img}" alt="${routine.name}" />
            `).join('')}
          </div>
        </div>
        
        ${(routine.exerciseId?.video || routine.exercise?.video) ? `
          <div class="content-section">
            <h3>Video Tutorial</h3>
            <a class="video-link" href="${routine.exerciseId?.video || routine.exercise?.video}" target="_blank">
              Watch Demonstration Video
            </a>
          </div>
        ` : ''}
        
        <div class="routine-footer">
          Last modified: ${new Date(routine.updatedAt).toLocaleDateString()}
        </div>
      </div>
      ${index < routines.length - 1 ? '<div class="page-break"></div>' : ''}
    `).join('')}
  </div>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print();
      // Close the window after print dialog closes (or after a delay)
      setTimeout(() => {
        printWindow.close();
      }, 500);
    }, 500);
  };

  const handlePrintSingle = (routine) => {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Please allow pop-ups to print routine');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
<html>
<head>
  <title>${routine.name}</title>
  <style>
    @media print {
      body {
        font-family: 'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, sans-serif;
        color: #e5e7eb;
        line-height: 1.6;
        background-color: #111827;
        margin: 0;
        padding: 0;
      }
      
      .page-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      
      .routine-card {
        padding: 30px;
        margin-bottom: 30px;
        border: 1px solid #374151;
        border-radius: 12px;
        background-color: #1f2937;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      }
      
      .routine-title {
        font-size: 28px;
        font-weight: 700;
        color: #f9fafb;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }
      
      .routine-category {
        font-size: 16px;
        color: #9ca3af;
        margin-bottom: 24px;
        font-style: italic;
      }
      
      .details-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 36px;
      }
      
      .detail-box {
        padding: 16px;
        background-color: #111827;
        border-radius: 10px;
        border-left: 4px solid #8b5cf6;
        transition: transform 0.2s;
      }
      
      .detail-label {
        font-size: 12px;
        text-transform: uppercase;
        color: #9ca3af;
        margin-bottom: 6px;
        letter-spacing: 1px;
      }
      
      .detail-value {
        font-size: 18px;
        font-weight: 600;
        color: #f3f4f6;
      }
      
      .content-section {
        margin-bottom: 32px;
      }
      
      h3 {
        font-size: 20px;
        margin-bottom: 16px;
        color: #a78bfa;
        border-bottom: 1px solid #4b5563;
        padding-bottom: 8px;
      }
      
      p {
        margin: 0 0 16px;
        color: #d1d5db;
        line-height: 1.7;
      }
      
      .routine-images {
        column-count: 2;
        column-gap: 20px;
        margin-bottom: 30px;
      }
      
      .routine-image {
        width: 100%;
        border-radius: 10px;
        margin-bottom: 20px;
        break-inside: avoid;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        border: 1px solid #374151;
      }
      
      .video-link {
        display: inline-block;
        margin-top: 8px;
        color: #8b5cf6;
        text-decoration: none;
        padding: 8px 16px;
        border: 1px solid #8b5cf6;
        border-radius: 6px;
        font-weight: 500;
      }
      
      .footer {
        font-size: 12px;
        color: #6b7280;
        margin-top: 30px;
        text-align: right;
        border-top: 1px solid #374151;
        padding-top: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="routine-card">
      <div class="routine-title">${routine.name}</div>
      <div class="routine-category">
        ${routine.exerciseId?.category || routine.exercise?.category} • 
        ${routine.exerciseId?.position || routine.exercise?.position}
      </div>
      
      <div class="details-grid">
        <div class="detail-box">
          <div class="detail-label">Repetitions</div>
          <div class="detail-value">${routine.reps}</div>
        </div>
        <div class="detail-box">
          <div class="detail-label">Hold Time</div>
          <div class="detail-value">${routine.hold}s</div>
        </div>
        <div class="detail-box">
          <div class="detail-label">Completion</div>
          <div class="detail-value">${routine.complete}</div>
        </div>
        <div class="detail-box">
          <div class="detail-label">Performance</div>
          <div class="detail-value">${routine.perform.count}/${routine.perform.type}</div>
        </div>
      </div>
      
      <div class="content-section">
        <h3>Description</h3>
        <p>${routine.exerciseId?.description || routine.exercise?.description}</p>
      </div>
      
      <div class="content-section">
        <h3>Instructions</h3>
        <p>${routine.exerciseId?.instruction || routine.exercise?.instruction}</p>
      </div>
      
      <div class="content-section">
        <h3>Reference Images</h3>
        <div class="routine-images">
          ${(routine.exerciseId?.image || routine.exercise?.image || []).map(img => `
            <img class="routine-image" src="${img}" alt="${routine.name}" />
          `).join('')}
        </div>
      </div>
      
      ${(routine.exerciseId?.video || routine.exercise?.video) ? `
        <div class="content-section">
          <h3>Video Tutorial</h3>
          <a class="video-link" href="${routine.exerciseId?.video || routine.exercise?.video}" target="_blank">
            Watch Demonstration Video
          </a>
        </div>
      ` : ''}
      
      <div class="footer">
        Last modified: ${new Date(routine.updatedAt).toLocaleDateString()}
      </div>
    </div>
  </div>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print();
      // Close the window after print dialog closes (or after a delay)
      setTimeout(() => {
        printWindow.close();
      }, 500);
    }, 500);
  };

  // This button will be visible in the app, but hidden when printing
  const PrintButton = ({ onClick, icon, text, className }) => (
    <button
      onClick={onClick}
      className={`p-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg text-white flex items-center transition-colors duration-200 ${className}`}
    >
      {icon}
      <span className="ml-1">{text}</span>
    </button>
  );

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

    } catch (error) {
      console.error('Error fetching routines:', error);
      toast.error('Failed to load routines');
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Activity className="mr-2 text-purple-500" size={24} />
          Workout Routines
        </h2>
        <PrintButton
          onClick={handlePrintAll}
          icon={<Printer size={16} />}
          text="Print All Routines"
        />
      </div>
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
                      <PrintButton
                        onClick={() => handlePrintSingle(routine)}
                        icon={<FileText size={16} />}
                        text="Print"
                      />
                      <button
                        onClick={() => handleViewRoutine(routine)}
                        className="p-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg text-white flex items-center transition-colors duration-200"
                        aria-label="View routine"
                      >
                        <Eye size={16} className="mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </button>
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
                      Last modified: {new Date(routine.updatedAt || routine.createdAt).toLocaleDateString()}
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