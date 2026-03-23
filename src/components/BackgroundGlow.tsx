"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

export default function BackgroundGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, [mouseX, mouseY]);

  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 80%)`;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[-1]"
      style={{
        background,
      }}
    />
  );
}
