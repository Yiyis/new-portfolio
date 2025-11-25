import React from 'react';
import { Project } from '../../types';
import BlobProject from './BlobProject';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, useDragControls } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  projects: Project[];
  currentIndex: number;
  direction: number;
  onNext: () => void;
  onPrev: () => void;
  onIndexChange: (index: number, direction: number) => void;
  onViewProject: (project: Project) => void;
  showSplash: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ 
  projects, 
  currentIndex, 
  direction, 
  onNext, 
  onPrev, 
  onIndexChange,
  onViewProject,
  showSplash 
}) => {
  const handleViewProject = () => {
    const currentProject = projects[currentIndex];
    if (currentProject) {
      onViewProject(currentProject);
    }
  };

  const onDragEnd = (event: any, info: any) => {
    const threshold = 50; // Minimum drag distance to trigger change
    if (info.offset.x < -threshold) {
      onNext();
    } else if (info.offset.x > threshold) {
      onPrev();
    }
  };

  return (
    <motion.div 
      key="home"
      className="w-full h-full flex items-center justify-center max-w-7xl mx-auto px-4 md:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: showSplash ? 0 : 0.3 }}
      // Enable drag only on mobile (technically works on desktop too but less common for full page swipes)
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={onDragEnd}
      // Prevent drag from interfering with clicks if movement is small
      dragListener={true} 
    >
      {/* Previous Button */}
      <button 
        onClick={onPrev}
        className="hidden md:flex absolute left-4 lg:left-0 top-1/2 -translate-y-1/2 z-30 group items-center space-x-2 cursor-hover-trigger"
        aria-label="Previous Project"
      >
        <span className="w-12 h-[1px] bg-slate-300 group-hover:bg-water-500 transition-colors duration-300"></span>
        <span className="text-xs uppercase tracking-widest text-slate-400 group-hover:text-water-600 transition-colors duration-300">Prev</span>
      </button>

      {/* Central Blob Project View */}
      <div className="w-full px-4 md:px-16">
        <BlobProject 
          project={projects[currentIndex]} 
          index={currentIndex}
          direction={direction} 
          onViewProject={handleViewProject}
          onNext={onNext}
          onPrev={onPrev}
        />
      </div>

      {/* Next Button */}
      <button 
        onClick={onNext}
        className="hidden md:flex absolute right-4 lg:right-0 top-1/2 -translate-y-1/2 z-30 group items-center space-x-2 flex-row-reverse space-x-reverse cursor-hover-trigger"
        aria-label="Next Project"
      >
        <span className="w-12 h-[1px] bg-slate-300 group-hover:bg-water-500 transition-colors duration-300"></span>
        <span className="text-xs uppercase tracking-widest text-slate-400 group-hover:text-water-600 transition-colors duration-300">Next</span>
      </button>

      {/* Mobile Controls - Removed as they are now integrated into BlobProject */}
      
      {/* Progress Indicator */}
      <div className="absolute bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const newDirection = idx > currentIndex ? 1 : -1;
              onIndexChange(idx, newDirection);
            }}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-water-500' : 'w-2 bg-slate-200 hover:bg-water-300'
            }`}
            aria-label={`Go to project ${idx + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default HomePage;

