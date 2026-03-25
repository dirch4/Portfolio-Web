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

async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(csvUrl, { next: { revalidate: 60 } });

    if (!response.ok) {
      console.error("Failed to fetch CSV:", response.statusText);
      return [];
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

    return projects;
  } catch (error) {
    console.error("Error fetching/parsing projects CSV:", error);
    return [];
  }
}

export default async function ProjectsSection() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return null; // Jangan render section jika tidak ada data
  }

  return <ProjectsCarousel projects={projects} />;
}
