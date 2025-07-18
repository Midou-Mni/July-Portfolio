/**
 * Utility functions for handling image URLs
 */

/**
 * Fixes image URLs to ensure they use the correct port (4000)
 * @param {string} url - The original image URL
 * @returns {string} - The fixed image URL
 */
export const fixImageUrl = (url) => {
  if (!url) return '';
  
  // Fix for port mismatch (5000 vs 4000)
  if (url.includes('localhost:5000')) {
    return url.replace('localhost:5000', 'localhost:4000');
  }
  
  return url;
};

/**
 * Gets a placeholder image URL if the original URL is not available
 * @param {string} type - The type of placeholder ('project' or 'certificate')
 * @returns {string} - The placeholder image URL
 */
export const getPlaceholderImage = (type) => {
  switch (type) {
    case 'certificate':
      return 'https://via.placeholder.com/400x300?text=Certificate';
    case 'project':
    default:
      return 'https://via.placeholder.com/400x300?text=Project+Image';
  }
}; 