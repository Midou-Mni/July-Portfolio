import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useCertificates } from '../hooks/useCertificates';
import { useProjects } from '../hooks/useProjects';
import { createCertificate, updateCertificate, deleteCertificate } from '../api/certificates';
import { createProject, updateProject, deleteProject } from '../api/projects';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { certificates, refetch: refetchCertificates } = useCertificates();
  const { projects, refetch: refetchProjects } = useProjects();
  const [activeTab, setActiveTab] = useState('certificates');
  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isDraggingProject, setIsDraggingProject] = useState(false);
  const [isDraggingCertificate, setIsDraggingCertificate] = useState(false);
  const projectFileInputRef = useRef(null);
  const certificateFileInputRef = useRef(null);
  const [certificateFormData, setCertificateFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    imageUrl: '',
    imageFile: null,
    description: '',
    featured: false,
    order: 0
  });
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    imageUrl: '',
    imageFile: null,
    liveUrl: '',
    githubUrl: '',
    featured: false,
    order: 0
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const handleCertificateInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCertificateFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProjectInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Certificate image handling
  const handleCertificateImageDrop = (e) => {
    e.preventDefault();
    setIsDraggingCertificate(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleCertificateImageFile(file);
    }
  };

  const handleCertificateImageDragOver = (e) => {
    e.preventDefault();
    setIsDraggingCertificate(true);
  };

  const handleCertificateImageDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingCertificate(false);
  };

  const handleCertificateImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleCertificateImageFile(file);
    }
  };

  const handleCertificateImageFile = (file) => {
    // Create a preview URL for the image
    const imageUrl = URL.createObjectURL(file);
    
    setCertificateFormData(prev => ({
      ...prev,
      imageUrl,
      imageFile: file
    }));
  };

  // Project image handling
  const handleProjectImageDrop = (e) => {
    e.preventDefault();
    setIsDraggingProject(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleProjectImageFile(file);
    }
  };

  const handleProjectImageDragOver = (e) => {
    e.preventDefault();
    setIsDraggingProject(true);
  };

  const handleProjectImageDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingProject(false);
  };

  const handleProjectImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleProjectImageFile(file);
    }
  };

  const handleProjectImageFile = (file) => {
    // Create a preview URL for the image
    const imageUrl = URL.createObjectURL(file);
    
    setProjectFormData(prev => ({
      ...prev,
      imageUrl,
      imageFile: file
    }));
  };

  const handleTechnologiesChange = (e) => {
    const technologies = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech);
    setProjectFormData(prev => ({
      ...prev,
      technologies
    }));
  };

  const handleCertificateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create form data for file upload
      const formData = new FormData();
      
      // Add all certificate data to formData
      Object.keys(certificateFormData).forEach(key => {
        if (key !== 'imageFile') {
          // Add other fields except imageFile
          formData.append(key, certificateFormData[key]);
        }
      });
      
      // Add image file if it exists
      if (certificateFormData.imageFile) {
        formData.append('image', certificateFormData.imageFile);
      }

      if (editingCertificate) {
        await updateCertificate(editingCertificate._id, formData);
      } else {
        await createCertificate(formData);
      }
      
      setShowForm(false);
      setEditingCertificate(null);
      setCertificateFormData({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        imageUrl: '',
        imageFile: null,
        description: '',
        featured: false,
        order: 0
      });
      refetchCertificates();
    } catch (error) {
      console.error('Error saving certificate:', error);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create form data for file upload
      const formData = new FormData();
      
      // Add all project data to formData
      Object.keys(projectFormData).forEach(key => {
        if (key === 'technologies' && Array.isArray(projectFormData[key])) {
          // Handle technologies array
          projectFormData[key].forEach((tech, index) => {
            formData.append(`technologies[${index}]`, tech);
          });
        } else if (key !== 'imageFile') {
          // Add other fields except imageFile
          formData.append(key, projectFormData[key]);
        }
      });
      
      // Add image file if it exists
      if (projectFormData.imageFile) {
        formData.append('image', projectFormData.imageFile);
      }

      if (editingProject) {
        await updateProject(editingProject._id, formData);
      } else {
        await createProject(formData);
      }
      
      setShowForm(false);
      setEditingProject(null);
      setProjectFormData({
        title: '',
        description: '',
        technologies: [],
        imageUrl: '',
        imageFile: null,
        liveUrl: '',
        githubUrl: '',
        featured: false,
        order: 0
      });
      refetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleCertificateEdit = (certificate) => {
    setEditingCertificate(certificate);
    setCertificateFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate?.split('T')[0] || '',
      expiryDate: certificate.expiryDate?.split('T')[0] || '',
      credentialId: certificate.credentialId || '',
      credentialUrl: certificate.credentialUrl || '',
      imageUrl: certificate.imageUrl || '',
      imageFile: null,
      description: certificate.description || '',
      featured: certificate.featured || false,
      order: certificate.order || 0
    });
    setShowForm(true);
  };

  const handleProjectEdit = (project) => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      description: project.description || '',
      technologies: project.technologies || [],
      imageUrl: project.imageUrl || '',
      imageFile: null,
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured || false,
      order: project.order || 0
    });
    setShowForm(true);
  };

  const handleCertificateDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await deleteCertificate(id);
        refetchCertificates();
      } catch (error) {
        console.error('Error deleting certificate:', error);
      }
    }
  };

  const handleProjectDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        refetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Welcome back, {user?.name}! Manage your portfolio content here.
          </p>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('certificates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'certificates'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Certificates
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Projects
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'certificates' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Manage Certificates
                </h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Add Certificate
                </button>
              </div>

              {/* Certificate Form */}
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
                  </h3>
                  <form onSubmit={handleCertificateSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={certificateFormData.title}
                          onChange={handleCertificateInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Issuer
                        </label>
                        <input
                          type="text"
                          name="issuer"
                          value={certificateFormData.issuer}
                          onChange={handleCertificateInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Issue Date
                        </label>
                        <input
                          type="date"
                          name="issueDate"
                          value={certificateFormData.issueDate}
                          onChange={handleCertificateInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          name="expiryDate"
                          value={certificateFormData.expiryDate}
                          onChange={handleCertificateInputChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Credential ID
                        </label>
                        <input
                          type="text"
                          name="credentialId"
                          value={certificateFormData.credentialId}
                          onChange={handleCertificateInputChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Order
                        </label>
                        <input
                          type="number"
                          name="order"
                          value={certificateFormData.order}
                          onChange={handleCertificateInputChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Credential URL
                      </label>
                      <input
                        type="url"
                        name="credentialUrl"
                                                  value={certificateFormData.credentialUrl}
                          onChange={handleCertificateInputChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Certificate Image
                      </label>
                      <div 
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                          isDraggingCertificate 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        onDrop={handleCertificateImageDrop}
                        onDragOver={handleCertificateImageDragOver}
                        onDragLeave={handleCertificateImageDragLeave}
                      >
                        <div className="space-y-1 text-center">
                          {certificateFormData.imageUrl ? (
                            <div className="relative">
                              <img 
                                src={certificateFormData.imageUrl} 
                                alt="Certificate preview" 
                                className="mx-auto h-32 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => setCertificateFormData(prev => ({ ...prev, imageUrl: '', imageFile: null }))}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="certificate-file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none">
                                  <span>Upload a file</span>
                                  <input 
                                    id="certificate-file-upload" 
                                    name="certificate-file-upload" 
                                    type="file" 
                                    className="sr-only" 
                                    accept="image/*"
                                    ref={certificateFileInputRef}
                                    onChange={handleCertificateImageFileSelect}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Image URL (alternative to upload)
                        </label>
                        <input
                          type="url"
                          name="imageUrl"
                          value={certificateFormData.imageUrl}
                          onChange={handleCertificateInputChange}
                          placeholder="https://example.com/image.jpg"
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        name="description"
                                                  value={certificateFormData.description}
                          onChange={handleCertificateInputChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={certificateFormData.featured}
                        onChange={handleCertificateInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                        Featured Certificate
                      </label>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                      >
                        {editingCertificate ? 'Update' : 'Create'} Certificate
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingCertificate(null);
                                                  setCertificateFormData({
                          title: '',
                          issuer: '',
                          issueDate: '',
                          expiryDate: '',
                          credentialId: '',
                          credentialUrl: '',
                          imageUrl: '',
                          description: '',
                          featured: false,
                          order: 0
                        });
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Certificates List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Certificate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Issuer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {certificates.map((certificate) => (
                        <tr key={certificate._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {certificate.imageUrl ? (
                                  <img
                                    className="h-10 w-10 rounded-lg object-cover"
                                    src={certificate.imageUrl}
                                    alt={certificate.title}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <span className="text-gray-500 dark:text-gray-400">🏆</span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {certificate.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {certificate.credentialId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {certificate.issuer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              certificate.featured
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {certificate.featured ? 'Featured' : 'Standard'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleCertificateEdit(certificate)}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCertificateDelete(certificate._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Manage Projects
                </h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Add Project
                </button>
              </div>

              {/* Project Form */}
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={projectFormData.title}
                          onChange={handleProjectInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Order
                        </label>
                        <input
                          type="number"
                          name="order"
                          value={projectFormData.order}
                          onChange={handleProjectInputChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={projectFormData.description}
                        onChange={handleProjectInputChange}
                        rows={3}
                        required
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Technologies (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="technologies"
                        value={projectFormData.technologies.join(', ')}
                        onChange={handleTechnologiesChange}
                        placeholder="React, Node.js, MongoDB"
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Project Image
                        </label>
                        <div 
                          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                            isDraggingProject 
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          onDrop={handleProjectImageDrop}
                          onDragOver={handleProjectImageDragOver}
                          onDragLeave={handleProjectImageDragLeave}
                        >
                          <div className="space-y-1 text-center">
                            {projectFormData.imageUrl ? (
                              <div className="relative">
                                <img 
                                  src={projectFormData.imageUrl} 
                                  alt="Project preview" 
                                  className="mx-auto h-32 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() => setProjectFormData(prev => ({ ...prev, imageUrl: '', imageFile: null }))}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <>
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                  <label htmlFor="project-file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input 
                                      id="project-file-upload" 
                                      name="project-file-upload" 
                                      type="file" 
                                      className="sr-only" 
                                      accept="image/*"
                                      ref={projectFileInputRef}
                                      onChange={handleProjectImageFileSelect}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Image URL (alternative to upload)
                          </label>
                          <input
                            type="url"
                            name="imageUrl"
                            value={projectFormData.imageUrl}
                            onChange={handleProjectInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Live URL
                        </label>
                        <input
                          type="url"
                          name="liveUrl"
                          value={projectFormData.liveUrl}
                          onChange={handleProjectInputChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          name="githubUrl"
                          value={projectFormData.githubUrl}
                          onChange={handleProjectInputChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={projectFormData.featured}
                        onChange={handleProjectInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                        Featured Project
                      </label>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                      >
                        {editingProject ? 'Update' : 'Create'} Project
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingProject(null);
                          setProjectFormData({
                            title: '',
                            description: '',
                            technologies: [],
                            imageUrl: '',
                            imageFile: null,
                            liveUrl: '',
                            githubUrl: '',
                            featured: false,
                            order: 0
                          });
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Projects List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Technologies
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {projects.map((project) => (
                        <tr key={project._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {project.imageUrl ? (
                                  <img
                                    className="h-10 w-10 rounded-lg object-cover"
                                    src={project.imageUrl}
                                    alt={project.title}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <span className="text-gray-500 dark:text-gray-400">💻</span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {project.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {project.description?.substring(0, 50)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {project.technologies?.slice(0, 3).map((tech, index) => (
                                <span
                                  key={index}
                                  className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.technologies?.length > 3 && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                                  +{project.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              project.featured
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {project.featured ? 'Featured' : 'Standard'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleProjectEdit(project)}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleProjectDelete(project._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard; 