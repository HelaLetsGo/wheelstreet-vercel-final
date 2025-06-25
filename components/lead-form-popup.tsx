"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import EnhancedLeadForm from "./enhanced-lead-form"
import { trackLeadConversion } from "@/lib/tracking-utils"

interface LeadFormPopupProps {
  isOpen: boolean
  onClose: () => void
  defaultInterest?: string
}

export default function LeadFormPopup({ isOpen, onClose, defaultInterest }: LeadFormPopupProps) {
  // Close on escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when popup is open
      document.body.style.overflow = "hidden"
      document.body.style.height = "100vh"
      document.documentElement.style.overflow = "hidden"
    } else {
      // Restore scrolling when popup is closed
      document.body.style.overflow = ""
      document.body.style.height = ""
      document.documentElement.style.overflow = ""
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
      document.body.style.height = ""
      document.documentElement.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Add this function after the useEffect hook
  const handleFormSuccess = () => {
    trackLeadConversion()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring", damping: 20, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg mx-auto my-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxHeight: 'calc(100vh - 2rem)',
              transform: 'translate3d(0, 0, 0)' // Force hardware acceleration
            }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition-all hover:bg-black/60 hover:scale-110 border border-white/20"
              aria-label="Close form"
            >
              <X size={20} />
            </button>

            <div className="bg-black/90 border border-white/20 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden">
              <EnhancedLeadForm
                className=""
                onSuccess={handleFormSuccess}
                defaultInterest={defaultInterest}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
