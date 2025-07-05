import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroScene from '../components/3d/HeroScene';
import HeroSceneFallback from '../components/3d/HeroSceneFallback';
import ProjectsBackground from '../components/3d/ProjectsBackground';
import ProjectsBackgroundFallback from '../components/3d/ProjectsBackgroundFallback';
import CertificatesBackground from '../components/3d/CertificatesBackground';
import CertificatesBackgroundFallback from '../components/3d/CertificatesBackgroundFallback';
import ProjectCard from '../components/ProjectCard';
import CertificateCard from '../components/CertificateCard';
import { useProjects } from '../hooks/useProjects';
import { useCertificates } from '../hooks/useCertificates';

const Home = () => {
  const { t } = useTranslation();
  const { projects, loading: projectsLoading } = useProjects({ featured: true, limit: 3 });
  const { certificates, loading: certificatesLoading } = useCertificates({ featured: true, limit: 3 });
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setUseFallback(true);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          {useFallback ? <HeroSceneFallback /> : <HeroScene />}
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {t('hero.title')}{' '}
              <span className="text-primary-600 dark:text-primary-400">
                {t('hero.name')}
              </span>
            </motion.h1>
            
            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-6"
            >
              {t('hero.subtitle')}
            </motion.h2>
            
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              {t('hero.description')}
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-3"
                >
                  {t('hero.cta')}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-600 dark:text-gray-400 text-sm"
          >
            {t('hero.scroll')}
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full mx-auto mt-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mx-auto mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          {useFallback ? <ProjectsBackgroundFallback /> : <ProjectsBackground />}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('projects.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {projectsLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-8 py-3"
              >
                {t('projects.viewAll')}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Certificates Section */}
      <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          {useFallback ? <CertificatesBackgroundFallback /> : <CertificatesBackground />}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('certificates.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('certificates.subtitle')}
            </p>
          </motion.div>

          {certificatesLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((certificate, index) => (
                <motion.div
                  key={certificate._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CertificateCard certificate={certificate} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/certificates">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-8 py-3"
              >
                {t('certificates.viewAll')}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 