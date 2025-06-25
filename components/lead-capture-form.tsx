"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { trackLeadConversion } from "@/lib/tracking-utils"

interface LeadCaptureFormProps {
  isVisible: boolean
  onClose: () => void
}

export default function LeadCaptureForm({ isVisible, onClose }: LeadCaptureFormProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, interest: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
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

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        onClose()
        setFormData({
          name: "",
          email: "",
          phone: "",
          interest: "",
          message: "",
        })
      }, 3000)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("Įvyko klaida siunčiant formą. Prašome pabandyti vėliau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300",
        isVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm dark:bg-background/80" onClick={onClose}></div>

      <div className="relative w-full max-w-md rounded-sm border border-border bg-card p-8 shadow-xl">
        <div className="absolute left-4 top-4 flex items-center text-xs text-foreground/50">
          <span>Wheel Street • +37061033377</span>
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-foreground/70 transition-colors hover:text-foreground"
          aria-label="Close form"
        >
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <>
            <h3 className="mb-1 text-2xl font-bold">Išskirtinis pasiūlymas</h3>
            <p className="mb-8 text-sm text-foreground/70">
              Užpildykite formą ir mūsų asmeninis konsultantas paruoš jums individualų pasiūlymą per 24 valandas.
            </p>

            {error && (
              <div className="mb-4 rounded-sm bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-foreground/90 font-medium mb-1 block">
                  Vardas Pavardė
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-input bg-background text-foreground h-11"
                  placeholder="Jūsų pilnas vardas"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground/90 font-medium mb-1 block">
                  Elektroninis paštas
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-input bg-background text-foreground h-11"
                  placeholder="jusu@pastas.lt"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground/90 font-medium mb-1 block">
                  Telefono numeris
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="border-input bg-background text-foreground h-11"
                  placeholder="+370 6XX XXXXX"
                />
              </div>

              <div>
                <Label htmlFor="interest" className="text-foreground/90 font-medium mb-1 block">
                  Dominanti paslauga
                </Label>
                <Select onValueChange={handleSelectChange} value={formData.interest}>
                  <SelectTrigger className="border-input bg-background text-foreground h-11">
                    <SelectValue placeholder="Pasirinkite paslaugą" />
                  </SelectTrigger>
                  <SelectContent className="border-input bg-card text-foreground">
                    <SelectItem value="acquisition">Automobilių įsigijimas</SelectItem>
                    <SelectItem value="financing">Finansavimas</SelectItem>
                    <SelectItem value="insurance">Draudimas</SelectItem>
                    <SelectItem value="exchange">Automobilių keitimas</SelectItem>
                    <SelectItem value="ev">Elektromobilių sprendimai</SelectItem>
                    <SelectItem value="other">Kita paslauga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message" className="text-foreground/90 font-medium mb-1 block">
                  Kliento žinutė (neprivaloma)
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className="border-input bg-background text-foreground h-24 resize-none"
                  placeholder="Papildoma informacija apie automobilį ar pageidaujamą paslaugą..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors h-12 mt-2"
              >
                {isSubmitting ? "Siunčiama..." : "Gauti asmeninį pasiūlymą"}
              </Button>

              <p className="text-center text-xs text-foreground/50 mt-2">
                Pateikdami duomenis sutinkate su mūsų{" "}
                <a href="#" className="underline hover:text-foreground">
                  privatumo politika
                </a>
              </p>
            </form>
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-bold">Dėkojame už užklausą!</h3>
            <p className="text-foreground/70">Mūsų asmeninis konsultantas susisieks su jumis artimiausiu metu.</p>
          </div>
        )}
      </div>
    </div>
  )
}
