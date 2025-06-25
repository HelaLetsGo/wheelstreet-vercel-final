"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { trackLeadConversion } from "@/lib/tracking-utils"

export default function LeadCaptureFormInline() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "", // Add message field
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serviceOptions, setServiceOptions] = useState<{ id: string; title: string }[]>([])

  // Fetch service options from Supabase
  useEffect(() => {
    const fetchServiceOptions = async () => {
      try {
        const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
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
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      console.log("Submitting form data:", formData)

      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      // Submit form data to Supabase
      const { data, error: supabaseError } = await supabase.from("leads").insert([
        {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          interest: formData.interest || null,
          message: formData.message || null, // Add message field
          status: "new",
        },
      ])

      console.log("Supabase response:", { data, error: supabaseError })

      if (supabaseError) {
        throw supabaseError
      }

      // If successful, show success message
      setIsSubmitted(true)
      trackLeadConversion()

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

  return (
    <div className="rounded-sm border border-white/20 bg-black/60 p-4 sm:p-6 md:p-8 backdrop-blur-md">
      {!isSubmitted ? (
        <>
          <h3 className="mb-1 text-xl sm:text-2xl font-bold text-white">Gaukite pasiūlymą</h3>
          <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-white/80">
            Užpildykite formą ir gaukite individualų pasiūlymą per 24 val.
          </p>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-white/60">
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
              <Label htmlFor="name" className="text-white/90 font-medium mb-1 block text-sm">
                Vardas
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-white/20 bg-black/30 text-white h-10 sm:h-11 placeholder:text-white/50 text-sm w-full"
                placeholder="Jūsų vardas"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white/90 font-medium mb-1 block text-sm">
                El. paštas
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="border-white/20 bg-black/30 text-white h-10 sm:h-11 placeholder:text-white/50 text-sm w-full"
                placeholder="jusu@pastas.lt"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white/90 font-medium mb-1 block text-sm">
                Telefono numeris
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border-white/20 bg-black/30 text-white h-10 sm:h-11 placeholder:text-white/50 text-sm w-full"
                placeholder="+370 6XX XXXXX"
              />
            </div>

            <div>
              <Label htmlFor="interest" className="text-white/90 font-medium mb-1 block text-sm">
                Dominanti paslauga
              </Label>
              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="border-white/20 bg-black/30 text-white h-10 sm:h-11 text-sm w-full rounded-md px-3"
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
              <Label htmlFor="message" className="text-white/90 font-medium mb-1 block text-sm">
                Kliento žinutė (neprivaloma)
              </Label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                className="border-white/20 bg-black/30 text-white h-24 placeholder:text-white/50 text-sm w-full rounded-md px-3 py-2 resize-none"
                placeholder="Papildoma informacija apie automobilį ar pageidaujamą paslaugą..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-white/90 transition-colors h-10 sm:h-12 mt-2 text-sm"
            >
              {isSubmitting ? "Siunčiama..." : "Gauti nemokamą pasiūlymą"}
            </Button>

            <p className="text-center text-xs text-white/50 mt-2">
              Pateikdami duomenis sutinkate su mūsų{" "}
              <a href="/privacy" className="underline hover:text-white">
                privatumo politika
              </a>
            </p>
          </form>
        </>
      ) : (
        <div className="py-8 sm:py-12 text-center">
          <div className="mx-auto mb-4 sm:mb-6 flex h-16 sm:h-20 w-16 sm:w-20 items-center justify-center rounded-full bg-green-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 sm:h-10 w-8 sm:w-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold text-white">Dėkojame!</h3>
          <p className="text-sm sm:text-base text-white/80">Mūsų konsultantas susisieks su jumis artimiausiu metu.</p>
        </div>
      )}
    </div>
  )
}
