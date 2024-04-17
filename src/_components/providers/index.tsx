"use client"

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import CreateServerModal from "@/_components/modals/create-server-modal";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


export const ModalProvider = () => {
  
  const [isMounted, seTisMounted] = useState(false);
  useEffect(() => {
    seTisMounted(true);
  }, []);
  if(!isMounted) return null;
  
  return (
    <>
      <CreateServerModal/>
    </>
  );
}

