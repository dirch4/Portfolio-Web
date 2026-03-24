import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechStack from "@/components/TechStack";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full relative">
      <HeroSection />
      <AboutSection />
      <TechStack />
      <ExperienceSection />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
