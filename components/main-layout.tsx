"use client"

import type { ReactNode } from "react"

interface MainLayoutProps {
  children: ReactNode
}

// This component is deprecated and should not be used.
// The layout is now handled by the root layout.tsx file.
export default function MainLayout({ children }: MainLayoutProps) {
  console.warn("MainLayout is deprecated. Layout is now handled by the root layout.tsx file.")
  return <>{children}</>
}
