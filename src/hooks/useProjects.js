import { useState, useEffect } from 'react';
import { getProjects } from '../api/projects';

export const useProjects = (filters = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchProjects = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects({ ...filters, ...params });
      setProjects(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    fetchProjects();
  };

  return {
    projects,
    loading,
    error,
    pagination,
    refetch,
  };
}; 