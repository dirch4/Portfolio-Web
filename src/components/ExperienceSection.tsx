"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const experiences = [
  {
    company: "AMANA Solution",
    role: "Web Developer Internship",
    date: "Des 2025 - Present",
    description: "Built responsive web apps, conducted testing & debugging to resolve UI/system bugs. Collaborated with cross-functional teams to elevate user experience."
  },
  {
    company: "Ministry of Health RI",
    role: "Web Developer Internship",
    date: "Aug 2025 - Nov 2025",
    description: "Developed sandbox kemkes using React.js, Express.js, MongoDB for digital health services. Ensured high reliability and strict data handling processes passing national standards."
  },
  {
    company: "Timedoor Academy",
    role: "Part-Time Programming Teacher",
    date: "Apr 2025 - Present",
    description: "Teach coding (Block-based to Custom JS) to students aged 5-18. Developed curriculum adaptations to simplify complex computing logic for younger audiences."
  },
  {
    company: "DBS Foundation Coding Camp",
    role: "Machine Learning Cohort",
    date: "Feb 2025 - Jul 2025",
    description: "Acted as ML Engineer & PM. Developed a recommendation system integrating AI into modern web technologies to serve personalized content streams."
  },
  {
    company: "PT Lingkar Sembilan Tititan Media",
    role: "Software Engineer Intern",
    date: "Aug 2021 - Oct 2021",
    description: "Led a software team to develop a geo-coordinate based attendance tracking website, ensuring robust location tracking and offline-first capabilities."
  }
];

export default function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll on the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Curve background transition (menyamakan pola dari komponen lain)
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["ellipse(150% 150% at 50% 0%)", "ellipse(150% 150% at 50% 100%)"]
  );

  return (
    <motion.section 
      ref={containerRef} 
      id="experience" 
      // Hapus margin bottom yang berlebihan dan atur padding
      className="relative w-full pb-[10vh] bg-transparent" 
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-16">
        {/* Section Heading */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="mb-8"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">Work Experience.</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl max-w-2xl">
            My professional journey and the roles that shaped my engineering mindset over the past few years.
          </p>
        </motion.div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative">
        {experiences.map((exp, i) => {
          // targetScale membuat tumpukan terlihat lebih kecil di belakang
          const targetScale = 1 - ((experiences.length - i) * 0.05);
          return (
            <ExperienceCard 
              key={i} 
              i={i} 
              exp={exp} 
              progress={scrollYProgress} 
              // Setiap kartu memiliki trigger range yang berbeda saat page discroll
              range={[i * (1 / experiences.length), 1]} 
              targetScale={targetScale} 
            />
          );
        })}
      </div>
    </motion.section>
  );
}

interface ExperienceCardProps {
  i: number;
  exp: typeof experiences[0];
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
}

const ExperienceCard = ({ i, exp, progress, range, targetScale }: ExperienceCardProps) => {
  // UseTransform shrink and darken
  const scale = useTransform(progress, range, [1, targetScale]);
  const opacity = useTransform(progress, range, [1, 0.4]);

  return (
    <div 
      // Kunci utama Sticky Stacking: Tinggi yang cukup (min-h-screen) dan `sticky` dengan `top` yang dinamis
      className="min-h-screen w-full flex items-start justify-center sticky z-10"
      style={{ top: `calc(15vh + ${i * 30}px)` }}
    >
      <motion.div 
        style={{ scale, opacity }} 
        // Desain Flerdesign glassmorphism + padding lebar
        className="relative flex flex-col md:flex-row w-full max-w-6xl p-8 sm:p-10 md:p-12 gap-8 md:gap-12 bg-glass border border-glass rounded-[2rem] md:rounded-[3rem] shadow-xl backdrop-blur-2xl origin-top will-change-transform transform-gpu"
      >
        {/* Kiri: Tahun / Tanggal (20%) */}
        <div className="w-full md:w-[20%] shrink-0">
          <p className="text-sm md:text-base font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pt-2">
            {exp.date}
          </p>
        </div>

        {/* Tengah: Role (40%) */}
        <div className="w-full md:w-[40%] shrink-0">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-zinc-900 dark:text-zinc-50 leading-tight">
            {exp.role}
          </h3>
        </div>

        {/* Kanan: Company & Desc (40%) */}
        <div className="w-full md:w-[40%] flex flex-col gap-4 pt-1 border-t border-zinc-200 dark:border-white/10 md:border-none pt-4 md:pt-1 mt-4 md:mt-0">
          <h4 className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {exp.company}
          </h4>
          <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed">
            {exp.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
