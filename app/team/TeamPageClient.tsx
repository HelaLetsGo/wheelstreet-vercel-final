"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, Loader2 } from "lucide-react"
import { formatTeamMemberImagePath } from "@/lib/image-utils"

export default function TeamPageClient() {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true)
        console.log("Fetching team members...")

        // Fetch team members from API route
        const response = await fetch("/api/team-members")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch team members")
        }

        const data = await response.json()
        console.log("Team members fetched:", data.teamMembers)
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
            member_id: "mantas-jauga",
            name: "Mantas Jauga",
            position: "Pardavimų vadybininkas",
            image_path: "/team/mantas-jauga.jpg",
            contact: {
              email: "mantas@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          {
            member_id: "vytautas-balodas",
            name: "Vytautas Balodas",
            position: "Pardavimų vadybininkas",
            image_path: "/team/vytautas-balodas.jpg",
            contact: {
              email: "vytautas@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          {
            member_id: "nedas-mockevicius",
            name: "Nedas Mockevičius",
            position: "Pardavimų vadybininkas",
            image_path: "/team/nedas-mockevicius.jpg",
            contact: {
              email: "nedas@wheelstreet.lt",
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
            member_id: "juras-lukas-kremensas",
            name: "Juras Lukas Kremensas",
            position: "Pardavimų ekspertas",
            image_path: "/team/juras-lukas-kremensas.jpeg",
            contact: {
              email: "juras@wheelstreet.lt",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (error && teamMembers.length === 0) {
    return (
      <div className="min-h-screen pt-32">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="p-6 border border-red-500/30 bg-red-500/10 rounded-md text-center">
            <h2 className="text-xl font-bold text-red-300 mb-2">Error Loading Team Members</h2>
            <p className="text-white/70">{error}</p>
            <p className="mt-4 text-white/70">Please try again later or contact support.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-10">
        <h1 className="mb-6 sm:mb-8 text-3xl sm:text-4xl font-bold text-center sm:text-left">Mūsų komanda</h1>
        <p className="mb-10 sm:mb-12 max-w-2xl text-foreground/70 text-center sm:text-left mx-auto sm:mx-0">
          Susipažinkite su WHEELSTREET ekspertų komanda, kuri kiekvieną dieną dirba, kad užtikrintų jums išskirtinę
          patirtį ir aukščiausios kokybės paslaugas automobilių pasaulyje.
        </p>

        <div className="mb-16 rounded-sm border border-border p-8">
          <h2 className="mb-6 text-xl font-bold text-center sm:text-left">Kodėl verta rinktis mus?</h2>
          <p className="text-foreground/80 text-center sm:text-left">
            Mūsų komandos nariai turi ilgametę patirtį automobilių sektoriuje ir puikiai išmano rinką. Kiekvienas
            komandos narys yra savo srities ekspertas, galintis suteikti profesionalias konsultacijas ir padėti priimti
            geriausią sprendimą renkantis automobilį.
          </p>
        </div>

        {teamMembers.length === 0 ? (
          <div className="p-6 border border-border bg-background/30 rounded-md text-center">
            <p className="text-foreground/70">Šiuo metu komandos narių sąrašas tuščias.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => {
              // Format the image path correctly for all team members
              const imagePath = formatTeamMemberImagePath(member.image_path)
              
              // Debug logging for problematic members
              if (member.name?.includes('Juras') || member.name?.includes('Karolis')) {
                console.log(`🔍 TeamPage Debug ${member.name}:`, {
                  originalPath: member.image_path,
                  formattedPath: imagePath,
                  memberId: member.member_id
                })
              }

              return (
                <Link
                  key={member.id || member.member_id}
                  href={`/team/${member.member_id}`}
                  className="group rounded-sm border border-border bg-custom-card-bg p-0 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 w-full overflow-hidden"
                >
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
                        console.error(`TeamPage: Failed to load image: ${imagePath} for ${member.name}`)
                        const target = e.target as HTMLImageElement
                        target.src = '/team-placeholder.svg'
                      }}
                      onLoad={() => {
                        console.log(`TeamPage: Successfully loaded image: ${imagePath} for ${member.name}`)
                      }}
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold group-hover:text-primary">{member.name}</h3>
                    <p className="text-sm text-foreground/60 mb-4">{member.position}</p>

                    <div className="flex items-center justify-center">
                      <div className="flex space-x-3">
                        {member.contact?.email && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-foreground/70 transition-colors group-hover:bg-primary/20 group-hover:text-foreground">
                            <Mail className="h-4 w-4" />
                          </div>
                        )}
                        {member.contact?.phone && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-foreground/70 transition-colors group-hover:bg-primary/20 group-hover:text-foreground">
                            <Phone className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
