import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechStack from "@/components/TechStack";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full relative">
      <HeroSection />
      <AboutSection />
      <TechStack />
      <Footer />
    </main>
  );
}
