import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';

const PrintRoutine = ({ routines, singleRoutine = null }) => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: singleRoutine ? singleRoutine.name : 'Workout Routines',
    pageStyle: `
      @page {
        size: auto;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        .page-break {
          margin-top: 1rem;
          display: block;
          page-break-before: always;
        }
      }
    `,
  });

  return (
    <>
      <button
        onClick={handlePrint}
        className="p-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg text-white flex items-center transition-colors duration-200"
      >
        <Printer size={16} className="mr-1" />
        <span>{singleRoutine ? "Print" : "Print All"}</span>
      </button>

      <div style={{ display: 'none' }}>
        <div ref={printRef} className="p-6 bg-white text-black">
          {singleRoutine ? (
            <SingleRoutineContent routine={singleRoutine} />
          ) : (
            <>
              {routines.map((routine, index) => (
                <React.Fragment key={routine._id || index}>
                  {index > 0 && <div className="page-break" />}
                  <SingleRoutineContent routine={routine} />
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

const SingleRoutineContent = ({ routine }) => {
  const exercise = routine.exerciseId || routine.exercise;
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{routine.name}</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">{exercise?.title || routine.name}</h2>
          <div className="mb-4">
            <div className="font-semibold">Category:</div>
            <div>{exercise?.category || 'N/A'}</div>
          </div>
          <div className="mb-4">
            <div className="font-semibold">Position:</div>
            <div>{exercise?.position || 'N/A'}</div>
          </div>
          <div className="mb-4">
            <div className="font-semibold">Description:</div>
            <div>{exercise?.description || 'No description available'}</div>
          </div>
          <div className="mb-4">
            <div className="font-semibold">Instructions:</div>
            <div>{exercise?.instruction || 'No instructions available'}</div>
          </div>
        </div>
        
        <div>
          {exercise?.image && exercise.image.length > 0 && (
            <div className="mb-4">
              <img 
                src={exercise.image[0]} 
                alt={exercise.title || routine.name} 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          {exercise?.video && (
            <div className="mb-4">
              <div className="font-semibold">Video Link:</div>
              <a href={exercise.video} className="text-blue-600 underline">{exercise.video}</a>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-300 pt-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Routine Details</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="font-semibold">Reps</div>
            <div className="text-xl">{routine.reps}</div>
          </div>
          
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="font-semibold">Hold</div>
            <div className="text-xl">{routine.hold}s</div>
          </div>
          
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="font-semibold">Complete</div>
            <div className="text-xl">{routine.complete}</div>
          </div>
          
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="font-semibold">Perform</div>
            <div className="text-xl">{routine.perform.count}/{routine.perform.type}</div>
          </div>
        </div>
      </div>
      
      {exercise?.image && exercise.image.length > 1 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Additional Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {exercise.image.slice(1).map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`${exercise.title || routine.name} - image ${idx + 2}`}
                className="max-w-full h-auto rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintRoutine; 