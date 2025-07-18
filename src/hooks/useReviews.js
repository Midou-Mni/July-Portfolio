import { useState, useEffect } from 'react';
import { reviewsApi } from '../api/reviews';

export const useReviews = (projectId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchReviews = async (params = {}) => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await reviewsApi.getReviewsByProject(projectId, params);
      setReviews(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [projectId]);

  const submitReview = async (reviewData) => {
    try {
      const response = await reviewsApi.createReview(reviewData);
      // Refresh reviews after submission
      await fetchReviews();
      return response;
    } catch (err) {
      throw err;
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await reviewsApi.deleteReview(reviewId);
      // Update local state to remove the deleted review
      setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
      return true;
    } catch (err) {
      console.error('Error deleting review:', err);
      throw err;
    }
  };

  const refetch = () => {
    fetchReviews();
  };

  return {
    reviews,
    loading,
    error,
    pagination,
    submitReview,
    deleteReview,
    refetch,
  };
}; 