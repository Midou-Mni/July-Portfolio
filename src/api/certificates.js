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
  // Check if certificateData is FormData (has image file)
  const isFormData = certificateData instanceof FormData;
  
  const config = isFormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  } : {};
  
  const response = await api.post('/certificates', certificateData, config);
  return response.data;
};

export const updateCertificate = async (id, certificateData) => {
  // Check if certificateData is FormData (has image file)
  const isFormData = certificateData instanceof FormData;
  
  const config = isFormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  } : {};
  
  const response = await api.put(`/certificates/${id}`, certificateData, config);
  return response.data;
};

export const deleteCertificate = async (id) => {
  const response = await api.delete(`/certificates/${id}`);
  return response.data;
}; 