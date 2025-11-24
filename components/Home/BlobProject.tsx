import React from 'react';
import { Project } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import DistortedImage from './DistortedImage';

interface BlobProjectProps {
  project: Project;
  direction: number; // -1 for prev, 1 for next
  index: number;
  onViewProject: () => void;
}

const BlobProject: React.FC<BlobProjectProps> = ({ project, direction, index, onViewProject }) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 lg:gap-24 max-w-6xl mx-auto">
      
      {/* Text Info - Left Side */}
      {/* We use a grid here so exiting and entering elements occupy the same space to prevent layout shift */}
      <div className="order-2 md:order-1 flex-1 grid grid-cols-1 items-center md:items-start text-center md:text-left z-10 w-full">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
             key={project._id}
             custom={direction}
             initial={{ opacity: 0, x: -50, filter: 'blur(8px)' }}
             animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
             exit={{ opacity: 0, x: 50, filter: 'blur(8px)' }}
             transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
             className="flex flex-col items-center md:items-start col-start-1 row-start-1 w-full"
          >
            <div className="flex items-baseline space-x-3 mb-4">
              <span className="text-water-400 font-sans text-lg font-medium">0{index + 1}</span>
              <span className="h-[1px] w-8 bg-slate-300"></span>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-sans font-medium">
                {project.tags.join(' & ')}
              </p>
            </div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-slate-900 mb-6 leading-[0.9] tracking-tight">
              {project.title}
            </h2>
            
            <p className="text-slate-500 font-light font-sans text-sm md:text-lg leading-relaxed max-w-md mb-8">
              {project.shortDescription}
            </p>

            <button 
              onClick={onViewProject}
              className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-slate-900 border-b border-transparent hover:border-water-500 transition-all pb-1 cursor-hover-trigger"
            >
              <span>View Project</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Blob - Right Side */}
      <div className="order-1 md:order-2 flex-1 flex justify-center items-center w-full">
        {/* 
            The Container holds the 'animate-blob' class. 
            This ensures the masking shape is continuous and doesn't reset on slide change.
        */}
        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] animate-blob overflow-hidden bg-water-50 shadow-2xl">
          
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
             <DistortedImage 
               key={project._id} 
               src={project.heroImage?.asset?.url || ''} 
               alt={project.heroImage?.alt || project.title} 
               direction={direction}
             />
          </AnimatePresence>

          {/* Subtle inner shadow for depth (overlay on top of images) */}
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none rounded-[inherit] z-20"></div>
        </div>
      </div>

    </div>
  );
};

export default BlobProject;