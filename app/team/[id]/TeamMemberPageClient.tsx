"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, Phone, Linkedin, Loader2 } from "lucide-react"
import { formatTeamMemberImagePath } from "@/lib/image-utils"

export default function TeamMemberPageClient() {
  const params = useParams()
  const [member, setMember] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        setLoading(true)
        const memberId = params?.id as string

        if (!memberId) {
          throw new Error("Member ID is required")
        }

        console.log("Fetching team member with ID:", memberId)

        // Fetch team member from API route
        const response = await fetch(`/api/team-members/${memberId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch team member")
        }

        const data = await response.json()
        console.log("Team member fetched:", data.teamMember)
        setMember(data.teamMember)
      } catch (err) {
        console.error("Error fetching team member:", err)
        setError("Team member not found")

        // Fallback to static data if fetch fails
        const staticMembers = {
          "julius-jankauskas": {
            member_id: "julius-jankauskas",
            name: "Julius Jankauskas",
            position: "CEO",
            image_path: "/team/julius-jankauskas.jpg",
            bio: [
              "Julius yra WheelStreet įkūrėjas ir generalinis direktorius. Jis turi daugiau nei 10 metų patirties automobilių pramonėje ir yra sukūręs inovatyvų požiūrį į automobilių įsigijimo procesą.",
              "Julius yra įsipareigojęs užtikrinti, kad kiekvienas klientas gautų aukščiausios kokybės paslaugas ir rastų tobulą automobilį pagal savo poreikius.",
            ],
            contact: {
              email: "julius@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          "vainius-mirskis": {
            member_id: "vainius-mirskis",
            name: "Vainius Mirskis",
            position: "COO",
            image_path: "/team/vainius-mirskis.jpg",
            bio: [
              "Vainius yra WheelStreet operacijų direktorius, atsakingas už kasdienį įmonės veiklos valdymą.",
              "Jis turi didelę patirtį logistikos ir tiekimo grandinės valdymo srityje, kurią pritaiko užtikrinant sklandų automobilių įsigijimo procesą.",
            ],
            contact: {
              email: "vainius@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          "mantas-jauga": {
            member_id: "mantas-jauga",
            name: "Mantas Jauga",
            position: "Pardavimų vadybininkas",
            image_path: "/team/mantas-jauga.jpg",
            bio: [
              "Mantas yra patyręs pardavimų vadybininkas, turintis gilias žinias apie automobilių rinką.",
              "Jis padeda klientams rasti geriausią automobilį pagal jų poreikius ir biudžetą.",
            ],
            contact: {
              email: "mantas@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          "vytautas-balodas": {
            member_id: "vytautas-balodas",
            name: "Vytautas Balodas",
            position: "Pardavimų vadybininkas",
            image_path: "/team/vytautas-balodas.jpg",
            bio: [
              "Vytautas specializuojasi premium klasės automobilių pardavimuose.",
              "Jis turi didelę patirtį dirbant su aukštos klasės automobilių gamintojais ir gali patarti klientams, ieškantiems išskirtinių transporto priemonių.",
            ],
            contact: {
              email: "vytautas@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          "nedas-mockevicius": {
            member_id: "nedas-mockevicius",
            name: "Nedas Mockevičius",
            position: "Pardavimų vadybininkas",
            image_path: "/team/nedas-mockevicius.jpg",
            bio: [
              "Nedas specializuojasi elektromobilių ir hibridinių automobilių srityje.",
              "Jis turi gilias žinias apie naujausias technologijas ir gali patarti klientams, norintiems pereiti prie ekologiškesnių transporto priemonių.",
            ],
            contact: {
              email: "nedas@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
          "martynas-linge": {
            member_id: "martynas-linge",
            name: "Martynas Lingė",
            position: "Vizualinės komunikacijos ekspertas",
            image_path: "/team/martynas-linge.jpg",
            bio: [
              "Martynas yra atsakingas už WheelStreet vizualinę komunikaciją ir marketingą.",
              "Jis kuria patrauklų turinį, kuris padeda klientams geriau suprasti mūsų paslaugas ir automobilių pasirinkimus.",
            ],
            contact: {
              email: "martynas@wheelstreet.lt",
              phone: "+37061033377",
            },
          },
        }

        const memberId = params?.id as string
        if (staticMembers[memberId]) {
          setMember(staticMembers[memberId])
          setError(null)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMember()
  }, [params])

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen py-32">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="container mx-auto min-h-screen py-32">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Komandos narys nerastas</h1>
          <p className="mb-6 text-foreground/70">{error || "Nepavyko rasti komandos nario informacijos."}</p>
          <Link href="/team" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Grįžti į komandos puslapį
          </Link>
        </div>
      </div>
    )
  }

  // Special handling for Karolis - use placeholder
  let imagePath
  if (member.name?.toLowerCase().includes("karolis") || member.member_id?.toLowerCase().includes("karolis")) {
    imagePath = `/placeholder.svg?height=600&width=450&query=${encodeURIComponent(member.name || "team member")}`
  } else {
    // Format the image path correctly for other team members
    imagePath = formatTeamMemberImagePath(member.image_path)
  }

  return (
    <div className="container mx-auto min-h-screen py-32 px-4 sm:px-6 md:px-10">
      <Link
        href="/team"
        className="mb-12 inline-flex items-center gap-2 text-foreground/70 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Grįžti į komandos puslapį
      </Link>

      <div className="grid gap-12 md:grid-cols-3">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-32 rounded-sm border border-border bg-custom-card-bg overflow-hidden">
            {/* Team member avatar - now using square image */}
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={imagePath || "/team-placeholder.svg"}
                alt={member.name}
                width={400}
                height={400}
                className="object-cover w-full h-full object-top" // Added object-top to align faces properly
                priority
                unoptimized={false} // Ensure Next.js optimizes the image
              />
            </div>
            <div className="p-8 text-center">
              <h1 className="mb-1 text-2xl font-bold">{member.name}</h1>
              <p className="mb-6 text-foreground/60">{member.position}</p>

              <div className="mb-6 flex justify-center space-x-4">
                {member.contact?.email && (
                  <a
                    href={`mailto:${member.contact.email}`}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-foreground/70 transition-colors hover:bg-primary/20 hover:text-foreground"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
                {member.contact?.phone && (
                  <a
                    href={`tel:${member.contact.phone}`}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-foreground/70 transition-colors hover:bg-primary/20 hover:text-foreground"
                    aria-label={`Call ${member.name}`}
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                )}
                {member.contact?.linkedin && (
                  <a
                    href={`https://${member.contact.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-foreground/70 transition-colors hover:bg-primary/20 hover:text-foreground"
                    aria-label={`${member.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <h2 className="mb-8 text-3xl font-bold text-center md:text-left">Apie {member.name.split(" ")[0]}</h2>

          <div className="space-y-6">
            {member.bio &&
              (typeof member.bio === "string" ? (
                <p className="text-foreground/80 leading-relaxed text-center md:text-left">{member.bio}</p>
              ) : Array.isArray(member.bio) && member.bio.length > 0 ? (
                member.bio.map((paragraph: string, index: number) => (
                  <p key={index} className="text-foreground/80 leading-relaxed text-center md:text-left">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-foreground/80 leading-relaxed text-center md:text-left">
                  Informacija apie {member.name} ruošiama.
                </p>
              ))}
          </div>

          <div className="mt-16">
            <h3 className="mb-8 text-2xl font-bold text-center md:text-left">
              Susisiekite su {member.name.split(" ")[0]}
            </h3>

            <div className="rounded-sm border border-border bg-custom-card-bg p-8">
              <p className="mb-8 text-foreground/80 text-center md:text-left">
                Jei turite klausimų apie prabangius automobilius ar mūsų teikiamas paslaugas,
                {member.name.split(" ")[0]} mielai jums padės. Susisiekite tiesiogiai:
              </p>

              <div className="space-y-6">
                {member.contact?.email && (
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">El. paštas</p>
                      <a href={`mailto:${member.contact.email}`} className="text-foreground hover:text-primary">
                        {member.contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {member.contact?.phone && (
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Telefonas</p>
                      <a href={`tel:${member.contact.phone}`} className="text-foreground hover:text-primary">
                        {member.contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {member.contact?.linkedin && (
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                      <Linkedin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">LinkedIn</p>
                      <a
                        href={`https://${member.contact.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary"
                      >
                        {member.contact.linkedin}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
