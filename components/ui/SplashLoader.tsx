import React from 'react';
import { motion } from 'framer-motion';

interface SplashLoaderProps {
  onComplete: () => void;
}

const SplashLoader: React.FC<SplashLoaderProps> = ({ onComplete }) => {
  const [LottieComponent, setLottieComponent] = React.useState<any>(null);
  const [animationData, setAnimationData] = React.useState<any>(null);
  const [animationReady, setAnimationReady] = React.useState(false);
  const lottieRef = React.useRef<any>(null);
  const startTime = React.useRef(Date.now());
  const minDisplayTime = 3000; // Minimum 3 seconds display time
  const maxWaitTime = 2000; // Max 2 seconds to load animation before showing fallback

  // Lazy load Lottie and animation data to improve LCP
  React.useEffect(() => {
    startTime.current = Date.now();
    
    // Load animation and library in parallel
    const loadAnimation = Promise.all([
      import('lottie-react'),
      import('./AnimationData')
    ]);

    const timeout = setTimeout(() => {
      // If animation takes too long, skip it for better LCP
      if (!animationReady) {
        console.log('Animation loading timeout - skipping for better LCP');
        onComplete();
      }
    }, maxWaitTime);

    loadAnimation
      .then(([lottieModule, animationModule]) => {
        clearTimeout(timeout);
        setLottieComponent(() => lottieModule.default);
        const data = animationModule.default;
        setAnimationData(data);
        
        // Check if animation data is valid
        if (data && data.layers && data.layers.length > 0) {
          setAnimationReady(true);
        } else {
          // No valid animation, complete after min time
          setTimeout(() => onComplete(), minDisplayTime);
        }
      })
      .catch((error) => {
        clearTimeout(timeout);
        console.error('Failed to load animation:', error);
        // On error, show for min time then complete
        setTimeout(() => onComplete(), minDisplayTime);
      });

    return () => clearTimeout(timeout);
  }, [animationReady, onComplete]);

  const handleComplete = React.useCallback(() => {
    const elapsed = Date.now() - startTime.current;
    const remaining = Math.max(0, minDisplayTime - elapsed);
    
    setTimeout(() => {
      onComplete();
    }, remaining);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1F6AA5]"
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {animationReady && LottieComponent && animationData ? (
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-[500px] aspect-[3/2] relative">
            <LottieComponent
              lottieRef={lottieRef}
              animationData={animationData}
              loop={false}
              autoplay={true}
              style={{ width: '100%', height: '100%', display: 'block' }}
              onComplete={handleComplete}
              onLoadedData={() => {
                // Ensure animation plays from start
                if (lottieRef.current) {
                  lottieRef.current.goToAndPlay(0);
                }
              }}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid meet',
                clearCanvas: false
              }}
            />
          </div>
          <motion.div 
            className="mt-4 text-white/90 font-serif text-2xl md:text-3xl italic tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            Hi, my name is Yiyi
          </motion.div>
        </div>
      ) : (
        // Lightweight placeholder - shows immediately for better LCP
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-sm text-white/70">Loading...</p>
        </div>
      )}
    </motion.div>
  );
};

export default SplashLoader;

