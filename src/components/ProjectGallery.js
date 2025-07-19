import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize } from 'react-icons/fi';

const ProjectGallery = ({ images, isAdmin, onReorder, onRemove }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const galleryRef = useRef(null);

  // Handle navigation
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Fullscreen functionality
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await galleryRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle drag and drop for reordering
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    
    onReorder(newImages);
    setDraggedIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFullscreen) {
        if (e.key === 'Escape') {
          // Let the fullscreen API handle escape key
        } else if (e.key === 'ArrowLeft') {
          goToPrev();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        } else if (e.key === 'f' || e.key === 'F') {
          toggleFullscreen();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentIndex]);

  return (
    <div 
      ref={galleryRef}
      className={`relative ${isFullscreen ? 'w-full h-full bg-black flex flex-col justify-center' : ''}`}
    >
      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className={`absolute z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all ${
          isFullscreen ? 'top-4 right-4' : 'top-2 right-2'
        }`}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
      >
        {isFullscreen ? <FiMinimize size={24} /> : <FiMaximize size={24} />}
      </button>
      
      {/* Main image display */}
      <div className={`relative overflow-hidden rounded-xl ${
        isFullscreen ? 'w-full h-[calc(100vh-120px)]' : 'w-full h-96 md:h-[500px]'
      }`}>
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={images[currentIndex]}
              alt={`Project image ${currentIndex + 1}`}
              className={`${isFullscreen ? 'object-contain' : 'object-contain'} w-full h-full`}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className={`absolute top-1/2 -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all ${
                isFullscreen ? 'left-8' : 'left-4'
              }`}
              aria-label="Previous image"
            >
              <FiChevronLeft size={28} />
            </button>
            <button
              onClick={goToNext}
              className={`absolute top-1/2 -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all ${
                isFullscreen ? 'right-8' : 'right-4'
              }`}
              aria-label="Next image"
            >
              <FiChevronRight size={28} />
            </button>
          </>
        )}
        
        {/* Image counter */}
        <div className={`absolute px-3 py-1 bg-black bg-opacity-50 text-white text-sm rounded-full z-10 ${
          isFullscreen ? 'bottom-8 left-1/2 -translate-x-1/2' : 'bottom-4 left-1/2 -translate-x-1/2'
        }`}>
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnail strip - hidden in fullscreen mode */}
      {!isFullscreen && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Gallery</h3>
            {isAdmin && images.length > 1 && (
              <button
                onClick={() => setIsReordering(!isReordering)}
                className={`text-sm px-3 py-1 rounded ${
                  isReordering 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {isReordering ? 'Done Reordering' : 'Reorder Images'}
              </button>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <motion.div
                key={index}
                layout
                draggable={isReordering}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                whileHover={{ scale: isReordering ? 1.05 : 1.02 }}
                whileTap={isReordering ? { scale: 0.95 } : {}}
                onClick={() => !isReordering && setCurrentIndex(index)}
                className={`relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === index 
                    ? 'border-blue-500 opacity-100 scale-105' 
                    : 'border-transparent opacity-80 hover:opacity-100'
                } ${isReordering ? 'cursor-grab active:cursor-grabbing' : ''}`}
                style={{
                  width: '80px',
                  height: '60px',
                  boxShadow: isReordering && draggedIndex === index ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Admin controls */}
                {isAdmin && (
                  <>
                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(index);
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                      style={{ width: '20px', height: '20px' }}
                    >
                      <FiX size={12} />
                    </button>
                    
                    {/* Position indicator */}
                    <div className="absolute bottom-1 left-1 px-1 bg-black bg-opacity-70 text-white text-xs rounded">
                      {index + 1}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;
