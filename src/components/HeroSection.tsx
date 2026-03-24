"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import ParticleGlobe from "@/components/ParticleGlobe";
import { useLoading } from "@/components/LoadingContext";

export default function HeroSection() {
  // Akses tema untuk fungsi trigger ulang animasi (Re-mount)
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isAppLoading } = useLoading();

  useEffect(() => {
    setMounted(true);
  }, []);

  const headingText = "Hi, I'm Dimas|";
  const letters = Array.from(headingText);

  // Stagger base untuk barisan ketikan mesin tik (Typewriter container)
  const typewriterContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.2, // Pangkas habis hard-delay 1.2s. Jeda nafas 0.2s pasca wipe iris preloader.
        staggerChildren: 0.05,
      },
    },
  };

  // Gerakan individu tiap karakter (timbul dari bawah)
  const letterVariant = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.15, ease: "easeOut" as const }
    },
  };

  // Elemen turunan sekunder (Paragraf & Tombol) yang muncul pudar setelah typewriter rampung
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.0, // Dipercepat! Disesuaikan dengan durasi typewriter (0.2s + 14*0.05 = 0.9s)
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      },
    },
  };

  return (
    <section id="home" className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 overflow-hidden pt-20 bg-transparent">
      {/* 
        Latar Belakang 3D Sphere Particle Wavy Math 
        Kanvas ini tidak dibungkus `key` tema, sehingga WebGL TIDAK TERHUKUM RENDER ULANG
        walau user menggonta-ganti latar Dark/Light berulang kali!
      */}
      <ParticleGlobe />

      {/* 
        SANGAT PENTING: Gunakan Unmount murni (!isAppLoading) ketimbang merubah prop `animate`. 
        Framer Motion sering kali gagal mendeteksi transisi stagger container jika dirender di awal
        bersama prop statis. Dengan merender ketika bernilai riil (false), 
        initial -> show akan dijamin 100% memompa iterasi anak-anaknya.
      */}
      {!isAppLoading && (
        <div 
          key={mounted ? resolvedTheme : "system"}
          className="z-10 text-center w-full max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.h1
            variants={typewriterContainer}
            initial="hidden"
            animate="show"
            className="mb-8 font-medium tracking-tighter text-zinc-900 dark:text-zinc-50 text-5xl sm:text-7xl md:text-8xl lg:text-9xl flex items-center justify-center"
          >
            {letters.map((letter, index) => {
              // Evaluasi apakah karakter ini adalah palang vertikal (|) dari ujung teks
              const isCursor = letter === "|";
              
              return (
                <motion.span 
                  key={index} 
                  variants={letterVariant}
                  className={isCursor ? "relative inline-flex font-light ml-1" : ""}
                >
                  {/* Huruf biasa atau spasi pengisi dimensi */}
                  <span className={isCursor ? "opacity-0" : ""}>
                    {letter === " " ? "\u00A0" : letter}
                  </span>

                  {/* Khusus untuk '|', letakkan lapisan berkedip di atasnya */}
                  {isCursor && (
                    <motion.span
                      initial={{ opacity: 1 }} // Harus 1 di awal agar saat parent memudar naik (typewriter), ia ikut terlihat
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.8, 
                        ease: "linear",
                        delay: 1.0 // Berkedip persis setelah huruf terakhir selesai diketik (disinkronkan ke 1.0s)
                      }}
                      className="absolute inset-0 text-zinc-900 dark:text-zinc-50"
                    >
                      |
                    </motion.span>
                  )}
                </motion.span>
              );
            })}
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            initial="hidden"
            animate="show"
            className="mb-12 mt-2 text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto"
          >
            Crafting digital experiences. Software Engineer | AI Engineer.
          </motion.p>

          <motion.div 
            variants={fadeUpVariant}
            initial="hidden"
            animate="show"
          >
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
        </div>
      )}
    </section>
  );
}
