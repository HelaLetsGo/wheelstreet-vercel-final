"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function StarlightEffect() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.innerHTML = ""

    // Number of stars - keep it minimal
    const starCount = 80

    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.classList.add("star")

      // Random position
      const x = Math.random() * 100
      const y = Math.random() * 100

      // Random size (mostly small)
      const size =
        Math.random() < 0.9
          ? Math.random() * 1.5 + 0.5
          : // 90% small stars (0.5px - 2px)
            Math.random() * 2 + 2 // 10% larger stars (2px - 4px)

      // Random animation duration and delay
      const duration = Math.random() * 8 + 4 // 4-12s
      const delay = Math.random() * 10 // 0-10s
      const travelDistance = Math.random() * 10 - 5 // -5px to 5px

      // Apply styles
      star.style.left = `${x}%`
      star.style.top = `${y}%`
      star.style.width = `${size}px`
      star.style.height = `${size}px`
      star.style.setProperty("--duration", `${duration}s`)
      star.style.setProperty("--delay", `${delay}s`)
      star.style.setProperty("--travel-distance", `${travelDistance}px`)

      // Add to container
      container.appendChild(star)
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [theme]) // Recreate stars when theme changes

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true" />
}
