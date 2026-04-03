"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";
import Image from "next/image";

// Helper: menentukan apakah string image adalah URL eksternal atau path lokal
function isImageUrl(src: string): boolean {
  return src.startsWith("http") || src.startsWith("/");
}

// Interface Project yang diterima dari Server Component
export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  link_live: string | null;
  link_repo: string | null;
}

interface ProjectsCarouselProps {
  projects: Project[];
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

          {/* Projects Container (Framer Motion Drag) */}
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
                  className="group relative flex flex-col shrink-0 w-[85vw] sm:w-[350px] lg:w-[400px] overflow-hidden bg-glass border border-glass rounded-[2rem] backdrop-blur-md transition-colors duration-500 hover:bg-zinc-100 dark:hover:bg-white/5 will-change-transform transform-gpu select-none"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Image / Header Media */}
                  <div className="relative h-64 sm:h-72 w-full p-2 overflow-hidden rounded-t-[2rem] pointer-events-none">
                    <div className="absolute inset-2 rounded-3xl overflow-hidden">
                      {isImageUrl(project.image) ? (
                        <Image
                          src={project.image}
                          alt={`Screenshot of ${project.title}`}
                          fill
                          sizes="(max-width: 640px) 85vw, 400px"
                          draggable={false}
                          priority={index < 2}
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div 
                          className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" 
                          style={{ background: project.image }} 
                        />
                      )}
                    </div>
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

      {/* Floating Hover Badge */}
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

      {/* Split Modal Animasi */}
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

              {/* Sisi Kiri / Media Container + Tombol Aksi */}
              <div 
                className="w-full md:w-5/12 lg:w-1/2 h-80 md:h-auto shrink-0 relative flex flex-col justify-end p-6 md:p-8 lg:p-12"
              >
                {/* Background Image */}
                {isImageUrl(selectedProject.image) ? (
                  <Image
                    src={selectedProject.image}
                    alt={`Screenshot of ${selectedProject.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div 
                    className="absolute inset-0 w-full h-full" 
                    style={{ background: selectedProject.image }}
                  />
                )}
                
                {/* Gradient gelap di bawah untuk kontras tombol */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Tombol Aksi - Floating di pojok kiri bawah gambar (Conditional) */}
                <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-auto pt-10">
                  {selectedProject.link_live && (
                    <a 
                      href={selectedProject.link_live} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-cursor="hover" 
                      className="group flex items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium backdrop-blur-md transition-all shadow-xl"
                    >
                      <span>View Live Site</span>
                      <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  )}
                  {selectedProject.link_repo && (
                    <a 
                      href={selectedProject.link_repo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-cursor="hover" 
                      className="group flex items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white/90 hover:text-white font-medium backdrop-blur-md transition-all shadow-xl"
                    >
                      <Github className="w-4 h-4" />
                      <span>Repository</span>
                    </a>
                  )}
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
