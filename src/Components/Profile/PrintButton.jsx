const PrintButton = ({ routines, icon, text }) => {

	const handlePrintAll = (routines) => {
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

	const handlePrintSingle = (routines) => {
		const routine = routines[0];
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

	return (
		<button
			onClick={routines.length > 1 ? () => {handlePrintAll(routines)} : () => {handlePrintSingle([routines])}}
			className="p-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg text-white flex items-center transition-colors duration-200"
		>
			{icon}
			<span className="ml-1">{text}</span>
		</button>
	)
}

export default PrintButton