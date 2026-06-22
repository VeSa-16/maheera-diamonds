import { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export default function Magnetic({
  children,
  strength = 30, // How far it moves
}: {
  children: React.ReactElement;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Spring configuration for physical, weighty feel
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of the element (-1 to 1)
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Apply movement based on strength
    x.set(middleX * (strength / width));
    y.set(middleY * (strength / height));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Snap back to center
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ x, y }}
      className="inline-block relative z-10"
    >
      {children}
    </motion.div>
  );
}
