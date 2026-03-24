"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  isAppLoading: boolean;
  setIsAppLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isAppLoading: true,
  setIsAppLoading: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  // Secara default aplikasi dirender memuat (sedang dikooptasi oleh Layar Booting)
  const [isAppLoading, setIsAppLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{ isAppLoading, setIsAppLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

// Hook pintar untuk menyerap status memuat secara global
export function useLoading() {
  return useContext(LoadingContext);
}
