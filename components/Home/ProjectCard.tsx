import React, { useState } from 'react';
import { Project } from '../../types';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex-shrink-0 w-[85vw] md:w-[600px] lg:w-[700px] mr-6 md:mr-16 flex flex-col group cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-water-50">
        {/* Image Container with Water Effect */}
        <div 
            className="w-full h-full transition-all duration-1000 ease-out transform origin-center"
            style={{
                filter: isHovered ? 'url(#water-filter)' : 'none',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)'
            }}
        >
             <img
                src={project.heroImage?.asset?.url}
                alt={project.heroImage?.alt || project.title}
                className="w-full h-full object-cover"
                draggable={false}
            />
        </div>

        {/* Hover Overlay / Interaction Hint */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-full text-water-900 tracking-widest uppercase text-xs font-bold border border-white/50">
                Explore
            </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-baseline justify-between text-left">
        <h3 className="text-3xl md:text-5xl font-serif text-slate-900 italic transition-colors duration-300">
          <span className="text-water-400 mr-4 text-xl md:text-2xl font-sans not-italic font-normal opacity-50">0{index + 1}</span>
          {project.title}
        </h3>
        <p className="mt-2 md:mt-0 text-slate-500 font-sans uppercase tracking-widest text-xs font-medium">
          {project.tags.join(' / ')}
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectCard;