"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Mail, Linkedin, Phone } from "lucide-react"
import { formatTeamMemberImagePath } from "@/lib/image-utils"
import { useState, useEffect } from "react"

export default function TeamSection() {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true)

        // Fetch team members from API route
        const response = await fetch("/api/team-members")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch team members")
        }

        const data = await response.json()
        console.log("Fetched team members:", data.teamMembers)
        setTeamMembers(data.teamMembers || [])
      } catch (err) {
        console.error("Error fetching team members:", err)
        setError(err.message || "Failed to fetch team members")

        // Fallback to static data if fetch fails
        setTeamMembers([
          {
            member_id: "julius-jankauskas",
            name: "Julius Jankauskas",
            position: "CEO",
            image_path: "/team/julius-jankauskas.jpg",
            contact: {
              email: "julius@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          {
            member_id: "vainius-mirskis",
            name: "Vainius Mirskis",
            position: "COO",
            image_path: "/team/vainius-mirskis.jpg",
            contact: {
              email: "vainius@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          {
            member_id: "juras-lukas-kremensas",
            name: "Juras Lukas Kremensas",
            position: "Pardavimų ekspertas",
            image_path: "/team/juras-lukas-kremensas.jpeg",
            contact: {
              email: "juras@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          {
            member_id: "karolis-murachimovas",
            name: "Karolis Murachimovas",
            position: "Pardavimų ekspertas",
            image_path: "/team/karolis-murachimovas.jpeg",
            contact: {
              email: "karolis@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          {
            member_id: "mantas-jauga",
            name: "Mantas Jauga",
            position: "Pardavimų ekspertas",
            image_path: "/team/mantas-jauga.jpg",
            contact: {
              email: "mantas@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          {
            member_id: "martynas-linge",
            name: "Martynas Lingė",
            position: "Vizualinės komunikacijos ekspertas",
            image_path: "/team/martynas-linge.jpg",
            contact: {
              email: "martynas@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          {
            member_id: "nedas-mockevicius",
            name: "Nedas Mockevičius",
            position: "Pardavimų ekspertas",
            image_path: "/team/nedas-mockevicius.jpg",
            contact: {
              email: "nedas@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          {
            member_id: "nikita-kovalenkov",
            name: "Nikita Kovalenkov",
            position: "Pardavimų ekspertas",
            image_path: "/team/nikita-kovalenkov.jpeg",
            contact: {
              email: "nikita@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          {
            member_id: "vytautas-balodas",
            name: "Vytautas Balodas",
            position: "Pardavimų ekspertas",
            image_path: "/team/vytautas-balodas.jpg",
            contact: {
              email: "vytautas@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  // Handle contact actions
  const handleEmailClick = (e: React.MouseEvent, email: string) => {
    e.stopPropagation() // Prevent card click
    window.location.href = `mailto:${email}`
  }

  const handlePhoneClick = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation() // Prevent card click
    window.location.href = `tel:${phone}`
  }

  const handleLinkedinClick = (e: React.MouseEvent, linkedin: string) => {
    e.stopPropagation() // Prevent card click
    window.open(`https://${linkedin}`, "_blank", "noopener,noreferrer")
  }

  const navigateToMember = (id: string) => {
    router.push(`/team/${id}`)
  }

  if (loading) {
    return (
      <div className="py-16 md:py-24 relative">
        <div className="relative z-10 mx-auto max-w-[1800px] px-6 md:px-10">
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight md:text-4xl text-center sm:text-left">
            MŪSŲ KOMANDA
          </h2>
          <p className="mb-12 max-w-2xl text-base text-foreground/70 md:text-lg text-center sm:text-left mx-auto sm:mx-0">
            Kraunama...
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-sm border border-border bg-custom-card-bg p-0 overflow-hidden animate-pulse"
              >
                <div className="relative aspect-square w-full bg-gray-300"></div>
                <div className="p-6 text-center">
                  <div className="h-6 bg-gray-300 rounded mb-2 mx-auto w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4 mx-auto w-1/2"></div>
                  <div className="flex space-x-3 justify-center">
                    <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                    <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error && teamMembers.length === 0) {
    return (
      <div className="py-16 md:py-24 relative">
        <div className="relative z-10 mx-auto max-w-[1800px] px-6 md:px-10">
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight md:text-4xl text-center">MŪSŲ KOMANDA</h2>
          <p className="mb-6 text-base text-red-400 md:text-lg text-center mx-auto">
            Nepavyko užkrauti komandos narių. Bandykite vėliau.
          </p>
          <p className="text-sm text-foreground/50 text-center">Klaida: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div id="team" className="py-16 md:py-24 relative">
      <div className="relative z-10 mx-auto max-w-[1800px] px-6 md:px-10">
        <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight md:text-4xl text-center sm:text-left">
          MŪSŲ KOMANDA
        </h2>
        <p className="mb-12 max-w-2xl text-base text-foreground/70 md:text-lg text-center sm:text-left mx-auto sm:mx-0">
          Susipažinkite su mūsų profesionalų komanda, kuri padės jums rasti ir įsigyti tinkamą automobilį.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => {
            // Format the image path correctly for all team members
            const imagePath = formatTeamMemberImagePath(member.image_path)
            
            // Debug logging for problematic members
            if (member.name?.includes('Juras') || member.name?.includes('Karolis')) {
              console.log(`🔍 Debug ${member.name}:`, {
                originalPath: member.image_path,
                formattedPath: imagePath,
                memberId: member.member_id
              })
            }

            return (
              <div
                key={member.id || member.member_id}
                onClick={() => navigateToMember(member.member_id)}
                className="group cursor-pointer rounded-sm border border-border bg-custom-card-bg p-0 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
              >
                {/* Team member avatar - using object-position: top to ensure faces are visible */}
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={imagePath || "/team-placeholder.svg"}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full object-top transition-transform duration-300 group-hover:scale-105"
                    priority={false}
                    unoptimized={false}
                    onError={(e) => {
                      console.error(`Failed to load image: ${imagePath} for ${member.name}`)
                      const target = e.target as HTMLImageElement
                      target.src = '/team-placeholder.svg'
                    }}
                    onLoad={() => {
                      console.log(`Successfully loaded image: ${imagePath} for ${member.name}`)
                    }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold group-hover:text-primary">{member.name}</h3>
                  {member.position && <p className="text-sm text-foreground/60 mb-4">{member.position}</p>}

                  {member.contact && (
                    <div className="flex space-x-3 justify-center">
                      {member.contact.email && (
                        <button
                          onClick={(e) => handleEmailClick(e, member.contact.email)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-foreground/70 transition-colors hover:bg-primary/20 hover:text-foreground"
                          aria-label={`Email ${member.name}`}
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      )}
                      {member.contact.phone && (
                        <button
                          onClick={(e) => handlePhoneClick(e, member.contact.phone)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-foreground/70 transition-colors hover:bg-primary/20 hover:text-foreground"
                          aria-label={`Call ${member.name}`}
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                      )}
                      {member.contact.linkedin && (
                        <button
                          onClick={(e) => handleLinkedinClick(e, member.contact.linkedin)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-foreground/70 transition-colors hover:bg-primary/20 hover:text-foreground"
                          aria-label={`${member.name}'s LinkedIn profile`}
                        >
                          <Linkedin className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
