"use client"

import { useEffect } from "react"

// This function creates a smoother scrolling experience
export function useSmoothScroll() {
  useEffect(() => {
    // Check if the browser supports smooth scrolling natively
    if ("scrollBehavior" in document.documentElement.style) {
      return
    }

    // For browsers that don't support smooth scrolling, implement it
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest("a[href^='#']")

      if (!anchor) return

      const targetId = anchor.getAttribute("href")
      if (!targetId || targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (!targetElement) return

      e.preventDefault()

      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY
      const startPosition = window.scrollY
      const distance = targetPosition - startPosition
      const duration = 1000 // ms
      let startTime: number | null = null

      function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)

        // Easing function: easeInOutQuad
        const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

        window.scrollTo(0, startPosition + distance * easeProgress)

        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        }
      }

      requestAnimationFrame(animation)
    }

    document.addEventListener("click", handleAnchorClick)
    return () => document.removeEventListener("click", handleAnchorClick)
  }, [])
}

// Function to scroll to an element with ID
export function scrollToElement(elementId: string, offset = 0) {
  const element = document.getElementById(elementId)
  if (!element) return

  const elementPosition = element.getBoundingClientRect().top + window.scrollY
  window.scrollTo({
    top: elementPosition - offset,
    behavior: "smooth",
  })
}
