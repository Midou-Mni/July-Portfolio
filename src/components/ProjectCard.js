import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProjectCard = ({ project }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

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
      scale: 1.15,
      transition: {
        duration: 0.4,
        ease: "easeOut"
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

  const techTagVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: (i) => ({
      scale: 1,
      opacity: 1,
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          variants={imageVariants}
          src={project.imageUrl || 'https://via.placeholder.com/400x300?text=Project+Image'}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
        
        {/* Featured Badge */}
        {project.featured && (
          <motion.div 
            className="absolute top-4 left-4"
            variants={badgeVariants}
          >
            <span className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              {t('projects.featured')}
            </span>
          </motion.div>
        )}
        
        {/* Rating */}
        {project.averageRating && (
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-1 flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {parseFloat(project.averageRating).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <motion.div
        variants={contentVariants}
        className="p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies?.slice(0, 3).map((tech, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={techTagVariants}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors duration-200"
              >
                {tech}
              </motion.span>
            ))}
            {project.technologies?.length > 3 && (
              <motion.span 
                className="text-xs text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                +{project.technologies.length - 3} more
              </motion.span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="flex space-x-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Link to={`/projects/${project._id}`}>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="btn-primary text-sm px-4 py-2"
            >
              {t('projects.viewProject')}
            </motion.button>
          </Link>
          
          {project.liveUrl && (
            <motion.a
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm px-4 py-2"
            >
              {t('projects.liveDemo')}
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard; 