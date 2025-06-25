"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface ParallaxStarsProps {
  layerCount?: number
  starsPerLayer?: number
  speedFactor?: number
  className?: string
}

export default function ParallaxStars({
  layerCount = 5,
  starsPerLayer = 30,
  speedFactor = 0.5,
  className = "",
}: ParallaxStarsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement[][]>([])
  const { theme } = useTheme()
  const [scrollY, setScrollY] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  // Initialize star layers
  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous stars
    containerRef.current.innerHTML = ""
    starsRef.current = []

    // Set window dimensions
    setWindowWidth(window.innerWidth)
    setWindowHeight(window.innerHeight)

    // Create layers with different depths
    for (let layer = 0; layer < layerCount; layer++) {
      const layerElement = document.createElement("div")
      layerElement.className = "absolute inset-0 pointer-events-none"
      layerElement.style.zIndex = `${layer}`
      containerRef.current.appendChild(layerElement)

      const layerStars: HTMLDivElement[] = []
      starsRef.current[layer] = layerStars

      // Calculate layer-specific properties
      const layerDepth = (layer + 1) / layerCount
      const layerSpeed = speedFactor * (1 - layerDepth) * 2 // Deeper layers move slower
      const starSize = 0.5 + layerDepth * 2 // Deeper layers have smaller stars
      const starOpacity = 0.3 + layerDepth * 0.7 // Deeper layers are more transparent
      const starCount = Math.floor(starsPerLayer * (1 + (layerCount - layer) / layerCount))

      // Create stars for this layer
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div")
        star.className = "absolute rounded-full"

        // Random position
        const x = Math.random() * 100
        const y = Math.random() * 100

        // Random size with layer influence
        const size = starSize * (Math.random() * 0.5 + 0.75)

        // Random brightness with layer influence
        const brightness = Math.random() * 0.4 + 0.6

        // Apply styles
        star.style.left = `${x}%`
        star.style.top = `${y}%`
        star.style.width = `${size}px`
        star.style.height = `${size}px`
        star.style.backgroundColor = `rgba(255, 255, 255, ${starOpacity * brightness})`
        star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${starOpacity * brightness * 0.5})`
        star.style.transform = "translate3d(0, 0, 0)"
        star.dataset.x = x.toString()
        star.dataset.y = y.toString()
        star.dataset.speed = layerSpeed.toString()

        layerElement.appendChild(star)
        layerStars.push(star)
      }
    }

    // Initial position update
    updateStarPositions(0)
  }, [layerCount, starsPerLayer, speedFactor, theme])

  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      updateStarPositions(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [windowHeight, windowWidth])

  // Update star positions based on scroll
  const updateStarPositions = (currentScrollY: number) => {
    starsRef.current.forEach((layerStars, layerIndex) => {
      const layerDepth = (layerIndex + 1) / layerCount

      layerStars.forEach((star) => {
        if (!star.dataset.x || !star.dataset.y || !star.dataset.speed) return

        const speed = Number.parseFloat(star.dataset.speed)
        const baseX = Number.parseFloat(star.dataset.x)
        const baseY = Number.parseFloat(star.dataset.y)

        // Calculate parallax offsets
        const scrollPercent = currentScrollY / windowHeight
        const xOffset = Math.sin(scrollPercent * 0.2 + layerDepth * Math.PI) * speed * 5
        const yOffset = scrollPercent * speed * 20

        // Apply transform with hardware acceleration
        star.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`
      })
    })
  }

  // Add subtle twinkling animation to random stars
  useEffect(() => {
    if (starsRef.current.length === 0) return

    // Select random stars for twinkling
    const allStars = starsRef.current.flat()
    const twinkleCount = Math.floor(allStars.length * 0.3) // 30% of stars will twinkle

    for (let i = 0; i < twinkleCount; i++) {
      const randomIndex = Math.floor(Math.random() * allStars.length)
      const star = allStars[randomIndex]

      if (star) {
        // Add twinkling animation
        const duration = 3 + Math.random() * 7 // 3-10s
        const delay = Math.random() * 10 // 0-10s

        star.style.animation = `twinkle ${duration}s ease-in-out ${delay}s infinite`
      }
    }
  }, [starsRef.current])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ perspective: "1000px", perspectiveOrigin: "center" }}
      aria-hidden="true"
    />
  )
}
