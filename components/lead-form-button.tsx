"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import LeadFormPopup from "./lead-form-popup"

interface LeadFormButtonProps {
  text: string
  className?: string
  defaultInterest?: string
}

export default function LeadFormButton({ text, className, defaultInterest }: LeadFormButtonProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsPopupOpen(true)}
        className={cn("inline-flex items-center justify-center min-h-[44px] transition-all duration-200", className)}
      >
        {text}
      </button>

      <LeadFormPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} defaultInterest={defaultInterest} />
    </>
  )
}
