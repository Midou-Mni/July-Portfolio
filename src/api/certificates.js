import api from './index';

export const getCertificates = async (params = {}) => {
  const response = await api.get('/certificates', { params });
  return response.data;
};

export const getCertificateById = async (id) => {
  const response = await api.get(`/certificates/${id}`);
  return response.data;
};

export const createCertificate = async (certificateData) => {
  const response = await api.post('/certificates', certificateData);
  return response.data;
};

export const updateCertificate = async (id, certificateData) => {
  const response = await api.put(`/certificates/${id}`, certificateData);
  return response.data;
};

export const deleteCertificate = async (id) => {
  const response = await api.delete(`/certificates/${id}`);
  return response.data;
}; 