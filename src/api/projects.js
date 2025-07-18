import api from './index';

export const getProjects = async (params = {}) => {
  const response = await api.get('/projects', { params });
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  // Check if projectData is FormData (has image file)
  const isFormData = projectData instanceof FormData;
  
  const config = isFormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  } : {};
  
  const response = await api.post('/projects', projectData, config);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  // Check if projectData is FormData (has image file)
  const isFormData = projectData instanceof FormData;
  
  const config = isFormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  } : {};
  
  const response = await api.put(`/projects/${id}`, projectData, config);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const addProjectImages = async (id, imageFiles) => {
  const formData = new FormData();
  
  // Add all image files to the form data
  if (Array.isArray(imageFiles)) {
    imageFiles.forEach((file, index) => {
      formData.append('additionalImages', file);
    });
  } else {
    formData.append('additionalImages', imageFiles);
  }
  
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  
  const response = await api.post(`/projects/${id}/images`, formData, config);
  return response.data;
};

export const removeProjectImage = async (projectId, imageIndex) => {
  const response = await api.delete(`/projects/${projectId}/images/${imageIndex}`);
  return response.data;
};

export const reorderProjectImages = async (projectId, imageOrder) => {
  const response = await api.put(`/projects/${projectId}/images/reorder`, { imageOrder });
  return response.data;
}; 