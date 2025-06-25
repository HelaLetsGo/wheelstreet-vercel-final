"use client"

import { useState, useEffect } from "react"
import { Shield, CreditCard, FileText, Zap, ArrowRight, CheckCircle, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import DynamicContentLoader from "@/components/dynamic-content-loader"
import EditableSection from "@/components/admin/editable-section"
import { createBrowserClient } from "@supabase/ssr"
import LeadFormButton from "@/components/lead-form-button"
import { ensureImageSrc } from "@/lib/image-utils"
import { motion, AnimatePresence } from "framer-motion"

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

export default function EnhancedServicesSection() {
  const [activeService, setActiveService] = useState("")
  const [serviceTabs, setServiceTabs] = useState<ServiceTab[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    const fetchServiceTabs = async () => {
      try {
        setLoading(true)
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

  const renderIcon = (iconName: string) => {
    const iconClass = "h-6 w-6 sm:h-8 sm:w-8"
    switch (iconName) {
      case "Shield":
        return <Shield className={iconClass} />
      case "CreditCard":
        return <CreditCard className={iconClass} />
      case "FileText":
        return <FileText className={iconClass} />
      case "Zap":
        return <Zap className={iconClass} />
      default:
        return <Shield className={iconClass} />
    }
  }

  const getDefaultImagePath = (tabId: string) => {
    const defaultImages: Record<string, string> = {
      acquisition: "/acquisition-image.jpg",
      financing: "/hero-car-1.jpg",
      insurance: "/hero-car-2.jpg",
      ev: "/ev-image.jpg",
      other: "/hero-car-3.jpg",
    }
    return defaultImages[tabId] || "/placeholder.jpg"
  }

  const activeServiceData = serviceTabs.find(service => service.tab_id === activeService)

  return (
    <EditableSection sectionType="services">
      <section
        id="services"
        className="relative py-24 lg:py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:50px_50px]"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <DynamicContentLoader sectionType="services">
            {(content, isLoading) => (
              <>
                {/* Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center max-w-4xl mx-auto mb-16"
                >
                  {/* Badge */}
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
                    <Star className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm font-medium text-white/90">Premium Services</span>
                  </div>

                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="h-12 bg-white/10 rounded-lg animate-pulse mx-auto max-w-md"></div>
                      <div className="h-6 bg-white/5 rounded animate-pulse mx-auto max-w-lg"></div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                          {content?.title || "PASLAUGOS"}
                        </span>
                      </h2>
                      <p className="text-xl text-white/70 leading-relaxed">
                        {content?.description || content?.subtitle}
                      </p>
                    </>
                  )}
                </motion.div>

                {/* Services Content */}
                {loading ? (
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-96 bg-white/5 rounded-2xl animate-pulse"></div>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Service Tabs */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      {serviceTabs.map((service, index) => (
                        <motion.div
                          key={service.tab_id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className={cn(
                            "group relative p-6 rounded-2xl cursor-pointer transition-all duration-300",
                            "border backdrop-blur-sm",
                            activeService === service.tab_id
                              ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 shadow-2xl shadow-blue-500/10"
                              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                          )}
                          onClick={() => setActiveService(service.tab_id)}
                        >
                          {/* Glow effect for active service */}
                          {activeService === service.tab_id && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                          )}
                          
                          <div className="relative z-10 flex items-start space-x-4">
                            <div className={cn(
                              "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300",
                              activeService === service.tab_id
                                ? "bg-white/20 text-white"
                                : "bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/15"
                            )}>
                              {renderIcon(service.icon || "Shield")}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className={cn(
                                "text-lg font-semibold mb-2 transition-colors duration-300",
                                activeService === service.tab_id ? "text-white" : "text-white/90 group-hover:text-white"
                              )}>
                                {service.title}
                              </h3>
                              <p className={cn(
                                "text-sm leading-relaxed transition-colors duration-300",
                                activeService === service.tab_id ? "text-white/80" : "text-white/60 group-hover:text-white/70"
                              )}>
                                {service.short_desc}
                              </p>
                            </div>

                            <ArrowRight className={cn(
                              "w-5 h-5 transition-all duration-300",
                              activeService === service.tab_id
                                ? "text-white translate-x-1"
                                : "text-white/40 group-hover:text-white/70 group-hover:translate-x-1"
                            )} />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Active Service Display */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <AnimatePresence mode="wait">
                        {activeServiceData && (
                          <motion.div
                            key={activeService}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="relative"
                          >
                            {/* Background glow */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
                            
                            {/* Content container */}
                            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                              {/* Image */}
                              <div className="relative h-64 sm:h-80 overflow-hidden">
                                <img
                                  src={ensureImageSrc(activeServiceData.image_path || getDefaultImagePath(activeServiceData.tab_id))}
                                  alt={activeServiceData.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.jpg"
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                
                                {/* Overlay content */}
                                <div className="absolute bottom-6 left-6 right-6">
                                  <h3 className="text-2xl font-bold text-white mb-2">{activeServiceData.title}</h3>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="p-6 space-y-6">
                                <p className="text-white/80 leading-relaxed text-lg">
                                  {activeServiceData.full_desc}
                                </p>

                                {/* Benefits */}
                                {activeServiceData.benefits && activeServiceData.benefits.length > 0 && (
                                  <div className="space-y-3">
                                    <h4 className="text-lg font-semibold text-white">Key Benefits:</h4>
                                    <ul className="space-y-2">
                                      {activeServiceData.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-center space-x-3">
                                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                          <span className="text-white/80">{benefit}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* CTA */}
                                <div className="pt-4">
                                  <LeadFormButton
                                    text="Get Started"
                                    className="group w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                                    data={{ interest: activeServiceData.tab_id }}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                )}
              </>
            )}
          </DynamicContentLoader>
        </div>
      </section>
    </EditableSection>
  )
}