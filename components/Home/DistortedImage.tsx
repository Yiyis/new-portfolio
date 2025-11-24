import React, { Component, ReactNode, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { useTexture, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- Error Boundary for Texture Loading ---
interface TextureErrorBoundaryProps {
  children?: ReactNode;
}

interface TextureErrorBoundaryState {
  hasError: boolean;
}

class TextureErrorBoundary extends Component<TextureErrorBoundaryProps, TextureErrorBoundaryState> {
  state: TextureErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: any) {
    console.warn("Texture loading failed, falling back to placeholder.", error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.5} />
        </mesh>
      );
    }
    return this.props.children;
  }
}

// --- Shader Definition ---
const WaterMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(1, 1),
    uImageResolution: new THREE.Vector2(1, 1),
    uHover: 0,
    uIntensity: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform vec2 uImageResolution;
    uniform float uHover;
    uniform float uIntensity;
    
    varying vec2 vUv;

    // Simplex Noise Function (Simplified)
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // 1. Aspect Ratio Correction (Cover fit)
      vec2 ratio = vec2(
        min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
        min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
      );
      vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );

      // 2. Fluid Distortion
      float noiseVal = snoise(uv * 3.0 + uTime * 0.2);
      float distStrength = (0.02 + (uHover * 0.03)) * uIntensity;
      
      // Calculate displaced UVs for RGB shift
      vec2 distUV = uv + vec2(noiseVal * distStrength, snoise(uv * 4.0 - uTime * 0.3) * distStrength);
      
      // 3. Chromatic Aberration (RGB Shift)
      float r = texture2D(uTexture, distUV + vec2(0.005 * uIntensity, 0.0)).r;
      float g = texture2D(uTexture, distUV).g;
      float b = texture2D(uTexture, distUV - vec2(0.005 * uIntensity, 0.0)).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `
);

extend({ WaterMaterial });

// --- Inner Scene Component ---
interface WaterPlaneProps {
  src: string;
}

const WaterPlane: React.FC<WaterPlaneProps> = ({ src }) => {
  const materialRef = useRef<any>(null);
  const texture = useTexture(src);
  const { viewport, size } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      
      // Gently settle intensity from high to normal
      if (materialRef.current.uniforms.uIntensity.value > 1.0) {
          materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
              materialRef.current.uniforms.uIntensity.value, 
              1.0, 
              delta * 0.5 // Slower settle speed for viscous feel
          );
      }

      if (texture && texture.image) {
         const img = texture.image as HTMLImageElement;
         materialRef.current.uImageResolution.set(img.width, img.height);
      }
      materialRef.current.uResolution.set(size.width, size.height);
      
      materialRef.current.uMouse.x = THREE.MathUtils.lerp(materialRef.current.uMouse.x, mouseRef.current.x, 0.1);
      materialRef.current.uMouse.y = THREE.MathUtils.lerp(materialRef.current.uMouse.y, mouseRef.current.y, 0.1);
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      {/* @ts-ignore */}
      <waterMaterial 
        ref={materialRef} 
        uTexture={texture} 
        transparent
        // Reduced initial intensity for a calmer entrance
        uIntensity={1.5} 
      />
    </mesh>
  );
};

// --- Main Wrapper ---
interface DistortedImageProps {
  src: string;
  alt: string;
  direction?: number;
  disableShader?: boolean;
}

const DistortedImage = React.forwardRef<HTMLDivElement, DistortedImageProps>(({ src, alt, direction = 0, disableShader = false }, ref) => {
  if (!src) {
    return <div ref={ref} className="w-full h-full bg-water-50/50 animate-pulse" />;
  }

  // Softened animation variants with blur and reduced movement
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20, // Minimal slide
      opacity: 0,
      scale: 1.1, // Slight zoom in
      filter: 'blur(10px)', // Soft focus start
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
      scale: 1.1, // Zoom out (magnify) instead of shrinking to avoid edges
      filter: 'blur(10px)', // Soft focus end
    }),
  };

  return (
    <motion.div
      ref={ref}
      className="w-full h-full relative"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }, // Ultra smooth ease
        opacity: { duration: 1.2, ease: "easeInOut" },
        scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 1.0, ease: "easeInOut" }
      }}
    >
      {disableShader ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover" 
          draggable={false}
        />
      ) : (
        <Canvas
          camera={{ position: [0, 0, 1], fov: 50 }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%' }}
          gl={{ alpha: true, preserveDrawingBuffer: false }}
        >
          <TextureErrorBoundary>
            <Suspense fallback={null}>
              <WaterPlane src={src} />
            </Suspense>
          </TextureErrorBoundary>
        </Canvas>
      )}
    </motion.div>
  );
});

DistortedImage.displayName = 'DistortedImage';

export default DistortedImage;