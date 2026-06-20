import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isDarkBg, setIsDarkBg] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Determine if background is dark by looking at element under cursor
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        // We can check computed style or search for class names
        const computedStyle = window.getComputedStyle(element);
        const bg = computedStyle.backgroundColor;
        
        // Very basic lightness check (if rgb values are low)
        const match = bg.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          const lightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          setIsDarkBg(lightness < 0.5);
        } else {
          // Fallback logic by checking class names
          const className = element.className || '';
          if (typeof className === 'string' && (className.includes('obsidian') || className.includes('bg-luxury-charcoal') || className.includes('bg-[#1B1B1B]') || className.includes('bg-[#121212]'))) {
            setIsDarkBg(true);
          } else {
            setIsDarkBg(false);
          }
        }
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 rounded-full border-[1.5px] pointer-events-none z-[9999] mix-blend-difference"
      style={{
        borderColor: isDarkBg ? 'var(--color-antique-gold, #C9A84C)' : 'var(--color-slate-charcoal, #2C2C2C)',
        boxShadow: isDarkBg ? '0 0 8px rgba(201, 168, 76, 0.4)' : 'none',
      }}
      animate={{
        x: mousePosition.x - 12, // center the 24px circle
        y: mousePosition.y - 12,
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 250,
        mass: 0.5,
      }}
    />
  );
}
