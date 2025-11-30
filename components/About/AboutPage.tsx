import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DistortedImage from '../Home/DistortedImage';
import { ArrowDown } from 'lucide-react';

const Highlight: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.span
    className="relative inline-block text-water-900 font-medium px-1 mx-0.5"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-10%" }}
  >
    <motion.span
      className="absolute inset-0 bg-water-400/30 rounded -z-10"
      initial={{ width: "0%" }}
      variants={{
        visible: { 
          width: "100%",
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }
        }
      }}
    />
    {children}
  </motion.span>
);

const AboutPage: React.FC = () => {
  // Profile image
  const profileImage = "/images/Yiyi.jpg";

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showIndicator, setShowIndicator] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setScrollTop(scrollTop);
      
      // Show indicator if content overflows and we are not at the bottom (with 20px buffer)
      if (scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 20) {
        setShowIndicator(true);
      } else {
        setShowIndicator(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      checkScroll();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate scale factor based on scroll (for mobile)
  // Scales down from 1.0 to 0.6 over 300px of scroll
  const scaleFactor = isMobile ? Math.max(0.6, 1 - scrollTop / 300) : 1;

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24 max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-0">
      
      {/* Blob - Left Side */}
      <motion.div 
        className="order-1 flex justify-center items-center w-full md:flex-1"
        animate={{
          height: isMobile ? "auto" : "100%",
          flex: isMobile ? "none" : 1
        }}
      >
        <motion.div 
          className="relative animate-blob overflow-hidden bg-water-50 shadow-2xl"
          animate={{
            width: isMobile ? 300 * scaleFactor : 450, // Base sizes for mobile/desktop
            height: isMobile ? 300 * scaleFactor : 450,
          }}
          style={{
            // Use transform for smoother performance if possible, but width/height required for layout flow
            // We'll stick to width/height for flow since we want the text to move up
            width: isMobile ? 300 : undefined, 
            height: isMobile ? 300 : undefined 
          }}
        >
           <DistortedImage 
             src={profileImage} 
             alt="Yiyi Shao" 
             direction={0}
             disableShader={true}
           />
           <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none rounded-[inherit] z-20"></div>
        </motion.div>
      </motion.div>

      {/* Text Info - Right Side (Scrollable with Indicator) */}
      <div className="order-2 flex-1 w-full h-full md:h-[70vh] relative min-h-0">
        <motion.div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="w-full h-full text-slate-900 overflow-y-auto no-scrollbar pb-40 md:pb-0 mx-auto max-w-xl md:max-w-none"
          initial={{ opacity: 0, x: 50, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: 50, filter: 'blur(8px)' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-xl mx-auto md:mx-0">
            <h2 className="text-5xl md:text-7xl font-serif italic text-slate-900 mb-8 leading-[0.9] tracking-tight text-center md:text-left">
              About Me
            </h2>

            <div className="prose prose-slate prose-lg font-sans font-light text-slate-600 space-y-6 mb-12 text-center md:text-left">
              <p>
              Hi, I'm Yiyi — a Design-Driven Full-Stack Developer who blends <Highlight delay={0.2}>design intuition</Highlight> with <Highlight delay={0.6}>engineering discipline</Highlight> to create digital experiences that feel effortless.              </p>
              <p>
              Trained in design and arts, I approach every project with a multidisciplinary lens, moving fluidly from user research, UX flows, and interface design to clean, scalable front-end implementation. I’m passionate about crafting interfaces where clarity, accessibility, and performance come together.              </p>
              <p>
              My background spans interactive media, creative coding, and academic research, giving me a unique perspective on how humans connect with technology — and how thoughtful design can make that interaction meaningful.              </p>
              <p>Outside of work, I’m a devoted dog mom and an outdoor enthusiast — usually found rock climbing, hiking, or exploring the water as a PADI Open Water Diver and AIDA 2 Freediver.</p>
            </div>

            {/* Section: Exhibits */}
            <div className="mb-12 text-center md:text-left">
              <h3 className="text-2xl font-serif italic mb-6 text-water-600">Exhibits, Talks & Workshops</h3>
              <ul className="space-y-3 font-sans text-sm md:text-base text-slate-600 font-light inline-block text-left">
                <li><strong className="font-medium text-slate-800">IUW 2018</strong> Speaker</li>
                <li><strong className="font-medium text-slate-800">DF Openshow 2018, 2019</strong> Exhibitor</li>
                <li><strong className="font-medium text-slate-800">Dames Making Games & Social Body Lab 2018 - 2020</strong> Workshop instructor</li>
                <li><strong className="font-medium text-slate-800">WTF – What the Futures? 2019</strong> Exhibitor</li>
                <li><strong className="font-medium text-slate-800">LevelUp 2019</strong> Exhibitor</li>
                <li><strong className="font-medium text-slate-800">FITC 2019</strong> Exhibitor</li>
                <li><strong className="font-medium text-slate-800">GradEX 2019</strong> Exhibitor</li>
                <li><strong className="font-medium text-slate-800">Future Education Festival 2019</strong> Exhibitor</li>
                <li><strong className="font-medium text-slate-800">VRTO 2019</strong> Workshop facilitator</li>
                <li><strong className="font-medium text-slate-800">DMG October Speaker Social 2019</strong> Speaker</li>
              </ul>
            </div>

            {/* Section: Publications */}
            <div className="pb-8 text-center md:text-left">
              <h3 className="text-2xl font-serif italic mb-6 text-water-600">Publications</h3>
              <ul className="space-y-6 font-sans text-sm text-slate-500 font-light leading-relaxed text-left">
                <li>
                  <span className="font-medium text-slate-700">Shao, Yiyi, Nadine Lessio, and Alexis Morris.</span> "IoT Avatars: Mixed Reality Hybrid Objects for CoRe Ambient Intelligent Environments." <em>Procedia Computer Science 155</em> (2019): 433-440.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Kate Hartman, Chris Luginbuhl, Yiyi Shao, and Ricardo Toller Correia.</span> 2020. Encasing Computation: Using Digital Fabrication Approaches to Make Microcontrollers Wearable. In <em>Proceedings of the Fourteenth International Conference on Tangible, Embedded, and Embodied Interaction (TEI ’20)</em>. Association for Computing Machinery, New York, NY, USA, 849–861.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Guan, Jie, Nadine Lessio, Yiyi Shao, and Alexis Morris.</span> "Exploring a Mixed Reality Framework for the Internet-of-Things: Toward Visualization and Interaction with Hybrid Objects and Avatars." In <em>2020 IEEE Conference on Virtual Reality and 3D User Interfaces Abstracts and Workshops (VRW)</em>, pp. 858-858. IEEE, 2020.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Morris, Alexis, Jie Guan, Nadine Lessio, and Yiyi Shao.</span> "Toward Mixed Reality Hybrid Objects with IoT Avatar Agents." In <em>2020 IEEE International Conference on Systems, Man, and Cybernetics (SMC)</em>, pp. 766-773. IEEE, 2020.
                </li>
                <li>
                  <span className="font-medium text-slate-700">Hartman, Kate, Emma Westecott, Izzie Colpitts-Campbell, Jennie Robinson Faber, Yiyi Shao, Chris Luginbuhl, Olivia Prior, and Manisha Laroia.</span> "Textile Game Controllers: Exploring Affordances of E-Textile Techniques as Applied to Alternative Game Controllers." In <em>Proceedings of the Fifteenth International Conference on Tangible, Embedded, and Embodied Interaction</em>, pp. 1-14. 2021.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {showIndicator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 w-full h-48 md:h-40 pointer-events-none bg-gradient-to-t from-[#fcfcfc] via-[#fcfcfc] to-transparent flex flex-col justify-end items-center pb-4 z-20"
            >
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="flex flex-col items-center gap-2 text-water-500/80 pb-20 md:pb-0"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll</span>
                <ArrowDown size={16} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AboutPage;