"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "@/components/LoadingContext";

const greetings = [
  "Hello", // English
  "Bonjour", // French
  "Hola", // Spanish
  "Ciao", // Italian
  "こんにちは", // Japanese
  "Halo" // Indonesian
];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsAppLoading } = useLoading();

  // Scroll lock system
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      // Tunggu hingga animasi wipe selesai sebelum membuka kunci gulir halaman
      const timeout = setTimeout(() => {
        document.body.style.overflow = "";
        window.scrollTo(0, 0); 
        // Lapor ke Context Global web bahwa rintangan UI sudah bersih
        setIsAppLoading(false);
      }, 1000); 
      return () => clearTimeout(timeout);
    }
  }, [isLoading, setIsAppLoading]);

  // Rotator bahasa otomatis
  useEffect(() => {
    // Apabila tiba di salam terakhir ("Halo")
    if (index === greetings.length - 1) {
      // Layar menunggu sejenak meresapi "Halo" lalu mengeksekusi exit shrink wipe
      const endTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 600); 
      return () => clearTimeout(endTimeout);
    }

    // Interval staccato kilat antar-translasi
    const timer = setTimeout(
      () => {
        setIndex(index + 1);
      },
      index === 0 ? 800 : 150 // Kecepatan premium: lambat di awal (800ms), melesat super cepat di tengah (150ms)
    );

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
           key="preloader" // Identifier krusial untuk unmount trigger di Framer Motion
           // Iris Wipe Exit: menyusut menjadi titik lensa mungil dan menghilang bagai lubang hitam
           initial={{ clipPath: "circle(150% at 50% 50%)" }}
           exit={{ clipPath: "circle(0% at 50% 50%)" }}
           // Easing kubik yang mensimulasikan percepatan gravitasi sinematik seperti iOS
           transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
           className="fixed inset-0 z-[10000] flex items-center justify-center bg-zinc-50 dark:bg-zinc-50"
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 absolute"
            >
              {greetings[index]}
            </motion.h1>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
