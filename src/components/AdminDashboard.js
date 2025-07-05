import React, { useState } from 'react';
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
  const [certificateFormData, setCertificateFormData] = useState({
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
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    imageUrl: '',
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
      if (editingCertificate) {
        await updateCertificate(editingCertificate._id, certificateFormData);
      } else {
        await createCertificate(certificateFormData);
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
      if (editingProject) {
        await updateProject(editingProject._id, projectFormData);
      } else {
        await createProject(projectFormData);
      }
      setShowForm(false);
      setEditingProject(null);
      setProjectFormData({
        title: '',
        description: '',
        technologies: [],
        imageUrl: '',
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                                                  value={certificateFormData.imageUrl}
                          onChange={handleCertificateInputChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Image URL
                        </label>
                        <input
                          type="url"
                          name="imageUrl"
                          value={projectFormData.imageUrl}
                          onChange={handleProjectInputChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
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