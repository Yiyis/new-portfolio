import React, { useEffect, useState } from 'react';
import { getProjects } from './services/sanityService';
import { Project } from './types';
import CustomCursor from './components/ui/CustomCursor';
import BlobProject from './components/Home/BlobProject';
import AboutPage from './components/About/AboutPage';
import PasswordModal from './components/ui/PasswordModal';
import ProjectDetail from './components/Project/ProjectDetail';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [view, setView] = useState<'home' | 'about' | 'project'>('home');
  
  // Project Protection State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNavClick = (newView: 'home' | 'about') => {
    setDirection(0);
    setView(newView);
    // Reset selection when navigating away
    setSelectedProject(null);
  }

  const handleViewProject = () => {
      const currentProject = projects[currentIndex];
      setSelectedProject(currentProject);

      if (currentProject.isProtected) {
          setShowPasswordModal(true);
      } else {
          setView('project');
      }
  };

  const handleUnlockSuccess = () => {
      setShowPasswordModal(false);
      setView('project');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 overflow-hidden selection:bg-water-200 selection:text-water-900 flex flex-col">
      <CustomCursor />
      
      {/* Modals */}
      <PasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handleUnlockSuccess}
        correctKey={selectedProject?.accessKey}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <button onClick={() => handleNavClick('home')} className="flex items-center gap-4 group cursor-hover-trigger text-left">
            <span className="text-xl md:text-2xl font-serif italic font-medium tracking-tight group-hover:text-water-600 transition-colors">
              Yiyi<br/>Shao
            </span>
          </button>
        </div>
        
        {/* Logo - Centered */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <button onClick={() => handleNavClick('home')} className="group cursor-hover-trigger">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden rounded-full group-hover:opacity-80 transition-opacity duration-300">
               <img 
                 src="/images/logo_black.png" 
                 alt="Logo" 
                 className="w-full h-full object-contain"
               />
            </div>
          </button>
        </div>
        
        <div className="flex items-center space-x-8 pointer-events-auto">
          <button onClick={() => handleNavClick('home')} className={`text-[10px] uppercase tracking-[0.2em] transition-colors cursor-hover-trigger font-bold ${view === 'home' || view === 'project' ? 'text-water-600' : 'text-slate-900 hover:text-water-500'}`}>Work</button>
          <button onClick={() => handleNavClick('about')} className={`text-[10px] uppercase tracking-[0.2em] transition-colors cursor-hover-trigger font-bold ${view === 'about' ? 'text-water-600' : 'text-slate-900 hover:text-water-500'}`}>About</button>
        </div>
      </nav>

      <main className="flex-grow relative flex items-center justify-center w-full h-screen">
        
        {/* Decorative Background Text (Hidden on Project Detail view to keep it clean) */}
        {view !== 'project' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03]">
                <span className="text-[20vw] font-serif italic whitespace-nowrap">Portfolio</span>
            </div>
        )}

        {/* Loading State */}
        {loading && (
             <div className="absolute inset-0 flex justify-center items-center z-50 bg-[#fcfcfc]">
               <div className="w-12 h-12 border-2 border-slate-100 border-t-water-500 rounded-full animate-spin"></div>
             </div>
        )}

        {/* Main Content Area */}
        {!loading && (
          <div className="w-full h-full">
            <AnimatePresence mode="wait">
              {view === 'home' && projects.length > 0 && (
                <motion.div 
                    key="home"
                    className="w-full h-full flex items-center justify-center max-w-7xl mx-auto px-4 md:px-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Previous Button (Home Only) */}
                    <button 
                      onClick={handlePrev}
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
                      />
                    </div>

                    {/* Next Button (Home Only) */}
                    <button 
                      onClick={handleNext}
                      className="hidden md:flex absolute right-4 lg:right-0 top-1/2 -translate-y-1/2 z-30 group items-center space-x-2 flex-row-reverse space-x-reverse cursor-hover-trigger"
                      aria-label="Next Project"
                    >
                      <span className="w-12 h-[1px] bg-slate-300 group-hover:bg-water-500 transition-colors duration-300"></span>
                      <span className="text-xs uppercase tracking-widest text-slate-400 group-hover:text-water-600 transition-colors duration-300">Next</span>
                    </button>

                    {/* Mobile Controls (Home Only) */}
                    <div className="md:hidden absolute bottom-28 left-0 w-full flex justify-between px-8 z-30">
                       <button onClick={handlePrev} className="p-4 rounded-full bg-white/50 backdrop-blur-sm border border-slate-100 cursor-hover-trigger">
                         <ArrowLeft size={20} className="text-slate-600" />
                       </button>
                       <button onClick={handleNext} className="p-4 rounded-full bg-white/50 backdrop-blur-sm border border-slate-100 cursor-hover-trigger">
                         <ArrowRight size={20} className="text-slate-600" />
                       </button>
                    </div>

                    {/* Progress Indicator (Home Only) */}
                    <div className="absolute bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
                      {projects.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                          }}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            idx === currentIndex ? 'w-8 bg-water-500' : 'w-2 bg-slate-200 hover:bg-water-300'
                          }`}
                          aria-label={`Go to project ${idx + 1}`}
                        />
                      ))}
                    </div>
                </motion.div>
              )}

              {view === 'about' && (
                  <motion.div 
                    key="about"
                    className="w-full h-full flex items-center justify-center pt-20 md:pt-0 max-w-7xl mx-auto px-4 md:px-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                      <AboutPage />
                  </motion.div>
              )}

              {view === 'project' && selectedProject && (
                  <motion.div
                    key="project"
                    className="w-full h-full fixed inset-0 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                      <ProjectDetail 
                        project={selectedProject} 
                        onBack={() => setView('home')} 
                      />
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Footer (Hidden in Project View to maximize reading space) */}
      {view !== 'project' && (
        <footer className="fixed bottom-0 left-0 w-full z-40 px-6 py-6 md:px-12 md:py-8 flex flex-col md:flex-row justify-between items-center md:items-end pointer-events-none text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
            <div className="pointer-events-auto order-2 md:order-1 mt-2 md:mt-0 text-center md:text-left">
                <span>UI/UX & Frontend Developer</span>
            </div>
            <div className="pointer-events-auto flex space-x-6 order-1 md:order-2">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-water-600 transition-colors cursor-hover-trigger">Linkedin</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-water-600 transition-colors cursor-hover-trigger">Instagram</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-water-600 transition-colors cursor-hover-trigger">Github</a>
                <a href="mailto:hello@example.com" className="hover:text-water-600 transition-colors cursor-hover-trigger">Email</a>
            </div>
        </footer>
      )}
    </div>
  );
};

export default App;