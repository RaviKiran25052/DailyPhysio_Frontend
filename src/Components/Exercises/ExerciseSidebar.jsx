import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Filter, TriangleAlert } from 'lucide-react';

const ExerciseSidebar = ({
  loading,
  categories,
  positions,
  selectedCategory,
  setSelectedCategory,
  selectedPosition,
  setSelectedPosition,
  selectedSubCategory,
  setSelectedSubCategory,
  showFilters
}) => {
  const [validSubCategories, setValidSubCategories] = useState({});
  const [hoverCategory, setHoverCategory] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const selectedCategoryRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const data = {}
    for (const [category, items] of Object.entries(categories)) {
      data[category] = items.map(item => item.subCategory);
    }

    setValidSubCategories(data);
  }, []);

  // Scroll to selected category when component mounts or category changes
  useEffect(() => {
    if (selectedCategoryRef.current) {
      // Smooth scroll the category into view
      selectedCategoryRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedCategory]);

  // Add a buffer zone around the popup
  const handleMouseMove = (e) => {
    if (!hoverCategory || !popupRef.current) return;

    const popup = popupRef.current.getBoundingClientRect();
    const buffer = 30; // Buffer zone in pixels

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Check if mouse is moving toward the popup
    const isMovingTowardPopup =
      // Moving right toward popup
      (mouseX < popup.left && mouseX > popup.left - buffer &&
        mouseY > popup.top - buffer && mouseY < popup.bottom + buffer);

    if (isMovingTowardPopup) {
      // Clear any timeout that would close the popup
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
    }
  };

  useEffect(() => {
    // Add mousemove listener to track mouse movement
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoverCategory, hoverTimeout]);

  const handleCategoryMouseEnter = (category, event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    // Calculate window boundaries
    const windowHeight = window.innerHeight;

    // Position for the popup
    let yPos = rect.top;

    // Check if popup would go beyond bottom of screen
    const estimatedPopupHeight = validSubCategories[category]?.length * 20 + 100; // Rough estimate
    if (yPos + estimatedPopupHeight > windowHeight) {
      // Adjust position to show popup above if it would go off screen
      yPos = Math.max(20, windowHeight - estimatedPopupHeight - 20);
    }

    setHoverPosition({
      x: rect.right,
      y: yPos
    });
    setHoverCategory(category);

    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleCategoryMouseLeave = () => {
    // Use timeout to prevent immediate closing when mouse briefly leaves
    const timeout = setTimeout(() => {
      setHoverCategory(null);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handlePopupMouseEnter = () => {
    // Clear timeout when mouse enters popup
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(''); // Reset subcategory when category changes
  };

  const handleSubCategoryClick = (subCategory) => {
    // First change the selected category to the hover category
    if (hoverCategory) {
      setSelectedCategory(hoverCategory);
    }

    // Then set the selected subcategory
    setSelectedSubCategory(subCategory);

    // Clear hover states
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    setHoverCategory(null);
  };

  return (
    <aside className={`w-full ${showFilters ? 'block' : 'hidden'} md:block relative`}>
      <div className="flex flex-col bg-gray-800 rounded-lg p-4 shadow-lg sticky top-20 overflow-hidden">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Filter size={18} className="mr-2 text-purple-400" />
            Filters
          </h2>
          <div className="bg-purple-600 text-xs font-medium px-2 py-1 rounded-full text-white">
            {Object.keys(categories).length} Categories
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) :
          (
            categories?.length === 0 ?
              <div className="flex flex-col justify-center items-center h-60 bg-gray-700/50 rounded-lg">
                <TriangleAlert size={36} className='text-purple-600 mb-6' />
                No Exercises Uploaded
              </div>
              :
              <>
                {/* Current Selection Display */}
                <div className="flex flex-wrap items-center gap-2 mb-4 px-2 py-3 bg-gray-700/50 rounded-lg">
                  <div className="flex-1 flex items-center">
                    <span className="text-sm font-medium text-purple-300">{selectedCategory}</span>
                    <ChevronRight size={14} className="mx-1 text-gray-500" />
                    <span className="text-sm font-medium text-gray-200">
                      {selectedSubCategory ? selectedSubCategory : 'All'}
                    </span>
                    <ChevronRight size={14} className="mx-1 text-gray-500" />
                    <span className="text-sm font-medium text-gray-200">{selectedPosition}</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-5">
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-2 px-1">Category</h3>
                  <div className="bg-gray-700/30 rounded-lg p-1.5">
                    <ul className="max-h-[250px] overflow-y-auto pr-1 space-y-1 scrollbar-thin">
                      {Object.keys(categories).map(category => (
                        <li key={category}>
                          <button
                            className={`w-full text-left py-2 px-3 rounded-md text-sm transition-colors ${selectedCategory === category
                              ? 'bg-purple-600 text-white font-medium'
                              : 'hover:bg-gray-700 text-gray-300'
                              }`}
                            onClick={() => handleCategoryClick(category)}
                            onMouseEnter={(e) => handleCategoryMouseEnter(category, e)}
                            onMouseLeave={handleCategoryMouseLeave}
                            ref={selectedCategory === category ? selectedCategoryRef : null}
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Selected Subcategory Display */}
                {selectedSubCategory && (
                  <div className="mb-5">
                    <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-2 px-1">Subcategory</h3>
                    <div className="bg-gray-700/30 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-purple-300">{selectedSubCategory}</span>
                        <button
                          onClick={() => setSelectedSubCategory('')}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Positions */}
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-2 px-1">Position</h3>
                  <div className="bg-gray-700/30 rounded-lg p-1.5">
                    <div className="grid grid-cols-2 gap-1.5">
                      {positions.map(position => (
                        <button
                          key={position}
                          onClick={() => setSelectedPosition(position)}
                          className={`text-left py-2 px-3 rounded-md text-sm transition-colors ${selectedPosition === position
                            ? 'bg-purple-600 text-white font-medium'
                            : 'hover:bg-gray-700 text-gray-300'
                            }`}
                        >
                          {position}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
          )}
      </div>

      {/* Subcategories Popup */}
      {hoverCategory && validSubCategories[hoverCategory] && (
        <div
          ref={popupRef}
          className="fixed bg-gray-900 shadow-xl rounded-lg p-2 z-50 w-64 overflow-y-auto max-h-96 border border-purple-500/30"
          style={{
            top: `${hoverPosition.y}px`,
            left: `${hoverPosition.x + 10}px`,
          }}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handleCategoryMouseLeave}
        >
          <div className="bg-gray-800 rounded-md p-2 mb-2 border-l-2 border-purple-500">
            <h3 className="text-sm font-bold text-purple-300">{hoverCategory}</h3>
          </div>
          <div className="grid grid-cols-2 gap-1 max-h-80 overflow-y-auto scrollbar-thin">
            <div className="col-span-2 mb-1">
              <button
                className="w-full text-left px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium"
                onClick={() => {
                  setSelectedCategory(hoverCategory);
                  setSelectedSubCategory('');
                  setHoverCategory(null);
                }}
              >
                All
              </button>
            </div>
            {validSubCategories[hoverCategory].map(subCategory => (
              <button
                key={subCategory}
                className={`text-left px-3 py-2 text-sm rounded-md text-gray-200 hover:text-white transition-colors ${selectedCategory === hoverCategory && selectedSubCategory === subCategory
                  ? 'bg-purple-600 hover:bg-purple-700 font-medium'
                  : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                onClick={() => handleSubCategoryClick(subCategory)}
              >
                {subCategory}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ExerciseSidebar;