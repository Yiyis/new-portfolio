import React, { useRef, useEffect } from 'react';

// This component renders an SVG filter into the DOM that can be referenced by CSS
// It animates the turbulence to create a "living water" feel.

interface WaterDistortionProps {
  id: string;
}

const WaterDistortion: React.FC<WaterDistortionProps> = ({ id }) => {
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    let frame = 0;
    let animationFrameId: number;

    const animate = () => {
      frame += 1;
      if (turbulenceRef.current) {
        // Manipulate baseFrequency to simulate slow water movement
        // We oscillate slightly to avoid it looking like static noise panning
        const freqX = 0.01 + Math.sin(frame * 0.003) * 0.005;
        const freqY = 0.03 + Math.cos(frame * 0.005) * 0.005;
        turbulenceRef.current.setAttribute('baseFrequency', `${freqX} ${freqY}`);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <svg className="hidden">
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.01 0.03"
            numOctaves="2"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.5" result="smoothedNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smoothedNoise"
            scale="30" /* Increased scale to account for blur smoothing */
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default WaterDistortion;