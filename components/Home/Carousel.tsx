import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types';
import ProjectCard from './ProjectCard';

interface CarouselProps {
  projects: Project[];
}

const Carousel: React.FC<CarouselProps> = ({ projects }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      // Calculate total scrollable width: total scroll width - visible width
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [projects]);

  return (
    <div className="w-full overflow-hidden py-12 md:py-20">
      <motion.div 
        ref={carouselRef} 
        className="flex px-6 md:px-12 lg:px-24 cursor-grab active:cursor-grabbing"
        drag="x" 
        dragConstraints={{ right: 0, left: -width }}
        whileTap={{ cursor: "grabbing" }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={project._id} project={project} index={index} />
        ))}
        
        {/* End spacer to allow scrolling past the last item slightly */}
        <div className="w-[10vw] flex-shrink-0" />
      </motion.div>
      
      {/* Simple Progress Line */}
      <div className="w-full max-w-[90vw] mx-auto h-[1px] bg-slate-200 mt-12 md:mt-20 overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-water-400"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ width: '20%' }} // Static indicator for aesthetics, could be dynamic with useTransform
          />
      </div>
    </div>
  );
};

export default Carousel;