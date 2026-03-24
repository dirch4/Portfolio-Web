"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";

// 1. Data Proyek (Placeholder)
const projects = [
  {
    id: 1,
    title: "Web E-commerce",
    description: "A high-performance modern e-commerce platform built with Next.js App Router and Stripe integration. Features a premium minimalist design, rapid page loads, and seamless checkout experience.\n\nThis project focuses on eliminating buyer friction through an optimized funnel, achieving a 40% increase in conversion rate. We integrated real-time inventory synchronizations with headless CMS backends, ensuring that the platform can scale gracefully during high-traffic holiday seasons without compromising the elegant UI/UX boundaries.",
    techStack: ["Next.js", "Tailwind CSS", "Stripe", "Prisma"],
    image: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)", 
  },
  {
    id: 2,
    title: "Data Dashboard",
    description: "An interactive analytics dashboard for visualizing complex datasets in real-time. Built with interactive charts and resilient data fetching mechanisms tracking thousands of daily events.\n\nThe architecture relies on WebSocket configurations to stream live metrics directly into the frontend state management system. Every component was engineered to maintain 60FPS animations even while processing dense data arrays, offering executives an uncompromised snapshot of their business health at a glance.",
    techStack: ["React", "Recharts", "TypeScript", "Tailwind CSS"],
    image: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)",
  },
  {
    id: 3,
    title: "AWS Architecture",
    description: "A robust, scalable cloud infrastructure setup using AWS serverless technologies to handle high concurrency and mission-critical data processing streams securely.\n\nMicroservices decouple heavy processes away from the user lifecycle, maintaining zero downtime even through massive load spikes. Redundancy schemas and advanced VPC setups protect sensitive user analytics behind layers of strict encryption.",
    techStack: ["AWS Lambda", "DynamoDB", "S3", "API Gateway"],
    image: "linear-gradient(135deg, #ec4899 0%, #d946ef 100%)",
  },
  {
    id: 4,
    title: "Mobile App UI/UX",
    description: "A comprehensive redesign of a fintech mobile application focusing on accessibility, fluid micro-interactions, and a sleek dark mode interface.\n\nEvery gradient, corner radius, and font weight was painstakingly audited to ensure compliance with strict WCAG standards while projecting an ultra-modern aesthetic. Prototyping advanced transitions proved vital to communicating complex financial transactions smoothly.",
    techStack: ["Figma", "Protopie", "SwiftUI", "Framer Motion"],
    image: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  },
  {
    id: 5,
    title: "REST API Development",
    description: "A secure, high-throughput RESTful API built for a SaaS platform. Features rate limiting, payload validation, and comprehensive Swagger documentation for developers.\n\nThis backend backbone acts as the absolute source of truth for all client-side applications. Caching strategies using Redis drastically lowered latency, allowing sub-50ms response times for critical endpoints. It was structured entirely on CI/CD principles for rapid automated testing and deployment.",
    techStack: ["Node.js", "Express", "PostgreSQL", "Redis"],
    image: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
  }
];

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [hoveredProjectTitle, setHoveredProjectTitle] = useState<string | null>(null);
  const isDragging = useRef(false);
  
  // Transisi curve scroll reveal ala section lainnya
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

  // Drag Carousel Logic
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    updateWidth();
    setTimeout(updateWidth, 200);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Kunci scroll halaman saat modal aktif (Scroll Lock)
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]);

  // Framer Motion badge tracker
  const badgeX = useMotionValue(-100);
  const badgeY = useMotionValue(-100);
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const badgeXSpring = useSpring(badgeX, springConfig);
  const badgeYSpring = useSpring(badgeY, springConfig);

  useEffect(() => {
    const moveBadge = (e: MouseEvent) => {
      badgeX.set(e.clientX + 24);
      badgeY.set(e.clientY - 48);
    };
    if (hoveredProjectTitle) {
      window.addEventListener("mousemove", moveBadge);
    }
    return () => {
      window.removeEventListener("mousemove", moveBadge);
    };
  }, [hoveredProjectTitle, badgeX, badgeY]);

  return (
    <>
      <motion.section 
        ref={containerRef}
        style={{ clipPath }}
        id="projects" 
        className="relative min-h-screen w-full py-24 pb-32 overflow-hidden"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col space-y-16">
          
          {/* Section Heading */}
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             className="text-center px-4 md:px-12"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">Selected Works.</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto">
              A showcase of my recent projects, blending functional precision with bold aesthetics.
            </p>
          </motion.div>

          {/* 2. Projects Container (Framer Motion Drag) */}
          {/* Menggunakan layout menyeluruh w-full overflow-hidden dan menghilangkan margin/padding luar ekstrem */}
          <div ref={carouselRef} className="flex w-full overflow-hidden pb-10">
            <motion.div 
              drag="x"
              dragConstraints={{ right: 0, left: -carouselWidth }}
              dragElastic={0.05}
              onDragStart={() => {
                isDragging.current = true;
              }}
              onDragEnd={() => {
                setTimeout(() => {
                  isDragging.current = false;
                }, 50);
              }}
              // Menambahkan justify-start dan pad kiri (dragger track area)
              className="flex flex-nowrap gap-6 lg:gap-8 w-max justify-start px-6 md:px-12 cursor-grab active:cursor-grabbing"
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px" }}
                  transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.4), ease: "easeOut" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredProjectTitle(project.title)}
                  onMouseLeave={() => setHoveredProjectTitle(null)}
                  onClick={() => {
                    if (isDragging.current) return;
                    setSelectedProject(project);
                  }}
                  data-cursor="project"
                  // Menambahkan select-none, transform-gpu, backface-hidden (via style backfaceVisibility / tailwind utilities)
                  className="group relative flex flex-col shrink-0 w-[85vw] sm:w-[350px] lg:w-[400px] overflow-hidden bg-glass border border-glass rounded-[2rem] backdrop-blur-md transition-colors duration-500 hover:bg-zinc-100 dark:hover:bg-white/5 will-change-transform transform-gpu select-none"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Image / Header Media */}
                  <div className="relative h-64 sm:h-72 w-full p-2 overflow-hidden rounded-t-[2rem] pointer-events-none">
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E" // Transparent spacer
                      alt={project.title}
                      draggable={false} // Cegah default image drag ghosting
                      className="absolute inset-2 rounded-3xl object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ background: project.image, width: "calc(100% - 16px)", height: "calc(100% - 16px)" }}
                    />
                  </div>

                  {/* Konten Kartu */}
                  <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between pointer-events-none">
                    <div>
                      <h3 className="text-2xl font-medium text-zinc-900 dark:text-zinc-50 mb-3">{project.title}</h3>
                      <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">{project.description}</p>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.slice(0, 2).map((tech, i) => (
                          <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 2 && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                            +{project.techStack.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Floating Hover Badge (Pindah keluar dari contianer hero agar terhindar z-index issues) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 dark:bg-cyan-500 text-white font-medium text-sm sm:text-base shadow-2xl whitespace-nowrap"
        style={{
          x: badgeXSpring,
          y: badgeYSpring,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: hoveredProjectTitle ? 1 : 0, 
          opacity: hoveredProjectTitle ? 1 : 0 
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        View {hoveredProjectTitle}
      </motion.div>

      {/* 4. Split Modal Animasi - Digeser keluar dari overflow trap clipPath Section */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedProject(null)} 
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()} 
              className="relative w-full max-w-6xl overflow-hidden bg-white dark:bg-[#09090b] border border-glass rounded-[2rem] shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                data-cursor="hover"
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 rounded-full bg-black/5 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-colors backdrop-blur-sm shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Sisi Kiri / Media Container (Sekarang berisi Tombol Aksi) */}
              <div 
                className="w-full md:w-5/12 lg:w-1/2 h-80 md:h-auto shrink-0 relative flex flex-col justify-end p-6 md:p-8 lg:p-12"
              >
                {/* Background Image Absolute */}
                <div 
                  className="absolute inset-0 w-full h-full object-cover" 
                  style={{ background: selectedProject.image }}
                />
                
                {/* Gradient gelap di bawah untuk kontras tombol */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Tombol Aksi - Floating di pojok kiri bawah gambar */}
                <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-auto pt-10">
                  <button data-cursor="hover" className="group flex items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium backdrop-blur-md transition-all shadow-xl">
                    <span>View Live Site</span>
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                  <button data-cursor="hover" className="group flex items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white/90 hover:text-white font-medium backdrop-blur-md transition-all shadow-xl">
                    <Github className="w-4 h-4" />
                    <span>Repository</span>
                  </button>
                </div>
              </div>

              {/* Sisi Kanan: Konten Teks */}
              <div 
                data-lenis-prevent="true" 
                className="w-full md:w-7/12 lg:w-1/2 p-6 pt-12 md:p-10 lg:p-16 flex flex-col justify-between max-h-[100vh] md:max-h-[85vh] overflow-y-auto pointer-events-auto"
              >
                <div className="mb-10 lg:mb-12">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
                    {selectedProject.title}
                  </h3>
                  
                  <div className="w-full max-w-lg mb-12">
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-10 whitespace-pre-line">
                      {selectedProject.description}
                    </p>

                    <div>
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest mb-4">Tech Specs</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.techStack.map((tech, i) => (
                          <span key={i} className="px-4 py-2 text-sm font-medium rounded-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
