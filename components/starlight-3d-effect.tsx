"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import * as THREE from "three"

export default function Starlight3DEffect() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    // Setup
    const container = containerRef.current
    const width = window.innerWidth
    const height = window.innerHeight

    // Create scene
    const scene = new THREE.Scene()

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 50

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Create stars
    const starCount = 200
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    const starPositions = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)
    const starColors = new Float32Array(starCount * 3)
    const starSpeeds = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3

      // Position
      starPositions[i3] = (Math.random() - 0.5) * 100 // x
      starPositions[i3 + 1] = (Math.random() - 0.5) * 100 // y
      starPositions[i3 + 2] = (Math.random() - 0.5) * 50 // z

      // Size
      starSizes[i] = Math.random() * 1.5 + 0.2

      // Color (white with slight variations)
      starColors[i3] = 0.9 + Math.random() * 0.1 // r
      starColors[i3 + 1] = 0.9 + Math.random() * 0.1 // g
      starColors[i3 + 2] = 0.9 + Math.random() * 0.1 // b

      // Speed
      starSpeeds[i] = Math.random() * 0.02 + 0.005
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute("size", new THREE.BufferAttribute(starSizes, 1))
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3))

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate stars slowly
      stars.rotation.x += 0.0003
      stars.rotation.y += 0.0002

      // Twinkle effect
      const positions = starGeometry.attributes.position.array
      const sizes = starGeometry.attributes.size.array

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3

        // Subtle position change
        positions[i3 + 2] += Math.sin(Date.now() * starSpeeds[i]) * 0.01

        // Size pulsing
        sizes[i] = (Math.sin(Date.now() * starSpeeds[i] * 0.5) * 0.5 + 1) * starSizes[i]
      }

      starGeometry.attributes.position.needsUpdate = true
      starGeometry.attributes.size.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      container.removeChild(renderer.domElement)
      scene.remove(stars)
      starGeometry.dispose()
      starMaterial.dispose()
    }
  }, [theme])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" aria-hidden="true" />
}
