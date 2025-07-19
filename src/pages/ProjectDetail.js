import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProjectById, addProjectImages, removeProjectImage, reorderProjectImages } from '../api/projects';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../contexts/AuthContext';
import ReviewModal from '../components/ReviewModal';
import StarRating from '../components/ui/StarRating';
import DragDropImageUpload from '../components/ui/DragDropImageUpload';
import { fixImageUrl, getPlaceholderImage } from '../utils/imageUtils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProjectGallery from '../components/ProjectGallery';

const ProjectDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, reviewId: null });
  const [uploadStatus, setUploadStatus] = useState({ loading: false, error: null, success: false });
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderStatus, setReorderStatus] = useState({ loading: false, error: null, success: false });
  
  const { reviews, loading: reviewsLoading, submitReview, deleteReview } = useReviews(id);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProjectById(id);
        setProject(response.data);
        
        // Process main image URL
        if (response.data && response.data.imageUrl) {
          console.log(`Project detail image URL (${response.data.title}):`, response.data.imageUrl);
          const mainImg = fixImageUrl(response.data.imageUrl);
          setMainImageUrl(mainImg);
        }
        
        // Process additional images
        if (response.data && response.data.additionalImages && response.data.additionalImages.length > 0) {
          const fixedAdditionalImages = response.data.additionalImages.map(img => fixImageUrl(img));
          setAdditionalImages(fixedAdditionalImages);
          console.log('Additional images:', fixedAdditionalImages);
        } else if (response.data && response.data.allImages && response.data.allImages.length > 0) {
          const fixedAllImages = response.data.allImages.map(img => fixImageUrl(img));
          setAdditionalImages(fixedAllImages.slice(1)); // Skip the main image
          console.log('All images:', fixedAllImages);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      await submitReview({ ...reviewData, project: id });
      setShowReviewModal(false);
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setDeleteConfirmation({ show: false, reviewId: null });
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    console.log(`Image error for project detail: ${project?.title}`);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleImageUpload = async (files) => {
    setUploadStatus({ loading: true, error: null, success: false });
    
    try {
      await addProjectImages(id, files);
      
      // Refresh project data to get updated images
      const response = await getProjectById(id);
      setProject(response.data);
      
      // Update additional images
      if (response.data && response.data.additionalImages && response.data.additionalImages.length > 0) {
        const fixedAdditionalImages = response.data.additionalImages.map(img => fixImageUrl(img));
        setAdditionalImages(fixedAdditionalImages);
      } else if (response.data && response.data.allImages && response.data.allImages.length > 0) {
        const fixedAllImages = response.data.allImages.map(img => fixImageUrl(img));
        setAdditionalImages(fixedAllImages.slice(1)); // Skip the main image
      }
      
      setUploadStatus({ loading: false, error: null, success: true });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, success: false }));
        setShowImageUploader(false);
      }, 3000);
    } catch (err) {
      console.error('Error uploading images:', err);
      setUploadStatus({ loading: false, error: err.message || 'Failed to upload images', success: false });
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      // The index in the additionalImages array is offset by 1 since the main image is at index 0
      // but not included in additionalImages array
      await removeProjectImage(id, index);
      
      // Refresh project data
      const response = await getProjectById(id);
      setProject(response.data);
      
      // Update additional images
      if (response.data && response.data.additionalImages && response.data.additionalImages.length > 0) {
        const fixedAdditionalImages = response.data.additionalImages.map(img => fixImageUrl(img));
        setAdditionalImages(fixedAdditionalImages);
      } else if (response.data && response.data.allImages && response.data.allImages.length > 0) {
        const fixedAllImages = response.data.allImages.map(img => fixImageUrl(img));
        setAdditionalImages(fixedAllImages.slice(1)); // Skip the main image
      }
      
      // Reset selected index if needed
      if (selectedImageIndex > additionalImages.length) {
        setSelectedImageIndex(0);
      }
    } catch (err) {
      console.error('Error removing image:', err);
    }
  };
  
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    // Don't allow reordering if the main image (index 0) is involved
    if (result.source.index === 0 || result.destination.index === 0) {
      return;
    }
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    setReorderStatus({ loading: true, error: null, success: false });
    
    try {
      // Create a new order array (we need to offset by 1 since the main image is at index 0)
      // but not included in the additionalImages array on the backend
      const newOrder = Array.from({ length: additionalImages.length }, (_, i) => i + 1);
      
      // Adjust the order based on the drag result
      const [removed] = newOrder.splice(sourceIndex - 1, 1);
      newOrder.splice(destinationIndex - 1, 0, removed);
      
      // Update the UI immediately for a smoother experience
      const reorderedImages = Array.from(additionalImages);
      const [removedImage] = reorderedImages.splice(sourceIndex - 1, 1);
      reorderedImages.splice(destinationIndex - 1, 0, removedImage);
      setAdditionalImages(reorderedImages);
      
      // Call the API to update the order in the backend
      await reorderProjectImages(id, newOrder);
      
      setReorderStatus({ loading: false, error: null, success: true });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setReorderStatus(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      console.error('Error reordering images:', err);
      setReorderStatus({ loading: false, error: err.message || 'Failed to reorder images', success: false });
      
      // Refresh project data to reset to the original order
      try {
        const response = await getProjectById(id);
        if (response.data && response.data.additionalImages && response.data.additionalImages.length > 0) {
          const fixedAdditionalImages = response.data.additionalImages.map(img => fixImageUrl(img));
          setAdditionalImages(fixedAdditionalImages);
        } else if (response.data && response.data.allImages && response.data.allImages.length > 0) {
          const fixedAllImages = response.data.allImages.map(img => fixImageUrl(img));
          setAdditionalImages(fixedAllImages.slice(1)); // Skip the main image
        }
      } catch (refreshErr) {
        console.error('Error refreshing project data:', refreshErr);
      }
    }
  };

  // Get the current displayed image URL
  const currentImageUrl = selectedImageIndex === 0 
    ? mainImageUrl 
    : additionalImages[selectedImageIndex - 1];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'Project not found'}
          </p>
          <Link to="/projects" className="btn-primary">
            {t('projectDetail.backToProjects')}
          </Link>
        </div>
      </div>
    );
  }

  // Prepare all images for the gallery
  const allImages = [mainImageUrl, ...additionalImages].filter(Boolean);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('projectDetail.backToProjects')}
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Project Image Gallery */}
            <div className="space-y-4">
              <ProjectGallery
                images={allImages}
                isAdmin={isAdmin}
                onReorder={(newImages) => {
                  // Reorder handler: update additionalImages and call backend if needed
                  setAdditionalImages(newImages.slice(1));
                  // Optionally, call reorderProjectImages API here if you want instant sync
                }}
                onRemove={(index) => {
                  // Remove handler: remove image at index (excluding main image)
                  if (index === 0) return; // Prevent removing main image
                  handleRemoveImage(index - 1);
                }}
              />
            </div>

            {/* Project Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {project.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Rating */}
              {project.averageRating && (
                <div className="flex items-center space-x-2">
                  <StarRating rating={parseFloat(project.averageRating)} />
                  <span className="text-gray-600 dark:text-gray-400">
                    {parseFloat(project.averageRating).toFixed(1)} ({project.reviewsCount} {t('projectDetail.reviewsCount')})
                  </span>
                </div>
              )}

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('projectDetail.technologies')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {project.liveUrl && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-center"
                  >
                    {t('projectDetail.liveDemo')}
                  </motion.a>
                )}
                
                {project.githubUrl && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-center"
                  >
                    {t('projectDetail.sourceCode')}
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

                


        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('projectDetail.reviews')}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReviewModal(true)}
              className="btn-primary"
            >
              {t('review.title')}
            </motion.button>
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {t('projectDetail.noReviews')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="card p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {review.name || 'Anonymous'}
                      </h4>
                      <StarRating rating={review.rating} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => setDeleteConfirmation({ show: true, reviewId: review._id })}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          title="Delete review"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation({ show: false, reviewId: null })}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteReview(deleteConfirmation.reviewId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail; 
