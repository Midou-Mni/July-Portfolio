import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const CertificateCard = ({ certificate }) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const cardVariants = {
    initial: { 
      scale: 1,
      y: 20,
      opacity: 0
    },
    animate: { 
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: 0.2
      }
    },
    hover: { 
      scale: 1.1,
      transition: {
        duration: 0.2
      }
    }
  };

  const statusVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: 0.3
      }
    },
    hover: { 
      scale: 1.1,
      transition: {
        duration: 0.2
      }
    }
  };

  const contentVariants = {
    initial: { y: 0 },
    hover: { 
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const detailVariants = {
    initial: { opacity: 0, x: -10 },
    animate: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: 0.1 * i
      }
    })
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
    >
      {/* Certificate Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {certificate.imageUrl ? (
          <motion.img
            variants={imageVariants}
            src={certificate.imageUrl}
            alt={certificate.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.div 
            className="w-full h-full flex items-center justify-center"
            variants={imageVariants}
          >
            <div className="text-gray-400 dark:text-gray-500 text-4xl">
              🏆
            </div>
          </motion.div>
        )}
        
        {/* Featured Badge */}
        {certificate.featured && (
          <motion.div 
            className="absolute top-2 right-2"
            variants={badgeVariants}
          >
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {t('projects.featured')}
            </span>
          </motion.div>
        )}
        
        {/* Expiry Status */}
        {certificate.expiryDate && (
          <motion.div 
            className="absolute bottom-2 left-2"
            variants={statusVariants}
          >
            <span className={`text-xs px-2 py-1 rounded-full ${
              isExpired(certificate.expiryDate)
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {isExpired(certificate.expiryDate) ? t('certificates.expired') : t('certificates.valid')}
            </span>
          </motion.div>
        )}
      </div>

      {/* Certificate Details */}
      <motion.div 
        className="p-6"
        variants={contentVariants}
      >
        <motion.h3 
          className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {certificate.title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-400 text-sm mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {certificate.description}
        </motion.p>

        <div className="space-y-2 text-sm">
          <motion.div 
            className="flex justify-between"
            custom={0}
            variants={detailVariants}
          >
            <span className="text-gray-500 dark:text-gray-400">
              {t('certificates.issuedBy')}:
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {certificate.issuer}
            </span>
          </motion.div>
          
          <motion.div 
            className="flex justify-between"
            custom={1}
            variants={detailVariants}
          >
            <span className="text-gray-500 dark:text-gray-400">
              {t('certificates.issueDate')}:
            </span>
            <span className="text-gray-900 dark:text-white">
              {formatDate(certificate.issueDate)}
            </span>
          </motion.div>
          
          {certificate.expiryDate && (
            <motion.div 
              className="flex justify-between"
              custom={2}
              variants={detailVariants}
            >
              <span className="text-gray-500 dark:text-gray-400">
                {t('certificates.expiryDate')}:
              </span>
              <span className={`${
                isExpired(certificate.expiryDate)
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {formatDate(certificate.expiryDate)}
              </span>
            </motion.div>
          )}
          
          {certificate.credentialId && (
            <motion.div 
              className="flex justify-between"
              custom={3}
              variants={detailVariants}
            >
              <span className="text-gray-500 dark:text-gray-400">
                {t('certificates.credentialId')}:
              </span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">
                {certificate.credentialId}
              </span>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="mt-6 flex space-x-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {certificate.credentialUrl && (
            <motion.a
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-md transition-colors duration-200"
            >
              {t('certificates.viewCertificate')}
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CertificateCard; 