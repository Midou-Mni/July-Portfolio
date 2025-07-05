import api from './index';

export const reviewsApi = {
  // Get reviews for a specific project
  getReviewsByProject: async (projectId, params = {}) => {
    const response = await api.get('/reviews', { 
      params: { projectId, ...params } 
    });
    return response.data;
  },

  // Submit a new review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Delete a review (admin only)
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
}; 