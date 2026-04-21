"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);

  // Curve swipe reveal effect using scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["0 1", "0.5 1"] // Trigger when top of footer hits bottom of viewport, ends when top is at 50%
  });

  // Animates an ellipse opening up over the content
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["ellipse(50% 0% at 50% 100%)", "ellipse(150% 150% at 50% 100%)"]
  );

  return (
    <motion.footer
      ref={containerRef}
      style={{ clipPath }}
      className="relative flex flex-col items-center justify-center w-full px-4 pt-32 pb-12 overflow-hidden bg-zinc-50/50 dark:bg-white/[0.01] border-t border-zinc-200 dark:border-white/[0.05]"
    >
      <div className="absolute top-0 inset-x-0 h-[300px] w-full bg-gradient-to-b from-zinc-100 dark:from-white/[0.02] to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center z-10"
      >
        <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-white/40 mb-16">
          Let&apos;s Build <br className="hidden md:block" />
          Something <br className="hidden md:block" />
          Together.
        </h2>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-24">
          <a href="https://github.com/dirch4" target="_blank" rel="noopener noreferrer" data-cursor="hover" className="group flex items-center gap-2 px-6 py-4 rounded-full bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/30 hover:scale-105 transition-all duration-300">
            <Github className="w-5 h-5 text-zinc-500 dark:text-gray-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            <span className="text-zinc-600 dark:text-gray-400 group-hover:text-zinc-900 dark:group-hover:text-white font-medium">GitHub</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 dark:text-gray-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
          </a>

          <a href="https://www.linkedin.com/in/dimas-nch/" target="_blank" rel="noopener noreferrer" data-cursor="hover" className="group flex items-center gap-2 px-6 py-4 rounded-full bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/30 hover:scale-105 transition-all duration-300">
            <Linkedin className="w-5 h-5 text-zinc-500 dark:text-gray-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            <span className="text-zinc-600 dark:text-gray-400 group-hover:text-zinc-900 dark:group-hover:text-white font-medium">LinkedIn</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 dark:text-gray-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
          </a>

          <a href="mailto:dimasnurcahya478@gmail.com" data-cursor="hover" className="group flex items-center gap-2 px-6 py-4 rounded-full bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/30 hover:scale-105 transition-all duration-300">
            <Mail className="w-5 h-5 text-zinc-500 dark:text-gray-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            <span className="text-zinc-600 dark:text-gray-400 group-hover:text-zinc-900 dark:group-hover:text-white font-medium">Email</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 dark:text-gray-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
          </a>
        </div>
      </motion.div>

      {/* Copyright Line */}
      <div className="mt-12 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-200 dark:border-white/10 z-10">
        <p className="text-zinc-500 dark:text-gray-500 text-sm">© {new Date().getFullYear()} Dimas. All rights reserved.</p>
        <p className="text-zinc-600 dark:text-gray-600 text-sm mt-4 md:mt-0 flex items-center gap-1 font-medium">
        </p>
      </div>
    </motion.footer>
  );
}
