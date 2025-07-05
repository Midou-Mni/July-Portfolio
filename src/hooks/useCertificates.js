import { useState, useEffect } from 'react';
import { getCertificates } from '../api/certificates';

export const useCertificates = (params = {}) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCertificates(params);
      setCertificates(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [JSON.stringify(params)]);

  return {
    certificates,
    loading,
    error,
    pagination,
    refetch: fetchCertificates
  };
}; 