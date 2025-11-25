import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WaterDistortion from '../ui/WaterDistortion';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Use a unique ID for this page's distortion filter */}
      <WaterDistortion id="water-404" />
      
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-water-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div 
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          style={{ animationDelay: '2s' }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6"
      >
        {/* 404 Text with Water Distortion */}
        <h1 
          className="text-[30vw] md:text-[20vw] font-serif italic text-water-400 leading-none select-none opacity-80"
          style={{ filter: 'url(#water-404)' }}
        >
          404
        </h1>

        <div className="relative z-20 mt-[-4vw] md:mt-[-3vw] space-y-4 md:space-y-6">
          <h2 className="text-3xl md:text-5xl font-serif italic text-slate-900">
            Drifting in the deep...
          </h2>
          <p className="text-slate-500 font-sans tracking-wide text-sm md:text-base">
            The page you are looking for has washed away.
          </p>
          
          <div className="pt-8">
            <button 
              onClick={() => navigate('/')}
              className="group inline-flex items-center space-x-3 text-xs uppercase tracking-[0.2em] font-bold text-slate-900 border-b border-transparent hover:border-water-500 transition-all pb-2 cursor-hover-trigger"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span>Swim Back Home</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;

