"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Terminal, Code2, Database } from "lucide-react";

export default function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["0 1", "0.4 1"]
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["ellipse(50% 0% at 50% 100%)", "ellipse(150% 150% at 50% 100%)"]
  );

  // Staggered fade in / scroll reveal variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Sequentially reveal
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
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
      id="about" 
      className="relative flex min-h-screen w-full items-center justify-center px-4 py-24 pb-32"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* viewport={{ once: true, margin: "-100px" }} triggers animation when in view */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Split Layout Left: Text Content */}
          <div className="flex flex-col space-y-6">
            <motion.h2 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
            >
              About Me.
            </motion.h2>
            
            <motion.div variants={itemVariants} className="space-y-4 text-gray-400 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-snug">
              <p>
                Hi! I am a passionate <span className="text-white font-medium">Computer Science student</span> currently studying at <span className="text-white font-medium">Universitas Pakuan</span>. 
              </p>
              <p>
                My journey in tech is driven by a deep curiosity for building scalable systems, crafting beautiful user interfaces, and exploring the cutting edge of AI.
              </p>
              <p>
                Currently, I am working as a <span className="text-white font-medium">Web Developer Intern</span> at <span className="text-cyan-400 font-medium cursor-default">AMANA Solution</span>, specifically within the <span className="text-white font-medium">PG Health division</span>, where I apply my technical skills to solve real-world problems.
              </p>
            </motion.div>
          </div>

          {/* Split Layout Right: Stylized Aesthetic Tech Card */}
          <motion.div 
            variants={itemVariants}
            className="relative w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md overflow-hidden group shadow-2xl"
          >
            {/* Subtle inner glowing gradient effect on hover to match Antigravity style */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[400px]">
              {/* Window Controls aesthetic */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <p className="text-xs text-gray-500 font-mono">dimas_profile.ts</p>
              </div>

              {/* Skills/Tech items in a sleek layout */}
              <div className="flex-1 mt-8 mb-4 flex flex-col justify-center space-y-6">
                <div className="flex items-center space-x-4 p-2 rounded-2xl transition-colors hover:bg-white/5">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Terminal className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">Frontend & Web</h3>
                    <p className="text-sm text-gray-400">Next.js, React, Tailwind CSS</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-2 rounded-2xl transition-colors hover:bg-white/5">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Database className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">Cloud & ML</h3>
                    <p className="text-sm text-gray-400">AWS Infrastructure, Data Analysis</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-2 rounded-2xl transition-colors hover:bg-white/5">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Code2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">Cyber Security</h3>
                    <p className="text-sm text-gray-400">Security Fundamentals & Implementation</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
