import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { getProjects } from './services/sanityService';
import { Project } from './types';
import CustomCursor from './components/ui/CustomCursor';
import HomePage from './components/Home/HomePage';
import AboutPage from './components/About/AboutPage';
import PasswordModal from './components/ui/PasswordModal';
import ProjectDetailWrapper from './components/Project/ProjectDetailWrapper';
import SplashLoader from './components/ui/SplashLoader';
import NotFoundPage from './components/NotFound/NotFoundPage';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash if it hasn't been shown in this session
    return !sessionStorage.getItem('hasSeenSplash');
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Project Protection State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingProjectSlug, setPendingProjectSlug] = useState<string | null>(null);

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

  const handleIndexChange = (index: number, newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(index);
  };

  const handleNavClick = (path: string) => {
    setDirection(0);
    navigate(path);
  };

  const handleViewProject = (project: Project) => {
    if (project.isProtected) {
      setPendingProjectSlug(project.slug?.current || null);
      setShowPasswordModal(true);
    } else if (project.slug?.current) {
      navigate(`/project/${project.slug.current}`);
    }
  };

  const handleUnlockSuccess = () => {
    setShowPasswordModal(false);
    if (pendingProjectSlug) {
      navigate(`/project/${pendingProjectSlug}`);
      setPendingProjectSlug(null);
    }
  };

  // Determine active view from location
  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isProject = location.pathname.startsWith('/project/');

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 overflow-hidden selection:bg-water-200 selection:text-water-900 flex flex-col">
      <CustomCursor />
      
      {/* Splash Loader */}
      <AnimatePresence>
        {showSplash && (
          <SplashLoader key="splash" onComplete={() => {
            setShowSplash(false);
            sessionStorage.setItem('hasSeenSplash', 'true');
          }} />
        )}
      </AnimatePresence>
      
      {/* Modals */}
      <PasswordModal 
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPendingProjectSlug(null);
        }}
        onSuccess={handleUnlockSuccess}
        correctKey={projects.find(p => p.slug?.current === pendingProjectSlug)?.accessKey}
      />

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: !showSplash ? 0 : -100, opacity: !showSplash ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      >
        <div className="pointer-events-auto">
          <button onClick={() => handleNavClick('/')} className="flex items-center gap-4 group cursor-hover-trigger text-left">
            <span className="text-xl md:text-2xl font-serif italic font-medium tracking-tight group-hover:text-water-600 transition-colors">
              Yiyi<br/>Shao
            </span>
          </button>
        </div>
        
        {/* Logo - Centered */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <button 
            onClick={() => handleNavClick('/')} 
            className="group cursor-hover-trigger"
            aria-label="Go to home page"
          >
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
          <button onClick={() => handleNavClick('/')} className={`text-[10px] uppercase tracking-[0.2em] transition-colors cursor-hover-trigger font-bold ${isHome || isProject ? 'text-water-600' : 'text-slate-900 hover:text-water-500'}`}>Work</button>
          <button onClick={() => handleNavClick('/about')} className={`text-[10px] uppercase tracking-[0.2em] transition-colors cursor-hover-trigger font-bold ${isAbout ? 'text-water-600' : 'text-slate-900 hover:text-water-500'}`}>About</button>
        </div>
      </motion.nav>

      <main className="flex-grow relative flex items-center justify-center w-full h-screen">
        
        {/* Decorative Background Text (Show only on Home and About, hidden on Project and 404) */}
        {(isHome || isAbout) && (
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
            <LayoutGroup>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    projects.length > 0 ? (
                      <HomePage 
                        projects={projects}
                        currentIndex={currentIndex}
                        direction={direction}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        onIndexChange={handleIndexChange}
                        onViewProject={handleViewProject}
                        showSplash={showSplash}
                      />
                    ) : null
                  } 
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/project/:slug" element={<ProjectDetailWrapper onPasswordCheck={(slug) => {
                  const project = projects.find(p => p.slug?.current === slug);
                  if (project?.isProtected) {
                    setPendingProjectSlug(slug);
                    setShowPasswordModal(true);
                    return false; // Block navigation
                  }
                  return true; // Allow navigation
                }} />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </LayoutGroup>
          </div>
        )}
      </main>

      {/* Footer (Hidden in Project View to maximize reading space) */}
      {!isProject && (
        <motion.footer 
          className="fixed bottom-0 left-0 w-full z-40 px-6 py-6 md:px-12 md:py-8 flex flex-col md:flex-row justify-between items-center md:items-end pointer-events-none text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 bg-gradient-to-t from-[#fcfcfc] via-[#fcfcfc]/90 to-transparent md:bg-none"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: !showSplash ? 0 : 100, opacity: !showSplash ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        >
            <div className="pointer-events-auto order-2 md:order-1 mt-2 md:mt-0 text-center md:text-left">
                <span>UI/UX & Frontend Developer</span>
            </div>
            <div className="pointer-events-auto flex space-x-6 order-1 md:order-2">
                <a href="https://www.linkedin.com/in/yiyishao/" target="_blank" rel="noopener noreferrer" className="hover:text-water-600 transition-colors cursor-hover-trigger">Linkedin</a>
                <a href="https://www.instagram.com/yiyigoeswild/" target="_blank" rel="noopener noreferrer" className="hover:text-water-600 transition-colors cursor-hover-trigger">Instagram</a>
                <a href="https://github.com/Yiyis" target="_blank" rel="noopener noreferrer" className="hover:text-water-600 transition-colors cursor-hover-trigger">Github</a>
                <a href="mailto:yolandayiyishao@gmail.com" className="hover:text-water-600 transition-colors cursor-hover-trigger">Email</a>
            </div>
        </motion.footer>
      )}
    </div>
  );
};

export default App;