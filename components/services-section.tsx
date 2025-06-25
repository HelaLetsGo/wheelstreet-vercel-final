"use client"

import { useState, useEffect } from "react"
import { Shield, CreditCard, FileText, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import DynamicContentLoader from "@/components/dynamic-content-loader"
import EditableSection from "@/components/admin/editable-section"
import { createBrowserClient } from "@supabase/ssr"
import LeadFormButton from "@/components/lead-form-button"
import { ensureImageSrc } from "@/lib/image-utils"
import { GridPattern } from "@/components/magicui/grid-pattern"

interface ServiceTab {
  id: string
  section_id: string
  tab_id: string
  title: string
  short_desc?: string
  full_desc?: string
  icon?: string
  display_order?: number
  is_active?: boolean
  benefits?: string[]
  image_path?: string
}

export default function ServicesSection() {
  const [activeService, setActiveService] = useState("")
  const [serviceTabs, setServiceTabs] = useState<ServiceTab[]>([])
  const [loading, setLoading] = useState(true)
  
  // Create Supabase client only if environment variables are available
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    ? createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null

  useEffect(() => {
    const fetchServiceTabs = async () => {
      try {
        setLoading(true)
        
        if (!supabase) {
          // When Supabase is not available (during build), set fallback data
          const fallbackTabs = [
            { id: "1", section_id: "services", tab_id: "acquisition", title: "Automobilių įsigijimas", short_desc: "Padedame rasti ir įsigyti idealų automobilį", display_order: 1, is_active: true },
            { id: "2", section_id: "services", tab_id: "financing", title: "Finansavimas", short_desc: "Suteikiame geriausias finansavimo sąlygas", display_order: 2, is_active: true },
            { id: "3", section_id: "services", tab_id: "insurance", title: "Draudimas", short_desc: "Automobilių draudimas su geriausiomis sąlygomis", display_order: 3, is_active: true },
            { id: "4", section_id: "services", tab_id: "ev", title: "Elektromobiliai", short_desc: "Specializuojamės elektromobilių srityje", display_order: 4, is_active: true }
          ]
          setServiceTabs(fallbackTabs)
          setActiveService(fallbackTabs[0]?.tab_id || "")
          setLoading(false)
          return
        }
        
        const { data, error } = await supabase
          .from("service_tabs")
          .select("*")
          .order("display_order")
          .eq("is_active", true)

        if (error) {
          console.error("Error fetching service tabs:", error)
          throw error
        }

        if (data && data.length > 0) {
          setServiceTabs(data)
          setActiveService(data[0].tab_id)
        }
      } catch (err) {
        console.error("Error in fetchServiceTabs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceTabs()
  }, [supabase])

  // Function to render the appropriate icon based on the icon name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      case "CreditCard":
        return <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      case "FileText":
        return <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      case "Zap":
        return <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      default:
        return <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
    }
  }

  // Function to get the default image path if none is provided
  const getDefaultImagePath = (tabId: string) => {
    const defaultImages: Record<string, string> = {
      acquisition: "/acquisition-image.jpg",
      financing: "/flexible-financing.jpg",
      insurance: "/comprehensive-insurance.jpg",
      warranty: "/extended-warranty.jpg",
      ev: "/ev-solutions.jpg",
      corporate: "/corporate-fleet.jpg",
      protection: "/protection-services.jpg",
    }

    return defaultImages[tabId] || "/customer-service-interaction.png"
  }

  if (loading) {
    return (
      <section id="services" className="relative bg-slate-950 py-12 sm:py-16 md:py-24 parallax-section">
        <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-10">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <DynamicContentLoader sectionType="services">
      {(content, isLoading) => (
        <EditableSection sectionType="services" sectionId={content?.id || ""} title="Services">
          <section id="services" className="relative bg-slate-950 py-16 sm:py-20 md:py-28 parallax-section overflow-hidden">
            {/* GridPattern Background */}
            <GridPattern
              width={40}
              height={40}
              x={-1}
              y={-1}
              strokeDasharray={"4 2"}
              className={cn(
                "absolute inset-0 h-full w-full fill-slate-800/20 stroke-slate-700/30",
                "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
              )}
            />
            
            <div className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-8 md:px-12">
              <div className="text-center mb-12 sm:mb-16">
                <h2
                  className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight"
                  data-parallax
                  data-parallax-speed="0.1"
                  data-parallax-direction="vertical"
                >
                  {content?.title || "PASLAUGOS"}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-white to-slate-300 mx-auto mb-6"></div>
                <p
                  className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed"
                  data-parallax
                  data-parallax-speed="0.15"
                  data-parallax-direction="vertical"
                >
                  {content?.description ||
                    "Pritaikytos paslaugos, sukurtos aukščiausių reikalavimų klientams. Kiekviena detalė apgalvota, kad užtikrintų nepriekaištingą jūsų patirtį."}
                </p>
              </div>

              {/* Services Navigation */}
              <div
                className="mb-12 sm:mb-16 flex flex-wrap justify-center gap-3 sm:gap-4"
                data-parallax
                data-parallax-speed="0.2"
                data-parallax-direction="vertical"
              >
                {serviceTabs.map((service, index) => (
                  <button
                    key={service.tab_id}
                    onClick={() => setActiveService(service.tab_id)}
                    className={cn(
                      "rounded-lg px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium tracking-wide transition-all duration-300 min-h-[52px] shadow-lg hover:shadow-xl border",
                      activeService === service.tab_id
                        ? "bg-white text-slate-900 shadow-xl transform scale-105 border-white"
                        : "bg-slate-900/80 text-white border-slate-700 hover:bg-slate-800/90 hover:border-slate-600 backdrop-blur-sm",
                    )}
                    data-parallax
                    data-parallax-speed={`${0.05 + index * 0.01}`}
                    data-parallax-direction="horizontal"
                    data-parallax-offset={`${(index - serviceTabs.length / 2) * 5}`}
                  >
                    {service.title}
                  </button>
                ))}
              </div>

              {/* Active Service Details */}
              {serviceTabs.map((service) => (
                <div
                  key={service.tab_id}
                  className={cn(
                    "transition-all duration-500 ease-in-out",
                    activeService === service.tab_id ? "block opacity-100" : "hidden opacity-0",
                  )}
                >
                  <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 sm:p-12">
                    <div className="space-y-6 sm:space-y-8">
                      <div
                        className="flex items-center gap-4 sm:gap-6"
                        data-parallax
                        data-parallax-speed="0.1"
                        data-parallax-direction="vertical"
                      >
                        <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                          {renderIcon(service.icon || "Shield")}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{service.title}</h3>
                      </div>

                      <p
                        className="text-lg sm:text-xl text-slate-200 leading-relaxed"
                        data-parallax
                        data-parallax-speed="0.15"
                        data-parallax-direction="vertical"
                      >
                        {service.full_desc}
                      </p>

                      <div
                        className="rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-6 sm:p-8"
                        data-parallax
                        data-parallax-speed="0.2"
                        data-parallax-direction="vertical"
                      >
                        <h4 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-white">
                          PRIVALUMAI
                        </h4>
                        <ul className="space-y-3 sm:space-y-4">
                          {service.benefits &&
                            service.benefits.map((benefit, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 sm:gap-4 text-base sm:text-lg text-slate-300 leading-relaxed"
                                data-parallax
                                data-parallax-speed={`${0.1 + index * 0.05}`}
                                data-parallax-direction="vertical"
                              >
                                <span className="mt-2 w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Add the Lead Form Button */}
                      <div className="pt-4">
                        <LeadFormButton
                          text="Gauti individualų pasiūlymą"
                          className="bg-white text-slate-900 px-8 py-4 text-base font-medium rounded-lg shadow-lg hover:bg-slate-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        />
                      </div>
                    </div>

                    <div
                      className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-2xl border border-slate-700/50"
                      data-parallax
                      data-parallax-speed="0.3"
                      data-parallax-direction="vertical"
                    >
                      {/* Use the service image_path if available, or fall back to section image_path, or use default */}
                      <img
                        src={ensureImageSrc(
                          service.image_path || content?.image_path,
                          getDefaultImagePath(service.tab_id),
                        )}
                        alt={service.title}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </EditableSection>
      )}
    </DynamicContentLoader>
  )
}
