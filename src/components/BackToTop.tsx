"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fungsi untuk melacak sejauh mana halaman telah di-scroll
    const toggleVisibility = () => {
      // Tombol baru muncul setelah melewati Hero Section (sekitar 500px)
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    // Jalankan sekali saat mount untuk mengecek posisi awal
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    // Scroll mulus kembali ke titik 0 (paling atas)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          data-cursor="hover" // Terhubung dengan CustomCursor untuk membesar saat disorot
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[5000] p-4 rounded-full bg-zinc-900/80 dark:bg-white/5 text-white dark:text-zinc-50 backdrop-blur-xl border border-zinc-700/50 dark:border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-none group transition-colors hover:bg-zinc-800 dark:hover:bg-white/10"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:-translate-y-1" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
