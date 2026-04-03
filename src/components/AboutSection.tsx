"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Terminal, Code2, Database } from "lucide-react";

import RollingTechWheel from "./RollingTechWheel";

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
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              About Me.
            </motion.h2>
            
            <motion.div variants={itemVariants} className="space-y-4 text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-snug">
              <p>
                Hi! I am a passionate <span className="text-zinc-900 dark:text-zinc-50 font-medium">Computer Science student</span> currently studying at <span className="text-zinc-900 dark:text-zinc-50 font-medium">Universitas Pakuan</span>. 
              </p>
              <p>
                My journey in tech is driven by a deep curiosity for building scalable systems, crafting beautiful user interfaces, and exploring the cutting edge of AI.
              </p>
              <p>
                Currently, I am working as a <span className="text-zinc-900 dark:text-zinc-50 font-medium">Web Developer Intern</span> at <span className="text-cyan-600 dark:text-cyan-400 font-medium cursor-default">AMANA Solution</span>, specifically within the <span className="text-zinc-900 dark:text-zinc-50 font-medium">PG Health division</span>, where I apply my technical skills to solve real-world problems.
              </p>
            </motion.div>
          </div>

          {/* Split Layout Right: 3D Rolling Tech Wheel */}
          <motion.div 
            variants={itemVariants}
            className="w-full h-full flex items-center justify-center"
          >
            <RollingTechWheel />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
