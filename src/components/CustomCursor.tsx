import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for smooth tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for the trailing ring
  const ringSpringConfig = { damping: 25, stiffness: 150, mass: 0.8 };
  const smoothRingX = useSpring(mouseX, ringSpringConfig);
  const smoothRingY = useSpring(mouseY, ringSpringConfig);

  // Instant physics for the center dot
  const dotSpringConfig = { damping: 40, stiffness: 400, mass: 0.1 };
  const smoothDotX = useSpring(mouseX, dotSpringConfig);
  const smoothDotY = useSpring(mouseY, dotSpringConfig);

  useEffect(() => {
    // Only hide native cursor if it's a pointing device
    document.body.classList.add('hide-native-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const interactiveEl = target.closest('a, button, input, select, [role="button"], .cursor-hover');
      
      if (interactiveEl) {
        setIsHovering(true);
        if (interactiveEl.hasAttribute('data-cursor-text')) {
          setHoverText(interactiveEl.getAttribute('data-cursor-text') || '');
        } else {
          setHoverText('');
        }
      } else {
        setIsHovering(false);
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('hide-native-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Center Dot (Instant Tracking) */}
      <motion.div
        style={{
          x: smoothDotX,
          y: smoothDotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isHovering ? 0 : 1,
          scale: isHovering ? 0 : 1
        }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-1.5 h-1.5 bg-antique-gold rounded-full"
      />

      {/* Trailing Ring (Smooth Spring) */}
      <motion.div
        style={{
          x: smoothRingX,
          y: smoothRingY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 z-[9998] pointer-events-none flex items-center justify-center"
      >
        <motion.div
          animate={{
            width: isHovering ? (hoverText ? 80 : 50) : 32,
            height: isHovering ? (hoverText ? 80 : 50) : 32,
            backgroundColor: isHovering ? (hoverText ? 'rgba(255, 255, 255, 0.95)' : 'rgba(201, 168, 76, 0.15)') : 'transparent',
            borderColor: isHovering && !hoverText ? 'rgba(201, 168, 76, 0)' : 'rgba(201, 168, 76, 0.5)',
            borderWidth: isHovering ? '0px' : '1px',
            backdropFilter: isHovering ? 'blur(4px)' : 'none'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="rounded-full flex items-center justify-center text-obsidian shadow-lg"
        >
          <AnimatePresence>
            {isHovering && hoverText && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="font-display text-[10px] tracking-widest font-bold uppercase pointer-events-none text-center leading-tight px-2"
              >
                {hoverText}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
