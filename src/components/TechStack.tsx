"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const expertise = [
  {
    title: "Frontend & Full-Stack Web",
    tech: "React.js, Next.js, Tailwind CSS, Express.js, MongoDB.",
    desc: "Focus on clean and responsive architecture."
  },
  {
    title: "Machine Learning & AI",
    tech: "Python, TensorFlow, Data Preprocessing, Model Training.",
    desc: "Focus on integrating AI into digital solutions."
  },
  {
    title: "Cloud Computing",
    tech: "Amazon Web Services (AWS)",
    desc: "Architecture & Deployment."
  },
  {
    title: "Cybersecurity",
    tech: "Data Security",
    desc: "System Integrity."
  }
];

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll hanya pada area kontainer SVG timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section id="tech-stack" className="relative w-full py-32 bg-transparent overflow-hidden">
      
      {/* 1. PEMISAHAN HEADING - Bebas dari jeratan tumpang tindih SVG */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-24 md:mb-32 relative z-20">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">Expertise & Stack.</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto">
            A comprehensive arsenal of languages, frameworks, and tools defining my engineering capabilities.
          </p>
        </motion.div>
      </div>

      {/* 2. KONTAINER UTAMA TIMELINE (Center-Axis Layout) */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-5xl mx-auto h-[130vh] md:h-[150vh] py-10"
      >
        {/* --- PITA BEZIER TUNGGAL LENGKUNG LEBAR (Single Continuous Smooth Curve) --- */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-0" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          {/* Masking sempurna agar garis tidak putus-putus akibat vectorEffect */}
          <defs>
            <clipPath id="reveal-mask">
              <motion.rect x="0" y="0" width="100%" style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }} />
            </clipPath>
          </defs>
          <path 
            /*
              Penciptaan Alur Pita Berkelanjutan (Mendekati Kartu):
              - M 50 0 -> Mulai di tengah atas.
              - C -10 6.25, -10 6.25, 50 12.5 -> Melebar drastis ke KIRI (mencapai X=5%), persis menyapu di belakang Kartu 0.
              - S 110 31.25, 50 37.5 -> Memantul drastis ke KANAN (mencapai X=95%), menyapu di belakang Kartu 1.
              - S -10 56.25, 50 62.5 -> Melebar drastis ke KIRI.
              - S 110 81.25, 50 87.5 -> Melebar drastis ke KANAN.
              - S -10 100, 50 100 -> Turun drastis ke KIRI dan berakhir.
            */
            d="M 50 0 
               C -10 6.25, -10 6.25, 50 12.5 
               S 110 31.25, 50 37.5 
               S -10 56.25, 50 62.5 
               S 110 81.25, 50 87.5 
               S -10 100, 50 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            // Mengubah warna menjadi netral agar menyatu elegan dengan background situs
            className="text-zinc-300 dark:text-zinc-800"
            style={{ 
              clipPath: "url(#reveal-mask)", 
            }} 
          />
        </svg>

        {/* --- CENTER-AXIS KARTU KEAHLIAN --- */}
        {expertise.map((item, index) => {
          const isLeftCol = index % 2 === 0;
          
          // Y-Kordinat presisi mutlak menyamakan titik potong Bezier SVG (12.5%, 37.5%, 62.5%, 87.5%)
          const topPercentages = [12.5, 37.5, 62.5, 87.5];
          const topPercentage = topPercentages[index];
          
          return (
            <div 
              key={index} 
              className="absolute w-full px-4 sm:px-12 md:px-0 flex items-center justify-center md:justify-between"
              style={{ 
                top: `${topPercentage}%`, 
                transform: 'translateY(-50%)' 
              }}
            >
              {/* KOLOM KIRI: Tempat Kartu Genap (atau dihilangkan visibilitasnya jika Ganjil di Desktop) */}
              <div 
                className={`w-full md:w-1/2 flex ${
                  isLeftCol ? 'md:justify-end md:pr-16' : 'hidden md:flex md:invisible'
                } relative z-10`}
              >
                {isLeftCol && (
                  <motion.div 
                    initial={{ opacity: 0, x: -50, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    data-cursor="hover"
                    className="w-full xl:w-[85%] flex flex-col p-8 md:p-10 bg-glass border border-glass rounded-[2rem] backdrop-blur-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.03]"
                  >
                    <h3 className="text-2xl font-medium text-zinc-900 dark:text-zinc-50 mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <div className="mb-4">
                      <h4 className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-2">Technologies</h4>
                      <p className="text-zinc-800 dark:text-zinc-200 font-medium">{item.tech}</p>
                    </div>
                    <div className="pt-4 border-t border-zinc-200 dark:border-white/10 mt-auto">
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* KOLOM KANAN: Tempat Kartu Ganjil (atau dihilangkan visibilitasnya jika Genap di Desktop) */}
              <div 
                className={`w-full md:w-1/2 flex ${
                  !isLeftCol ? 'md:justify-start md:pl-16' : 'hidden md:flex md:invisible'
                } relative z-10`}
              >
                {!isLeftCol && (
                  <motion.div 
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    data-cursor="hover"
                    className="w-full xl:w-[85%] flex flex-col p-8 md:p-10 bg-glass border border-glass rounded-[2rem] backdrop-blur-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.03]"
                  >
                    <h3 className="text-2xl font-medium text-zinc-900 dark:text-zinc-50 mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <div className="mb-4">
                      <h4 className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-2">Technologies</h4>
                      <p className="text-zinc-800 dark:text-zinc-200 font-medium">{item.tech}</p>
                    </div>
                    <div className="pt-4 border-t border-zinc-200 dark:border-white/10 mt-auto">
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
