"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // State required for the circular reveal animation
  const [animating, setAnimating] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [targetTheme, setTargetTheme] = useState<"light" | "dark">("light");

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = resolvedTheme || theme || "dark";
  const isDark = currentTheme === "dark";

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Cegah perubahan instan dan double klik selama animasi
    if (animating) return;

    const nextTheme = isDark ? "light" : "dark";
    setTargetTheme(nextTheme);
    setClickPos({ x: e.clientX, y: e.clientY });
    setAnimating(true);

    // Sinkronisasi: Tunggu animasi circular fill selesai (0.85s), lalu ubah tema,
    // dan pudarkan overlay perlahan.
    setTimeout(() => {
      setTheme(nextTheme);
      
      // Tunggu DOM merender tema baru sebelum menghapus overlay
      requestAnimationFrame(() => {
        setTimeout(() => {
          setAnimating(false);
        }, 50); // Small buffer to ensure visual swap is covered
      });
    }, 850);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        data-cursor="hover"
        className="fixed top-6 right-6 z-[9000] p-3 rounded-full bg-white/5 border border-white/10 dark:hover:bg-white/10 hover:bg-black/10 transition-colors backdrop-blur-md"
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-300" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-400" />
        )}
      </button>

      {/* Overlay Animasi Transisi Tema */}
      <AnimatePresence>
        {animating && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{
              backgroundColor: targetTheme === "light" ? "#ffffff" : "#000000",
            }}
            initial={{
              clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)`,
              opacity: 1,
            }}
            animate={{
              clipPath: `circle(150% at ${clickPos.x}px ${clickPos.y}px)`,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              opacity: { duration: 0.3 }, // Cepat pudar keluar saat animasi selesai
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
