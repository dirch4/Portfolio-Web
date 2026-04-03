"use client";

import { useEffect, useRef } from "react";

const techLogos = [
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-plain.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg",
];

// ─── OPTIMASI 1: Pre-rendering SVG → Bitmap (Offscreen Canvas Cache) ───
// Rasterisasi vektor SVG ke bitmap SEKALI saat load, 
// sehingga draw loop hanya menyalin piksel (sangat murah).
const CACHE_SIZE = 150; // px — resolusi bitmap cache

function createCachedBitmap(img: HTMLImageElement): HTMLCanvasElement {
  const offscreen = document.createElement("canvas");
  offscreen.width = CACHE_SIZE;
  offscreen.height = CACHE_SIZE;
  const offCtx = offscreen.getContext("2d")!;
  offCtx.drawImage(img, 0, 0, CACHE_SIZE, CACHE_SIZE);
  return offscreen;
}

// ─── Tipe Partikel (struct tetap, zero-alloc) ───
interface Particle {
  startX: number;
  startY: number;
  angle: number;       // Disimpan agar resize bisa rekalkulasi
  distMul: number;     // Random distance multiplier
  x: number;
  y: number;
  scale: number;
  rotate: number;
  cachedCanvas: HTMLCanvasElement | null;
  timeOffset: number;
}

export default function RollingTechWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // alpha: true agar background halaman tembus (transparan)
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let cw = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let ch = (canvas.height = canvas.parentElement?.clientHeight || 500);
    let radius = Math.max(cw, ch);

    // ─── Load Images + Buat Bitmap Cache ───
    const cachedBitmaps: HTMLCanvasElement[] = [];
    let loadedCount = 0;

    const images = techLogos.map((src, idx) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Wajib agar offscreen canvas tidak tainted
      img.onload = () => {
        cachedBitmaps[idx] = createCachedBitmap(img);
        loadedCount++;
        // Setelah SEMUA logo ter-cache, pasang bitmap ke setiap partikel
        if (loadedCount === techLogos.length) {
          for (let i = 0; i < numParticles; i++) {
            particles[i].cachedCanvas = cachedBitmaps[particles[i]._imgIdx];
          }
        }
      };
      img.src = src;
      return img;
    });

    // ─── Inisialisasi Partikel (sekali saja, zero-alloc di runtime) ───
    const numParticles = 150;
    const duration = 5;
    const particles: (Particle & { _imgIdx: number })[] = [];

    for (let i = 0; i < numParticles; i++) {
      const imgIdx = Math.floor(Math.random() * images.length);
      const angle = Math.random() * Math.PI * 2;
      const distMul = 1 + Math.random() * 0.5;
      const startX = Math.cos(angle) * radius * distMul;
      const startY = Math.sin(angle) * radius * distMul;

      particles.push({
        startX,
        startY,
        angle,
        distMul,
        x: 0,
        y: 0,
        scale: 0,
        rotate: 0,
        cachedCanvas: null, // Akan diisi setelah semua gambar selesai di-load
        timeOffset: Math.random() * duration,
        _imgIdx: imgIdx,
      });
    }

    // ─── Variabel Pra-alokasi untuk Draw Loop (Zero GC) ───
    let animationFrameId = 0;
    const startTime = performance.now();
    // Konstanta pra-hitung agar tidak menghitung ulang tiap frame
    const halfPI = Math.PI / 2;
    const baseSize = 130;

    // ─── DRAW LOOP — ZERO ALLOCATION ───
    const draw = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;

      // Update posisi setiap partikel (mutasi in-place, zero object creation)
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        const localTime = (elapsed + p.timeOffset) % duration;
        const progress = localTime / duration;
        const ease = Math.sin(progress * halfPI);
        const invEase = 1 - ease;

        p.x = p.startX * invEase;
        p.y = p.startY * invEase;
        p.scale = 1.1 * invEase;
        p.rotate = -3 * ease;
      }

      // ─── OPTIMASI 2: Sort In-Place (tanpa spread operator [...]) ───
      particles.sort((a, b) => a.scale - b.scale);

      // Bersihkan layar
      ctx.clearRect(0, 0, cw, ch);

      // Pusat layar — dihitung sekali per frame, bukan per partikel
      const cx = cw / 2;
      const cy = ch / 2;

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        if (!p.cachedCanvas) continue; // Bitmap belum siap

        const renderSize = baseSize * p.scale;
        if (renderSize < 1) continue; // Terlalu kecil, skip

        const halfSize = renderSize / 2;

        // ─── OPTIMASI 3: Manual Matrix Transform ───
        // Menggunakan setTransform + precomputed cos/sin 
        // BUKAN save/restore + rotate yang mahal
        const cosR = Math.cos(p.rotate);
        const sinR = Math.sin(p.rotate);
        const tx = cx + p.x;
        const ty = cy + p.y;

        // setTransform(a, b, c, d, e, f) = [cosR, sinR, -sinR, cosR, tx, ty]
        // Ini menggabungkan translate + rotate dalam SATU operasi matriks
        ctx.setTransform(cosR, sinR, -sinR, cosR, tx, ty);

        // Gambar bitmap cache (BUKAN SVG mentah!)
        ctx.drawImage(
          p.cachedCanvas,
          -halfSize,
          -halfSize,
          renderSize,
          renderSize
        );
      }

      // Reset transform matriks di akhir frame
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    // ─── OPTIMASI 4: Debounced Resize (200ms) ───
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cw = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        ch = canvas.height = canvas.parentElement?.clientHeight || 500;
        radius = Math.max(cw, ch);

        // Rekalkulasi posisi awal berdasarkan angle/distMul yang tersimpan
        for (let i = 0; i < numParticles; i++) {
          const p = particles[i];
          p.startX = Math.cos(p.angle) * radius * p.distMul;
          p.startY = Math.sin(p.angle) * radius * p.distMul;
        }
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-visible bg-transparent">
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-auto cursor-crosshair"
      />
    </div>
  );
}