# Project Blueprint: Premium Developer Portfolio

## 1. Project Overview
Create a modern, high-performance personal portfolio website for **Dimas**, a Web Developer and IT Student. 
The design must merge two specific aesthetic references:
1. **Flerdesign (flerdesign.com):** Premium, smooth scroll animations, large bold typography, high-end creative agency feel, and micro-interactions.
2. **Google Antigravity (antigravity.google):** Clean, modern tech aesthetic, dark mode focus, glassmorphism, subtle glowing accents (gradients), and highly functional UI components.

## 2. Tech Stack Requirements
Please initialize and use the following stack:
* **Framework:** Next.js (App Router, TypeScript)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion (crucial for the Flerdesign smooth transitions)
* **UI Components:** Shadcn/ui (for clean, Antigravity-like components like cards, buttons, and dialogs)
* **Icons:** Lucide React
* **Deployment Ready:** Vercel/Google Cloud Run optimized

## 3. Design System & UI/UX Guidelines
* **Color Palette:** Deep dark background (e.g., `#09090B` or `#000000`). Use subtle neon/glowing gradients (like blue/purple or emerald/cyan) for hover states and borders to mimic the Antigravity tech vibe.
* **Typography:** Use a clean geometric sans-serif (like Inter or Geist) for body text, and a bold, modern display font (like Clash Display or Cal Sans) for large Flerdesign-style headings.
* **Animations:** Implement scroll-triggered fade-ins, staggered list reveals, and smooth page transitions using Framer Motion. Elements should feel like they have "weight" and slide into place elegantly.
* **UI Elements:** Use glassmorphism (`backdrop-blur`, semi-transparent borders) for navigation bars and project cards. 

## 4. Page Structure & Content Strategy

### A. Hero Section
* **Visual:** Full-screen height (`min-h-screen`). A very large, bold Flerdesign-style typography entrance.
* **Content:** * "Hi, I'm Dimas."
  * Subtitle: "Crafting digital experiences. Software Engineer | AI Engineer."
* **Action:** A glowing, Antigravity-style CTA button saying "Explore My Work" that scrolls smoothly to the Projects section.
* **Background:** Subtle, slow-moving mesh gradient or subtle grid background.

### B. About Me Section
* **Layout:** Split layout (text on one side, a stylized tech-card on the other).
* **Content:** * Mention background as an IT student at Pakuan University.
  * Highlight current role as a Web Developer Intern at AMANA Solution (PG Health division).
  * Focus on a passion for building scalable web applications and exploring modern tech.

### C. Expertise & Tech Stack (Bento Box Layout)
* **Visual:** Use a modern "Bento Box" grid layout (very popular in tech sites) with glassmorphism cards.
* **Skills to highlight:** * Frontend & Web Development (Next.js, React, Tailwind)
  * Cloud Computing (AWS)
  * Data Analysis & Machine Learning
  * Cyber Security
* **Animation:** Each card should have a slight hover-lift effect and a subtle border glow on hover.

### D. Selected Works (Projects)
* **Visual:** Large Flerdesign-style project showcases. When hovering over a project image/card, the image should slightly scale up inside its container.
* **Layout:** Vertical list or alternating left-right layout for high impact. Include placeholder projects for:
  * 1. Web Development / E-commerce platform
  * 2. Data/Machine Learning Dashboard
  * 3. AWS Cloud Architecture Setup
* Include "View Project" links with an animated arrow icon `->`.

### E. Contact & Footer
* **Visual:** Minimalist. Large text saying "Let's Build Something Together."
* **Links:** GitHub, LinkedIn, Email.
* Include a clean copyright footer.

## 5. Execution Steps for Antigravity AI
1. **Initialize:** Set up the Next.js project with Tailwind CSS and TypeScript.
2. **Install Dependencies:** Add `framer-motion`, `lucide-react`, and configure Shadcn/ui.
3. **Global Layout:** Set up the dark mode theme, global font variables, and smooth scrolling in `globals.css`.
4. **Build Components:** Create modular components for `Hero`, `About`, `TechStack`, `Projects`, and `Footer`.
5. **Implement Animations:** Wrap elements in Framer Motion `<motion.div>` tags for scroll reveals.
6. **Review & Refine:** Ensure the blend of Flerdesign's typography/motion and Antigravity's glowing, clean UI is perfectly balanced. Do not use overly complex 3D libraries (like Three.js) yet; focus on top-tier 2D UI and motion.

## 6. Advanced Interactions & Animations

To fully capture the Antigravity and Flerdesign aesthetic, implement the following advanced interactive features:

### A. Antigravity-Style Cursor-Tracking Background Glow
* **Visual Effect:** A subtle, soft-glowing radial gradient that acts like a "flashlight," illuminating the dark background exactly where the user's mouse is hovering.
* **Technical Implementation:**
  * Create a fixed, full-screen background component.
  * Use React state or Framer Motion's `useMotionValue` to track `clientX` and `clientY` mouse events.
  * Apply these coordinates dynamically to a CSS `radial-gradient` (e.g., `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 40%)`).

### B. Custom Trailing Cursor Component
* **Visual Effect:** A custom geometric shape (like a delicate hollow circle or a glowing dot) that follows the actual mouse pointer with a smooth, fluid delay (spring physics).
* **Technical Implementation:**
  * Apply `cursor-none` to the global body (for desktop/non-touch devices only).
  * Build a `<CustomCursor />` component using **Framer Motion** (`useSpring` and `usePointerEvent` or `useEffect` tracking).
  * **Micro-interactions:** The cursor must react to the environment. When hovering over clickable elements (links, buttons, project cards), the custom cursor should scale up, change color, or apply a `mix-blend-mode: difference` effect for that premium agency feel.

### C. "Curve Swipe" Smooth Scrolling
* **Visual Effect:** Buttery smooth, inertia-based vertical scrolling that eliminates the jagged native browser scroll. Transitions between sections should feel fluid and curved.
* **Technical Implementation:**
  * **Core Scroll:** Install and configure **Lenis** (`@studio-freight/lenis` or `lenis` package) in the root layout for global smooth scrolling. Configure the lerp/easing to feel heavy and smooth.
  * **Curve Swipe Reveal:** When scrolling down to new sections (like the Projects or About section), use Framer Motion to create a curved reveal effect. You can achieve this using an SVG `<path>` that animates its curve (`d` attribute) from an upward arc to a flat line as it moves out of the way, or by using `clip-path: ellipse(...)` animations that expand as the section enters the viewport.