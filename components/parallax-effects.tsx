"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface ParallaxItem {
  element: HTMLElement
  speed: number
  offset: number
  direction: "vertical" | "horizontal"
  invert?: boolean
}

export default function ParallaxEffects() {
  const { theme } = useTheme()
  const parallaxItems = useRef<ParallaxItem[]>([])
  const ticking = useRef(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    // Initialize parallax items
    setupParallaxItems()

    // Handle scroll events
    const handleScroll = () => {
      lastScrollY.current = window.scrollY

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          updateParallaxPositions(lastScrollY.current)
          ticking.current = false
        })

        ticking.current = true
      }
    }

    // Handle resize events
    const handleResize = () => {
      setupParallaxItems()
      updateParallaxPositions(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)

    // Initial update
    updateParallaxPositions(window.scrollY)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [theme])

  // Find and setup all parallax elements
  const setupParallaxItems = () => {
    // Reset items
    parallaxItems.current = []

    // Find all elements with data-parallax attribute
    const elements = document.querySelectorAll("[data-parallax]")

    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        const speed = Number.parseFloat(el.dataset.parallaxSpeed || "0.2")
        const offset = Number.parseFloat(el.dataset.parallaxOffset || "0")
        const direction = (el.dataset.parallaxDirection || "vertical") as "vertical" | "horizontal"
        const invert = el.dataset.parallaxInvert === "true"

        // Add to parallax items
        parallaxItems.current.push({
          element: el,
          speed,
          offset,
          direction,
          invert,
        })

        // Set initial styles for smooth transitions
        el.style.willChange = "transform"
        el.style.transition = "transform 0.1s linear"
        el.style.transform = "translate3d(0, 0, 0)"
      }
    })
  }

  // Update positions of all parallax items
  const updateParallaxPositions = (scrollY: number) => {
    const windowHeight = window.innerHeight

    parallaxItems.current.forEach((item) => {
      const rect = item.element.getBoundingClientRect()
      const elementCenter = rect.top + rect.height / 2
      const distanceFromCenter = elementCenter - windowHeight / 2
      const inViewport = rect.bottom > 0 && rect.top < windowHeight

      if (inViewport) {
        // Calculate parallax offset
        const scrollPercent = distanceFromCenter / windowHeight
        const moveAmount = scrollPercent * item.speed * 100 * (item.invert ? -1 : 1) + item.offset

        // Apply transform based on direction
        if (item.direction === "vertical") {
          item.element.style.transform = `translate3d(0, ${moveAmount}px, 0)`
        } else {
          item.element.style.transform = `translate3d(${moveAmount}px, 0, 0)`
        }
      }
    })
  }

  return null
}
