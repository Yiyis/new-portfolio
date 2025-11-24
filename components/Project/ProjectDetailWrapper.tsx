import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../../services/sanityService';
import { Project } from '../../types';
import ProjectDetail from './ProjectDetail';
import { motion } from 'framer-motion';

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

      // Check password protection if callback provided
      if (onPasswordCheck && !onPasswordCheck(slug)) {
        // Password check failed, redirect to home
        // The password modal should be shown by App.tsx when navigating
        navigate('/');
        setLoading(false);
        return;
      }

      try {
        const projectData = await getProject(slug);
        if (projectData) {
          setProject(projectData);
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
  }, [slug, onPasswordCheck]);

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-slate-100 border-t-water-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <motion.div 
        className="w-full h-full flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-serif italic mb-4 text-slate-900">Project not found</h2>
        <button 
          onClick={handleBack}
          className="text-water-600 hover:text-water-700 transition-colors"
        >
          Back to Work
        </button>
      </motion.div>
    );
  }

  return <ProjectDetail project={project} onBack={handleBack} />;
};

export default ProjectDetailWrapper;

