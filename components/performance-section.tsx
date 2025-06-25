"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useInView, useAnimation } from "framer-motion"

export default function PerformanceSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: 0.3 + i * 0.2,
        duration: 0.8,
      },
    }),
  }

  const performanceStats = [
    { value: "3.2", unit: "SEC", label: "0-100 KM/H" },
    { value: "325", unit: "KM/H", label: "TOP SPEED" },
    { value: "850", unit: "NM", label: "TORQUE" },
    { value: "620", unit: "HP", label: "POWER" },
  ]

  return (
    <section id="performance" className="relative overflow-hidden bg-zinc-900 py-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="/performance-bg.jpg"
          alt="Performance"
          fill
          className="object-cover object-center opacity-30"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-2">
          <div ref={ref}>
            <motion.h2
              initial="hidden"
              animate={controls}
              variants={variants}
              className="mb-4 text-3xl font-bold uppercase tracking-tight md:text-4xl"
            >
              ENGINEERED FOR PERFORMANCE
            </motion.h2>
            <motion.p
              initial="hidden"
              animate={controls}
              variants={{
                ...variants,
                visible: {
                  ...variants.visible,
                  transition: { delay: 0.2, duration: 0.8 },
                },
              }}
              className="mb-8 max-w-xl text-lg text-white/70"
            >
              Every LUXAUTO is meticulously crafted to deliver uncompromising performance. From the precision-engineered
              powertrain to the aerodynamically optimized body, each component works in perfect harmony to create an
              extraordinary driving experience.
            </motion.p>

            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                ...variants,
                visible: {
                  ...variants.visible,
                  transition: { delay: 0.4, duration: 0.8 },
                },
              }}
            >
              <button className="border border-white bg-transparent px-8 py-3 text-sm uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black">
                Explore Technology
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {performanceStats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate={controls}
                variants={statsVariants}
                className="flex flex-col items-center justify-center border border-white/20 bg-black/30 p-6 backdrop-blur-sm"
              >
                <span className="text-4xl font-bold md:text-5xl">{stat.value}</span>
                <span className="mb-2 text-sm font-light">{stat.unit}</span>
                <span className="text-center text-xs uppercase tracking-wider text-white/60">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
