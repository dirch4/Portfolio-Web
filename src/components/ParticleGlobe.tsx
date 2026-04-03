"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

const ParticleMesh = ({ themeColor }: { themeColor: string }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Menggunakan 5000 partikel, optimasi murni memungkinkan kita meningkatkan kepadatan
  const count = 5000;
  
  const { positions, originalPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribusi bola seragam (fibonacci sphere logic / random spherical)
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 2.2; // Radius bola

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return { positions, originalPositions };
  }, [count]);

  // Vektor lerp kursor mentah untuk pergerakan halus (Pointer Tracking)
  const mouseLerped = useRef(new THREE.Vector2(0, 0));
  
  // Arsitektur Physics Array: menampung posisi "aktual" partikel tiap frame
  // agar transisi terdorong & kembali bisa dieksekusi perlahan layaknya karet (spring/lerp)
  const currentPositions = useRef(new Float32Array(count * 3));
  
  useEffect(() => {
     for (let i = 0; i < count * 3; i++) {
         currentPositions.current[i] = originalPositions[i];
     }
  }, [originalPositions, count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Ekstrak koordinat normalisasi pointer dari Three.js (-1 ke 1)
    const targetX = state.pointer.x;
    const targetY = state.pointer.y;

    // Soft-lerp koordinat mouse target
    mouseLerped.current.lerp(new THREE.Vector2(targetX, targetY), 0.1);

    const time = state.clock.elapsedTime;
    const { width, height } = state.viewport;
    
    // Mentranslasikan skala kursor agar selaras presisi dengan bentangan kamera 3D di ekuator Z=0
    const mx = mouseLerped.current.x * (width / 2);
    const my = mouseLerped.current.y * (height / 2);

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Konstanta Rotasi Globe (Dipindahkan dari Object3D ke Matematika Vektor 
    // agar kalkulasi tabrakan kursor akurat secara live space)
    const rotSpeedY = 0.05;
    const rotSpeedX = 0.02;
    const cy = Math.cos(time * rotSpeedY);
    const sy = Math.sin(time * rotSpeedY);
    const cx = Math.cos(time * rotSpeedX);
    const sx = Math.sin(time * rotSpeedX);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];
        
        // 1. Logika Wavy Math (Gelombang Antigravity Alami)
        const waveX = Math.sin(ox * 2 + time * 1.5) * 0.1;
        const waveY = Math.cos(oy * 2 + time * 1.5) * 0.1;
        const waveZ = Math.sin(oz * 2 + time * 1.5) * 0.1;
        const scale = 1 + waveX + waveY + waveZ;
        
        const bx = ox * scale;
        const by = oy * scale;
        const bz = oz * scale;
        
        // 2. Evaluasi Matrix Rotasi Global Tanpa Menyentuh Object3D Canvas
        const rx = bx * cy + bz * sy;
        const rz = -bx * sy + bz * cy;
        const ry = by * cx - rz * sx;
        const finalZ = by * sx + rz * cx;
        const finalX = rx;
        const finalY = ry;

        // Base target position jika tidak ada gangguan
        let targetPosX = finalX;
        let targetPosY = finalY;
        let targetPosZ = finalZ;

        // 3. Sensor Gaya Tolak (Repulsion Mechanics)
        const dx = finalX - mx;
        const dy = finalY - my;
        const distSq = dx * dx + dy * dy;
        const repelRadius = 1.6; // Luas area sebaran gaya tolak kursor
        const repelRadiusSq = repelRadius * repelRadius;
        
        if (distSq < repelRadiusSq) {
            const dist = Math.sqrt(distSq);
            // Kalkulasi percepatan: semakin di tengah zona mouse, dorongan ke luar eksponensial lebih besar
            const force = (repelRadius - dist) / repelRadius;
            const pushFactor = force * 1.5; 
            
            // Injeksi dorongan Radial
            targetPosX += (dx / dist) * pushFactor;
            targetPosY += (dy / dist) * pushFactor;
            targetPosZ += pushFactor * 0.5; // Mengembung sedikit ke hadapan kamera
        }

        // 4. Logika Pemulihan Elastis (Spring Physics)
        // Transisi partikel mengejar target posisi tanpa lompatan patah-patah (Zero GPU Allocations)
        currentPositions.current[i3] += (targetPosX - currentPositions.current[i3]) * 0.12;
        currentPositions.current[i3 + 1] += (targetPosY - currentPositions.current[i3 + 1]) * 0.12;
        currentPositions.current[i3 + 2] += (targetPosZ - currentPositions.current[i3 + 2]) * 0.12;

        positionsArray[i3] = currentPositions.current[i3];
        positionsArray[i3 + 1] = currentPositions.current[i3 + 1];
        positionsArray[i3 + 2] = currentPositions.current[i3 + 2];
    }
    
    // Intervensi final mengirimkan buffer ke kartu grafis
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
            attach="attributes-position" 
            args={[positions, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.015} // Halus dan artistik
        color={themeColor} 
        transparent={true} 
        opacity={0.65} 
        sizeAttenuation={true}
        depthWrite={false} // Atrium penting stabilitas tumpang-tindih alpha clip
      />
    </points>
  );
};

export default function ParticleGlobe() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Warna Zinc-700 di Light Mode (lebih gelap agar kontras), Zinc-400 di Dark Mode
  const particleColor = mounted && resolvedTheme === "light" ? "#3f3f46" : "#a1a1aa";

  return (
    // Dihilangkan status pointer-events-none agar lapisan mesh ini dapat mendeteksi interaksi kursor melayang murni
    <div className="absolute inset-0 z-0">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }} 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true }} 
      >
         <ParticleMesh themeColor={particleColor} />
      </Canvas>
    </div>
  );
}
