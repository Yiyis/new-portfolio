import React from 'react';
import { Project } from '../../types';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  return (
    <motion.div 
      className="w-full h-full bg-[#fcfcfc] overflow-y-auto no-scrollbar relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <button 
            onClick={onBack}
            className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-water-600 transition-colors mb-12 cursor-hover-trigger"
        >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Work</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20">
            <div>
                <motion.h1 
                    className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-slate-900 mb-8 leading-[0.9] tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {project.title}
                </motion.h1>
                <motion.div 
                    className="flex flex-wrap gap-2 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {project.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase tracking-widest font-medium rounded-full">
                            {tag}
                        </span>
                    ))}
                </motion.div>
                <motion.p 
                    className="text-lg md:text-xl text-slate-600 font-light leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {project.shortDescription}
                </motion.p>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-square bg-water-50 overflow-hidden rounded-lg">
                 {/* In a real scenario, this might use the distorted image or a high-res static one */}
                 <img 
                    src={project.heroImage?.asset?.url} 
                    alt={project.heroImage?.alt || project.title}
                    className="w-full h-full object-cover"
                 />
            </div>
        </div>

        {/* Content Placeholder */}
        <div className="prose prose-lg prose-slate max-w-4xl mx-auto">
            <p className="text-slate-400 text-center italic">
                Full case study content would be rendered here using PortableText...
            </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;