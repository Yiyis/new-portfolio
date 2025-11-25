import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../../services/sanityService';
import { Project } from '../../types';
import ProjectDetail from './ProjectDetail';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectDetailWrapperProps {
  onPasswordCheck?: (slug: string) => boolean;
}

const ProjectDetailWrapper: React.FC<ProjectDetailWrapperProps> = ({ onPasswordCheck }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      setLoading(true); // Ensure loading state is set on slug change

      // Check password protection if callback provided
      if (onPasswordCheck && !onPasswordCheck(slug)) {
        // Password check failed, redirect to home
        navigate('/');
        setLoading(false);
        return;
      }

      try {
        const projectData = await getProject(slug);
        if (projectData) {
          setProject(projectData);
          setError(null);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug, onPasswordCheck, navigate]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loader"
          className="w-full h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 border-2 border-slate-100 border-t-water-500 rounded-full animate-spin"></div>
        </motion.div>
      ) : error || !project ? (
        <motion.div 
          key="error"
          className="w-full h-full flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h2 className="text-2xl font-serif italic mb-4 text-slate-900">{error || 'Project not found'}</h2>
          <button 
            onClick={handleBack}
            className="text-water-600 hover:text-water-700 transition-colors"
          >
            Back to Work
          </button>
        </motion.div>
      ) : (
        <ProjectDetail key={project._id} project={project} onBack={handleBack} />
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailWrapper;

