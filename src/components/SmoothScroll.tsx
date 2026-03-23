"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Initialize Lenis with heavy lerp for a premium, heavy, and buttery smooth feel
    const lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
