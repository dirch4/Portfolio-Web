"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSize = useMotionValue(32); // Default size 32px

  // Spring physics configuration for the fluid trailing effect
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const cursorSizeSpring = useSpring(cursorSize, springConfig);

  useEffect(() => {
    // Only show on devices with a fine pointer (mouse/trackpad, not touch)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over an element with data-cursor="hover" or data-cursor="project"
      const isHovering = !!target.closest('[data-cursor="hover"]');
      const isHoveringProject = !!target.closest('[data-cursor="project"]');
      
      const currentSize = isHovering ? 80 : 32; // Expand to 80px on hover
      const offset = currentSize / 2;
      
      cursorSize.set(currentSize);
      cursorX.set(e.clientX - offset);
      cursorY.set(e.clientY - offset);
      
      if (isHoveringProject) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[99999] hidden rounded-full border border-zinc-900 dark:border-white bg-transparent md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        width: cursorSizeSpring,
        height: cursorSizeSpring,
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
}
