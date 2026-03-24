"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ParticleGlobe from "@/components/ParticleGlobe";

export default function HeroSection() {
  // Staggered animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
      },
    },
  };

  // Individual item animation (slide up and fade in)
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Premium heavy ease-out curve matching Flerdesign
      },
    },
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 overflow-hidden pt-20 bg-transparent">
      {/* Latar Belakang 3D Sphere Particle Wavy Math */}
      <ParticleGlobe />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="z-10 text-center w-full max-w-5xl mx-auto flex flex-col items-center"
      >
        <motion.h1
          variants={itemVariants}
          className="mb-6 font-medium tracking-tighter text-zinc-900 dark:text-zinc-50 text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
        >
          Hi, I&apos;m Dimas.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-12 text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto"
        >
          Crafting digital experiences. Software Engineer | AI Engineer.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link 
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <button className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 px-8 py-4 text-sm md:text-base font-medium text-zinc-900 dark:text-white backdrop-blur-md transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/30 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] cursor-none">
              {/* Top and Bottom Glowing Lines on Hover */}
              <span className="absolute inset-x-0 -top-px mx-auto h-[2px] w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <span className="absolute inset-x-0 -bottom-px mx-auto h-[2px] w-1/2 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              
              Explore My Work
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
