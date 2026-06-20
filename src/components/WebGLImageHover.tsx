import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Create a liquid distortion effect
    float noise = sin(uv.y * 20.0 + uTime) * 0.05 * uHover;
    uv.x += noise;
    
    // Zoom effect
    uv = (uv - 0.5) * (1.0 - 0.1 * uHover) + 0.5;

    vec4 tex = texture2D(uTexture, uv);
    gl_FragColor = tex;
  }
`;

const vertexShader = `
  varying vec2 vUv;
  uniform float uHover;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;
    // Slight bulge in the center on hover
    float dist = distance(uv, vec2(0.5));
    pos.z += sin(dist * 3.14) * 0.1 * uHover;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

function ShaderPlane({ src, isHovered }: { src: string; isHovered: boolean }) {
  const texture = useTexture(src);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Animate the uHover value towards 1 or 0
  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      const targetHover = isHovered ? 1 : 0;
      // Lerp for smooth transition
      materialRef.current.uniforms.uHover.value += (targetHover - materialRef.current.uniforms.uHover.value) * 0.1;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uHover: { value: 0 },
      uTime: { value: 0 }
    }),
    [texture]
  );

  return (
    <mesh>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function WebGLImageHover({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas 
        className="absolute inset-0 w-full h-full pointer-events-none"
        camera={{ position: [0, 0, 1] }} // Near camera to fill screen with the 2x2 plane
      >
        <ShaderPlane src={src} isHovered={isHovered} />
      </Canvas>
    </div>
  );
}
