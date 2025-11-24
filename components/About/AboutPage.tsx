import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DistortedImage from '../Home/DistortedImage';
import { ArrowDown } from 'lucide-react';

const AboutPage: React.FC = () => {
  // Profile image
  const profileImage = "/images/Yiyi.jpg";

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showIndicator, setShowIndicator] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Show indicator if content overflows and we are not at the bottom (with 20px buffer)
      if (scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 20) {
        setShowIndicator(true);
      } else {
        setShowIndicator(false);
      }
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24 max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-0">
      
      {/* Blob - Left Side */}
      <div className="order-1 flex-1 flex justify-center items-center w-full">
        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] animate-blob overflow-hidden bg-water-50 shadow-2xl">
           <DistortedImage 
             src={profileImage} 
             alt="Yiyi Shao" 
             direction={0}
             disableShader={true}
           />
           <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none rounded-[inherit] z-20"></div>
        </div>
      </div>

      {/* Text Info - Right Side (Scrollable with Indicator) */}
      <div className="order-2 flex-1 w-full h-full md:h-[70vh] relative min-h-0">
        <motion.div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="w-full h-full text-slate-900 overflow-y-auto no-scrollbar pb-24 md:pb-0 mx-auto max-w-xl md:max-w-none"
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
                Hi! I’m Yiyi, a developer with a background in design and arts, originally from China and now based in downtown Toronto. I love using a range of programming tools and digital media to craft simple, effective solutions to complex problems. My focus is on building visually appealing, intuitive web applications that align with user needs.
              </p>
              <p>
                With a multidisciplinary approach, I combine my expertise in design, programming, and digital media to deliver creative, efficient solutions. I’ve also contributed to research projects, reflecting my passion for innovation and advancing knowledge in the tech space.
              </p>
              <p>
                When I’m not coding, I’m a devoted dog mom who loves outdoor adventures like rock climbing, diving, hiking, and camping. I’m also a certified PADI Open Water Diver and AIDA 2 Freediver.
              </p>
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
              className="absolute bottom-0 left-0 w-full h-32 pointer-events-none bg-gradient-to-t from-[#fcfcfc] via-[#fcfcfc]/80 to-transparent flex flex-col justify-end items-center pb-8 z-20"
            >
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="flex flex-col items-center gap-2 text-water-500/80"
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