"use client"

import Footer from "./footer"

export default function EnhancedFooter() {
  console.warn("EnhancedFooter is deprecated. Footer is now included in the root layout via LayoutClient.")
  return null
}

export { Footer as EnhancedFooter }
