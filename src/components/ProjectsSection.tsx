import Papa from "papaparse";
import ProjectsCarousel from "./ProjectsCarousel";
import type { Project } from "./ProjectsCarousel";

const csvUrl =
  "https://docs.google.com/spreadsheets/export?format=csv&id=1XDw5iVWgNFtjNVteZukDQs6o3OLRvH140GZMxi2gTFc&gid=0";

// Interface CSV mentah dari Google Sheets sebelum dipetakan
interface RawRow {
  id?: string;
  title?: string;
  description?: string;
  techStack?: string;
  image?: string;
  link_live?: string;
  link_repo?: string;
}

// ─── FALLBACK DATA ───
// Digunakan jika Google Sheets down, rate-limited, atau timeout.
// Website tidak akan pernah kosong melompong.
const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "E-Commerce App",
    description:
      "A full-stack e-commerce platform with real-time inventory management, Stripe payment integration, and an admin dashboard for analytics.",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe"],
    image: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
    link_live: null,
    link_repo: null,
  },
  {
    id: 2,
    title: "Data Dashboard",
    description:
      "An interactive data visualization dashboard powered by machine learning models, featuring real-time charts, anomaly detection, and PDF report generation.",
    techStack: ["React", "Python", "TensorFlow", "D3.js", "FastAPI"],
    image: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%)",
    link_live: null,
    link_repo: null,
  },
];

async function getProjects(): Promise<Project[]> {
  try {
    // ─── ABORT CONTROLLER (5s Timeout) ───
    // Menjaga Time to First Byte (TTFB) agar tidak tergantung pada kecepatan Google Sheets.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(csvUrl, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("Failed to fetch CSV:", response.statusText);
      return fallbackProjects;
    }

    const csvText = await response.text();
    const parsed = Papa.parse<RawRow>(csvText, { header: true, skipEmptyLines: true });

    const projects: Project[] = parsed.data.map((row, index) => ({
      id: row.id ? Number(row.id) : index + 1,
      title: row.title?.trim() || "Untitled Project",
      description: row.description?.trim() || "",
      techStack: row.techStack
        ? row.techStack.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
      image: row.image?.trim() || "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
      link_live: row.link_live && row.link_live.trim() !== "-" && row.link_live.trim() !== ""
        ? row.link_live.trim()
        : null,
      link_repo: row.link_repo && row.link_repo.trim() !== "-" && row.link_repo.trim() !== ""
        ? row.link_repo.trim()
        : null,
    }));

    // Jika CSV parse berhasil tapi datanya kosong, gunakan fallback
    return projects.length > 0 ? projects : fallbackProjects;
  } catch (error) {
    // AbortError (timeout) atau network error → fallback
    console.error("Error fetching/parsing projects CSV:", error);
    return fallbackProjects;
  }
}

export default async function ProjectsSection() {
  const projects = await getProjects();

  return <ProjectsCarousel projects={projects} />;
}

