import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-hover-trigger')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Hide on touch devices
  if (typeof navigator !== 'undefined' && 'ontouchstart' in window) {
      return null;
  }

  // Explicit RGBA values for smooth interpolation to "transparent"
  // Border: #38bdf8 is roughly rgba(56, 189, 248, 1)
  const borderIdle = '#38bdf8';
  const borderHover = 'rgba(56, 189, 248, 0)'; 
  
  // Background: #0ea5e9 is rgba(14, 165, 233, 1)
  const bgIdle = 'rgba(14, 165, 233, 0)';
  const bgHover = 'rgba(14, 165, 233, 0.2)';

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border rounded-full pointer-events-none z-50"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      initial={{
        scale: 1,
        backgroundColor: bgIdle,
        borderColor: borderIdle
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? bgHover : bgIdle,
        borderColor: isHovering ? borderHover : borderIdle
      }}
      transition={{
        scale: { duration: 0.2 },
        default: { duration: 0.2 }
      }}
    />
  );
};

export default CustomCursor;