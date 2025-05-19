import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, Edit, Eye, FileText, Printer, Repeat, Trash, X, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const API_URL = process.env.REACT_APP_API_URL || '';

const MyRoutines = ({ user }) => {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRoutine, setEditRoutine] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
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
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Get current routines for pagination
  const indexOfLastRoutine = currentPage * routinesPerPage;
  const indexOfFirstRoutine = indexOfLastRoutine - routinesPerPage;
  const currentRoutines = isMobile 
    ? routines.slice(indexOfFirstRoutine, indexOfLastRoutine)
    : routines;
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(routines.length / routinesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

      const response = await axios.get(`${API_URL}/routines`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRoutines(response.data.data);

    } catch (error) {
      console.error('Error fetching routines:', error);
      // toast.error('Failed to load routines');
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

  const handlePrintRoutine = (routine) => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error('Please allow pop-ups to print routines');
      return;
    }

    const printContent = generatePrintContent([routine]);
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Add event listeners after document is loaded
    printWindow.onload = function() {
      // Add download functionality
      const downloadBtn = printWindow.document.getElementById('downloadPdf');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
          const filename = `${routine.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_routine.pdf`;
          
          printWindow.document.getElementById('downloadWrapper').style.display = 'none';
          
          printWindow.print();
          
          // Show the download button again after print dialog is closed/cancelled
          setTimeout(() => {
            if (printWindow.document.getElementById('downloadWrapper')) {
              printWindow.document.getElementById('downloadWrapper').style.display = 'flex';
            }
          }, 1000);
        });
      }
    };
  };

  const handlePrintAllRoutines = () => {
    if (routines.length === 0) {
      toast.info('No routines to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error('Please allow pop-ups to print routines');
      return;
    }

    const printContent = generatePrintContent(routines);
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Add event listeners after document is loaded
    printWindow.onload = function() {
      // Add download functionality
      const downloadBtn = printWindow.document.getElementById('downloadPdf');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
          const filename = 'all_exercise_routines.pdf';
          
          printWindow.document.getElementById('downloadWrapper').style.display = 'none';
          
          printWindow.print();
          
          // Show the download button again after print dialog is closed/cancelled
          setTimeout(() => {
            if (printWindow.document.getElementById('downloadWrapper')) {
              printWindow.document.getElementById('downloadWrapper').style.display = 'flex';
            }
          }, 1000);
        });
      }
    };
  };

  const generatePrintContent = (routinesToPrint) => {
    const printStyles = `
      /* Non-print styles for the webpage view */
      body {
        font-family: Arial, sans-serif;
        line-height: 1.5;
        color: #333;
        background: #f5f7fb;
        padding: 0;
        margin: 0;
      }
      #downloadWrapper {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: center;
        padding: 15px;
        background: #6d28d9;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
      }
      #downloadPdf {
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        color: #6d28d9;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
      }
      #downloadPdf:hover {
        background: #f3f4f6;
      }
      .page-container {
        max-width: 21cm;
        margin: 0 auto;
        background: white;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        padding: 1.5cm;
      }
      
      /* Common styles for both screen and print */
      * {
        box-sizing: border-box;
      }
      .page-header {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
      }
      .logo-area {
        width: 60px;
        height: 60px;
        background: #6d28d9;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        color: white;
        font-weight: bold;
        font-size: 24px;
      }
      .title-area {
        flex: 1;
      }
      .routine-container {
        margin-bottom: 30px;
        max-width: 100%;
        border-bottom: 1px dashed #e5e7eb;
        padding-bottom: 30px;
        position: relative;
        background: white;
      }
      .routine-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: -15px;
        width: 4px;
        height: calc(100% - 30px);
        background: linear-gradient(to bottom, #6d28d9, rgba(109, 40, 217, 0.1));
        border-radius: 4px;
      }
      .routine-bg {
        position: absolute;
        right: 0;
        top: 10px;
        width: 150px;
        height: 150px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="rgba(109, 40, 217, 0.05)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>');
        background-repeat: no-repeat;
        background-position: right top;
        opacity: 0.7;
        pointer-events: none;
      }
      .routine-title {
        font-size: 26px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #6d28d9;
        border-bottom: 2px solid #6d28d9;
        padding-bottom: 8px;
        text-align: center;
        position: relative;
      }
      .routine-meta {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 20px;
        font-size: 14px;
      }
      .meta-item {
        background: #f9f9f9;
        padding: 8px 12px;
        border-radius: 6px;
        border-left: 4px solid #6d28d9;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        position: relative;
        overflow: hidden;
      }
      .meta-item::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        background: rgba(109, 40, 217, 0.1);
        border-radius: 0 0 0 20px;
      }
      .meta-label {
        font-weight: bold;
        margin-right: 5px;
        color: #6d28d9;
      }
      .meta-value {
        color: #4b5563;
        font-weight: 500;
      }
      .section-title {
        font-size: 18px;
        font-weight: bold;
        margin: 15px 0 10px;
        color: #374151;
        border-left: 4px solid #6d28d9;
        padding-left: 10px;
        display: flex;
        align-items: center;
      }
      .section-title::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e5e7eb;
        margin-left: 10px;
      }
      .instruction-text {
        margin-bottom: 15px;
        line-height: 1.6;
        text-align: justify;
        color: #1f2937;
      }
      .image-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 15px;
        margin: 15px 0;
        justify-items: center;
      }
      .exercise-image {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        max-height: 280px;
        object-fit: contain;
        border: 1px solid #e5e7eb;
      }
      .full-width-image {
        grid-column: 1 / -1;
        max-width: 90%;
        max-height: 320px;
        object-fit: contain;
        margin: 0 auto;
      }
      .video-link {
        margin: 15px 0;
        padding: 12px;
        background: #f3f4f6;
        border-radius: 8px;
        border-left: 4px solid #6d28d9;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .video-link a {
        color: #6d28d9;
        text-decoration: none;
        font-weight: bold;
        background: rgba(109, 40, 217, 0.1);
        padding: 5px 15px;
        border-radius: 20px;
        display: inline-block;
        margin-left: 10px;
        transition: background 0.2s;
      }
      .video-link a:hover {
        background: rgba(109, 40, 217, 0.2);
      }
      .footer {
        margin-top: 25px;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
        border-top: 1px solid #e5e7eb;
        padding-top: 15px;
        position: relative;
      }
      .footer::before {
        content: '';
        position: absolute;
        top: -3px;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 5px;
        background: #6d28d9;
        border-radius: 10px;
      }
      .heading {
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        margin: 15px 0 5px;
        color: #6d28d9;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .header-decoration {
        display: block;
        width: 120px;
        height: 3px;
        background: #6d28d9;
        margin: 10px auto 25px;
        position: relative;
      }
      .header-decoration::before, .header-decoration::after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        background: #6d28d9;
        border-radius: 50%;
        top: -2.5px;
      }
      .header-decoration::before {
        left: 0;
      }
      .header-decoration::after {
        right: 0;
      }
      .separator {
        display: block;
        width: 100%;
        height: 1px;
        background: #e5e7eb;
        margin: 12px 0;
      }
      .description-box {
        background: #f9fafb;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 15px;
        border-left: 4px solid #6d28d9;
        position: relative;
      }
      .description-box::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 50px;
        height: 50px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(109, 40, 217, 0.05)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>');
        background-repeat: no-repeat;
        background-position: right bottom;
        transform: scale(2);
      }
      .pattern-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(rgba(109, 40, 217, 0.03) 2px, transparent 2px);
        background-size: 24px 24px;
        pointer-events: none;
        z-index: -1;
      }
      .disclaimer {
        font-size: 11px;
        color: #6b7280;
        margin-top: 8px;
        text-align: center;
        font-style: italic;
      }
      
      /* Print-specific styles */
      @media print {
        @page {
          size: A4;
          margin: 1.2cm;
        }
        body {
          background: white;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #downloadWrapper {
          display: none !important;
        }
        .page-container {
          box-shadow: none;
          padding: 0;
          max-width: none;
        }
        .routine-container {
          page-break-after: always;
        }
        /* Ensure URLs appear in printed PDFs next to links */
        .video-link a::after {
          content: " (" attr(href) ")";
          font-size: 0.85em;
          font-weight: normal;
          font-style: italic;
        }
      }
    `;

    const routineHtml = routinesToPrint.map(routine => {
      const exerciseData = routine.exerciseId || routine.exercise;
      
      // Handle image layout - if single image it's centered, if multiple in a grid
      let imagesHtml = '';
      if (exerciseData?.image && exerciseData.image.length > 0) {
        const validImages = exerciseData.image.filter(img => img && img !== '');
        
        if (validImages.length === 1) {
          // Single image gets full width
          imagesHtml = `<img src="${validImages[0]}" alt="${exerciseData.title}" class="exercise-image full-width-image">`;
        } else if (validImages.length > 0) {
          // Multiple images in a grid
          imagesHtml = validImages.map(img => 
            `<img src="${img}" alt="${exerciseData.title}" class="exercise-image">`
          ).join('');
        }
      }
        
      // For PDF printing, we need to make sure the links are absolute URLs
      let videoUrl = exerciseData?.video || '';
      // Add http:// prefix if missing
      if (videoUrl && !videoUrl.startsWith('http://') && !videoUrl.startsWith('https://')) {
        videoUrl = 'https://' + videoUrl;
      }
        
      const videoHtml = videoUrl 
        ? `<div class="video-link">
            <strong>Exercise Video:</strong> 
            <a href="${videoUrl}" target="_blank" rel="noopener">
              View Video
            </a>
          </div>`
        : '';

      return `
        <div class="routine-container">
          <div class="routine-bg"></div>
          <div class="pattern-bg"></div>
          <h2 class="routine-title">${routine.name}</h2>
          <div class="header-decoration"></div>
          
          <div class="routine-meta">
            <div class="meta-item">
              <span class="meta-label">Category:</span>
              <span class="meta-value">${exerciseData?.category || 'N/A'}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Position:</span>
              <span class="meta-value">${exerciseData?.position || 'N/A'}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Reps:</span>
              <span class="meta-value">${routine.reps}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Hold:</span>
              <span class="meta-value">${routine.hold}s</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Complete:</span>
              <span class="meta-value">${routine.complete} times</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Perform:</span>
              <span class="meta-value">${routine.perform.count} times/${routine.perform.type}</span>
            </div>
          </div>
          
          <h3 class="section-title">Description</h3>
          <div class="description-box">
            <p class="instruction-text">${exerciseData?.description || 'No description available'}</p>
          </div>
          
          <h3 class="section-title">Instructions</h3>
          <p class="instruction-text">${exerciseData?.instruction || 'No instructions available'}</p>
          
          <div class="separator"></div>
          
          <h3 class="section-title">Exercise Images</h3>
          <div class="image-container">
            ${imagesHtml || '<p class="instruction-text" style="text-align: center;">No images available</p>'}
          </div>
          
          ${videoHtml}
          
          <p class="disclaimer">Please consult with your healthcare provider before starting any new exercise program.</p>
        </div>
      `;
    }).join('');

    const docTitle = routinesToPrint.length > 1 
      ? 'My Exercise Routines' 
      : routinesToPrint[0]?.name || 'Exercise Routine';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${docTitle}</title>
        <style>${printStyles}</style>
      </head>
      <body>
        <div id="downloadWrapper">
          <button id="downloadPdf" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download PDF
          </button>
        </div>

        <div class="page-container">
          <div class="page-header">
            <div class="logo-area">H2G</div>
            <div class="title-area">
              <h1 class="heading">${routinesToPrint.length > 1 ? 'My Exercise Routines' : 'Exercise Routine'}</h1>
              <div class="header-decoration"></div>
            </div>
          </div>
          
          ${routineHtml}
          <div class="footer">
            <p>Generated from Hep2Go on ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <script>
          // Ensure all links open in a new tab and are properly formatted for PDF
          document.querySelectorAll('a').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
            
            // Make sure links have http/https prefix
            let href = link.getAttribute('href');
            if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
              link.setAttribute('href', 'https://' + href);
            }
          });
        </script>
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 shadow-lg overflow-hidden p-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Pagination component for mobile view
  const Pagination = () => {
    const pageCount = Math.ceil(routines.length / routinesPerPage);
    
    if (pageCount <= 1) return null;
    
    return (
      <div className="flex items-center justify-center mt-6 space-x-2">
        <button 
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-purple-500 hover:bg-gray-700'}`}
        >
          <ChevronLeft size={20} />
        </button>
        
        <span className="text-sm text-gray-400">
          Page {currentPage} of {pageCount}
        </span>
        
        <button 
          onClick={nextPage}
          disabled={currentPage === pageCount}
          className={`p-2 rounded-full ${currentPage === pageCount ? 'text-gray-600 cursor-not-allowed' : 'text-purple-500 hover:bg-gray-700'}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto" >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <Activity className="mr-2 text-purple-500" size={24} />
          Workout Routines
        </h2>
        <div className="hidden sm:block">
          <PrintButton
            onClick={handlePrintAll}
            icon={<Printer size={16} />}
            text="Print All Routines"
          />
        </div>
        <button
          onClick={handlePrintAll}
          className="sm:hidden p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white"
          aria-label="Print All Routines"
        >
          <Printer size={18} />
        </button>
      </div>
      {
        routines.length > 0 ? (
          <div className="grid gap-6">
            {currentRoutines.map(routine => (
              <div
                key={routine._id}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:shadow-purple-900/20 transition-all duration-300"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-semibold text-lg sm:text-xl text-white group-hover:text-purple-400 transition-colors">
                        {routine.name}
                      </h3>
                      <p className="text-sm text-gray-400 flex items-center mt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                        {routine.exerciseId?.category || routine.exercise?.category}
                        <span className="mx-2">•</span>
                        {routine.exerciseId?.position || routine.exercise?.position}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {/* Mobile-friendly action buttons */}
                      <div className="hidden sm:flex gap-2">
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
                          <span>View</span>
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
                      
                      {/* Mobile buttons - simplified icon only version */}
                      <div className="flex sm:hidden gap-2">
                        <button
                          onClick={() => handlePrintSingle(routine)}
                          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-purple-500"
                          aria-label="Print routine"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleViewRoutine(routine)}
                          className="p-2 bg-purple-600 hover:bg-purple-500 rounded-full text-white"
                          aria-label="View routine"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditClick(routine)}
                          className="p-2 border border-purple-600 hover:bg-purple-600 rounded-full text-purple-600 hover:text-white"
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
                    <div className="bg-gray-900 rounded-lg p-2 sm:p-3 border-l-4 border-purple-500">
                      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Reps</span>
                      <span className="font-semibold text-base sm:text-lg text-white flex items-center">
                        <Repeat size={14} className="text-purple-400 mr-1" />
                        {routine.reps}
                      </span>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-2 sm:p-3 border-l-4 border-blue-500">
                      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Hold</span>
                      <span className="font-semibold text-base sm:text-lg text-white flex items-center">
                        <Clock size={14} className="text-blue-400 mr-1" />
                        {routine.hold}s
                      </span>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-2 sm:p-3 border-l-4 border-green-500">
                      <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Complete</span>
                      <span className="font-semibold text-base sm:text-lg text-white flex items-center">
                        <Activity size={14} className="text-green-400 mr-1" />
                        {routine.complete}
                      </span>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-2 sm:p-3 border-l-4 border-amber-500">
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