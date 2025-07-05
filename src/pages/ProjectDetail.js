import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getProjectById } from '../api/projects';
import { useReviews } from '../hooks/useReviews';
import ReviewModal from '../components/ReviewModal';
import StarRating from '../components/ui/StarRating';

const ProjectDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const { reviews, loading: reviewsLoading, submitReview } = useReviews(id);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProjectById(id);
        setProject(response.data);
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
            {/* Project Image */}
            <div className="relative">
              <img
                src={project.imageUrl || 'https://via.placeholder.com/600x400?text=Project+Image'}
                alt={project.title}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              {project.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {t('projects.featured')}
                  </span>
                </div>
              )}
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
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
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
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
          projectId={id}
        />
      )}
    </div>
  );
};

export default ProjectDetail; 