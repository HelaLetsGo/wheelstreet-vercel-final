"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { trackLeadConversion } from "@/lib/tracking-utils"
import { Button } from "@/components/ui/button"

interface EnhancedLeadFormProps {
  className?: string
  variant?: "light" | "dark"
  onSuccess?: () => void
  defaultInterest?: string
}

export default function EnhancedLeadForm({
  className,
  variant = "dark",
  onSuccess,
  defaultInterest,
}: EnhancedLeadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: defaultInterest || "",
    message: "", // Add message field
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serviceOptions, setServiceOptions] = useState<{ id: string; title: string }[]>([])
  
  // Create Supabase client
  const supabase = (() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('Enhanced Lead Form - Env check:', {
      hasUrl: !!url,
      hasKey: !!key,
      urlValue: url,
      keyLength: key?.length
    })
    
    if (!url || !key) {
      console.error('Missing Supabase environment variables in Enhanced Lead Form')
      return null
    }
    
    try {
      return createBrowserClient(url, key)
    } catch (error) {
      console.error('Failed to create Supabase client in Enhanced Lead Form:', error)
      return null
    }
  })()

  // Fetch service options from Supabase
  useEffect(() => {
    const fetchServiceOptions = async () => {
      if (!supabase) {
        // Fallback service options when Supabase is not available
        setServiceOptions([
          { id: "acquisition", title: "Automobilių įsigijimas" },
          { id: "financing", title: "Finansavimas" },
          { id: "insurance", title: "Draudimas" },
          { id: "ev", title: "Elektromobiliai" },
          { id: "other", title: "Kita paslauga" }
        ])
        return
      }

      try {
        const { data, error } = await supabase
          .from("service_tabs")
          .select("tab_id, title")
          .order("display_order")
          .eq("is_active", true)

        if (error) throw error

        if (data) {
          setServiceOptions(
            data.map((item) => ({
              id: item.tab_id,
              title: item.title,
            })),
          )
        }
      } catch (err) {
        console.error("Error fetching service options:", err)
      }
    }

    fetchServiceOptions()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!supabase) {
        // Fallback when Supabase is not available (during build or missing env vars)
        console.log("Form submission (build mode):", formData)
        throw new Error("Service temporarily unavailable. Please try again later.")
      }

      // Submit form data to Supabase
      const { error: supabaseError } = await supabase.from("leads").insert([
        {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          interest: formData.interest || null,
          message: formData.message || null, // Add message field
          status: "new",
        },
      ])

      if (supabaseError) {
        throw supabaseError
      }

      setIsSubmitted(true)
      trackLeadConversion()

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          interest: "",
          message: "",
        })
      }, 5000)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(`Įvyko klaida siunčiant formą: ${err.message || JSON.stringify(err)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const textColor = variant === "light" ? "text-zinc-900" : "text-white"
  const textColorSecondary = variant === "light" ? "text-zinc-700" : "text-white/80"
  const textColorTertiary = variant === "light" ? "text-zinc-500" : "text-white/60"
  const borderColor = variant === "light" ? "border-zinc-300" : "border-white/20"
  const inputBg = variant === "light" ? "bg-white/90" : "bg-black/30"
  const buttonBg =
    variant === "light" ? "bg-zinc-900 text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-white/90"

  return (
    <div className={cn("p-6 sm:p-8", className)}>
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={cn("mb-1 text-xl sm:text-2xl font-bold", textColor)}>Gauti individualų pasiūlymą</h3>
            <p className={cn("mb-4 sm:mb-6 text-xs sm:text-sm", textColorSecondary)}>
              Užpildykite užklausos formą ir gaukite asmeniškai pritaikytą pasiūlymą per 24 valandas.
            </p>
            <div
              className={cn(
                "mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs",
                textColorTertiary,
              )}
            >
              <span className="mb-1 sm:mb-0">Žirmūnų g. 139-303, Vilnius</span>
              <a href="tel:+37061033377" className="hover:text-white/80">
                +37061033377
              </a>
            </div>

            {error && (
              <div className="mb-4 rounded-sm bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className={cn("font-medium mb-1 block text-sm", textColor)}>
                  Vardas
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={cn(
                    "border w-full rounded-md px-3 h-10 sm:h-11 placeholder:text-zinc-400/50 text-sm",
                    borderColor,
                    inputBg,
                    textColor,
                  )}
                  placeholder="Jūsų vardas"
                />
              </div>

              <div>
                <label htmlFor="email" className={cn("font-medium mb-1 block text-sm", textColor)}>
                  El. paštas
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "border w-full rounded-md px-3 h-10 sm:h-11 placeholder:text-zinc-400/50 text-sm",
                    borderColor,
                    inputBg,
                    textColor,
                  )}
                  placeholder="jusu@pastas.lt"
                />
              </div>

              <div>
                <label htmlFor="phone" className={cn("font-medium mb-1 block text-sm", textColor)}>
                  Telefono numeris
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={cn(
                    "border w-full rounded-md px-3 h-10 sm:h-11 placeholder:text-zinc-400/50 text-sm",
                    borderColor,
                    inputBg,
                    textColor,
                  )}
                  placeholder="+370 6XX XXXXX"
                />
              </div>

              <div>
                <label htmlFor="interest" className={cn("font-medium mb-1 block text-sm", textColor)}>
                  Dominanti paslauga
                </label>
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className={cn(
                    "border w-full rounded-md px-3 h-10 sm:h-11 text-sm appearance-none",
                    borderColor,
                    inputBg,
                    textColor,
                  )}
                >
                  <option value="" disabled>
                    Pasirinkite paslaugą
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className={cn("font-medium mb-1 block text-sm", textColor)}>
                  Kliento žinutė (neprivaloma)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className={cn(
                    "border w-full rounded-md px-3 py-2 h-24 placeholder:text-zinc-400/50 text-sm resize-none",
                    borderColor,
                    inputBg,
                    textColor,
                  )}
                  placeholder="Papildoma informacija apie automobilį ar pageidaujamą paslaugą..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 sm:h-12 mt-2 text-sm font-medium bg-white text-black hover:bg-gray-100 border border-white/20 shadow-lg transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Siunčiama...
                  </span>
                ) : (
                  "Gauti nemokamą konsultaciją"
                )}
              </Button>

              <p className={cn("text-center text-xs mt-2", textColorTertiary)}>
                Pateikdami asmens duomenis sutinkate su mūsų{" "}
                <a href="/privacy" className="underline hover:text-white">
                  privatumo politika
                </a>
              </p>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-8 sm:py-12 text-center"
          >
            <div className="mx-auto mb-4 sm:mb-6 flex h-16 sm:h-20 w-16 sm:w-20 items-center justify-center rounded-full bg-green-500/20">
              <Check className="h-8 sm:h-10 w-8 sm:w-10 text-green-500" />
            </div>
            <h3 className={cn("mb-2 sm:mb-3 text-xl sm:text-2xl font-bold", textColor)}>Nuoširdžiai dėkojame!</h3>
            <p className={cn("text-sm sm:text-base", textColorSecondary)}>
              Mūsų specialistas su Jumis susisieks artimiausiu metu ir suteiks išsamią konsultaciją.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
