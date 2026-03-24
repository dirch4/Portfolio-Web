"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Database, PenTool } from "lucide-react";

export default function TechStack() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Curve swipe reveal effect 
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["0 1", "0.4 1"] 
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["ellipse(50% 0% at 50% 100%)", "ellipse(150% 150% at 50% 100%)"]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <motion.section 
      ref={containerRef}
      style={{ clipPath }}
      id="expertise" 
      className="relative flex min-h-screen w-full items-center justify-center px-4 py-24 pb-32"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col space-y-16">
        
        {/* Section Heading */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
           className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">Expertise.</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto">
            A comprehensive toolkit designed to build robust, beautiful, and highly-performant digital experiences.
          </p>
        </motion.div>

        {/* Bento Box Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Card 1: Web Development (Spans 2 columns on large screens) */}
          <motion.div 
            variants={itemVariants}
            data-cursor="hover"
            className="group relative col-span-1 md:col-span-2 lg:col-span-2 overflow-hidden bg-glass border border-glass rounded-3xl p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-glass hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.15)]"
          >
            {/* Inner Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="p-4 bg-zinc-50 dark:bg-white/5 w-max rounded-2xl border border-zinc-200 dark:border-white/10 group-hover:border-cyan-500/30 transition-colors">
                <Code className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-2xl font-medium text-zinc-900 dark:text-zinc-50 mb-3">Web Development</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">Architecting modern, scalable, and highly interactive frontends. Engineering performance and smooth UX using <span className="text-zinc-900 dark:text-zinc-50 font-medium">Next.js, React, and Tailwind CSS</span>.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Data Analysis & ML */}
          <motion.div 
            variants={itemVariants}
            data-cursor="hover"
            className="group relative col-span-1 border overflow-hidden bg-glass border-glass rounded-3xl p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-glass hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="p-4 bg-zinc-50 dark:bg-white/5 w-max rounded-2xl border border-zinc-200 dark:border-white/10 group-hover:border-purple-500/30 transition-colors">
                <Database className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-medium text-zinc-900 dark:text-zinc-50 mb-3">Data Analysis & Machine Learning</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">Extracting insights from complex data streams and implementing intelligent models.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: UI UX Desainer (Spans full width or remaining space) */}
          <motion.div 
            variants={itemVariants}
            data-cursor="hover"
            className="group relative col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden bg-glass border border-glass rounded-3xl p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-glass hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row h-full justify-between items-start md:items-center gap-8">
              <div className="flex flex-col gap-8 flex-1">
                <div className="p-4 bg-zinc-50 dark:bg-white/5 w-max rounded-2xl border border-zinc-200 dark:border-white/10 group-hover:border-pink-500/30 transition-colors">
                  <PenTool className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-2xl font-medium text-zinc-900 dark:text-zinc-50 mb-3">UI UX Desainer</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-lg">Crafting intuitive, user-centric interfaces. Balancing bold aesthetics (Flerdesign) and functional precision (Antigravity) to deliver highly engaging experiences.</p>
                </div>
              </div>
              
              {/* Abstract decorative element for UI/UX Card */}
              <div className="hidden md:flex flex-1 justify-end opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="grid grid-cols-2 gap-3 transform group-hover:rotate-6 transition-transform duration-700">
                  <div className="w-16 h-16 rounded-full border border-pink-500/50" />
                  <div className="w-16 h-16 rounded-3xl bg-pink-500/20 backdrop-blur-sm" />
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500/40 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </motion.section>
  );
}
