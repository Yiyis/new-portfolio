import React from 'react';
import { Project } from '../../types';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowDown } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  return (
    <motion.div 
      className="w-full h-full bg-[#fcfcfc] overflow-y-auto no-scrollbar relative z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Full Screen Hero Image with Shared Layout ID */}
      <motion.div 
        layoutId={`project-image-${project._id}`}
        className="fixed top-0 left-0 w-full h-[60vh] lg:h-[70vh] overflow-hidden z-0"
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
         <img 
            src={project.heroImage?.asset?.url} 
            alt={project.heroImage?.alt || project.title}
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fcfcfc]/90"></div>
      </motion.div>

      {/* Back Button - Fixed */}
      <div className="fixed top-24 left-6 md:left-12 z-50 mix-blend-difference text-white">
        <button 
            onClick={onBack}
            className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-bold hover:text-water-300 transition-colors cursor-hover-trigger"
        >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Work</span>
        </button>
      </div>

      {/* Content Container - Scrolls over the hero */}
      <div className="relative z-10 mt-[50vh] lg:mt-[60vh] px-6 md:px-12 pb-24">
        
        {/* Scroll Indicator */}
        <motion.div 
            className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/80 mix-blend-difference pointer-events-none"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, repeat: Infinity, repeatType: "reverse", repeatDelay: 0.5 }}
        >
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll</span>
            <ArrowDown size={20} />
        </motion.div>

        <div className="max-w-7xl mx-auto bg-[#fcfcfc] p-8 md:p-16 rounded-t-3xl shadow-xl min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-slate-900 mb-8 leading-[0.9] tracking-tight">
                    {project.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags?.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase tracking-widest font-medium rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                    <div className="lg:col-span-2">
                        <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed">
                            {project.shortDescription}
                        </p>
                    </div>
                    <div className="lg:col-span-1 space-y-6 text-sm">
                        <div>
                            <h3 className="uppercase tracking-widest font-bold text-slate-400 mb-2">Role</h3>
                            <p className="text-slate-800">Lead Designer & Developer</p>
                        </div>
                        <div>
                            <h3 className="uppercase tracking-widest font-bold text-slate-400 mb-2">Year</h3>
                            <p className="text-slate-800">2024</p>
                        </div>
                    </div>
                </div>

                {/* Detailed Content Placeholder */}
                <div className="prose prose-lg prose-slate max-w-4xl mx-auto mt-16">
                    <p>
                        This is where the detailed project case study would go. It can include images, text, videos, and more.
                        The hero image above transitions seamlessly from the home page blob.
                    </p>
                    <div className="w-full aspect-video bg-slate-100 rounded-lg my-8 flex items-center justify-center text-slate-400">
                        Project Gallery / Video Placeholder
                    </div>
                    <p>
                        More details about the process, challenges, and solution...
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;