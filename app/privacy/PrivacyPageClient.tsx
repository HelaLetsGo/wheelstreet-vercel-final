"use client"

import LegalPageContent from "@/components/legal-page-content"

export default function PrivacyPageClient() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 max-w-4xl">
        <LegalPageContent pageType="privacy" />
      </div>
    </div>
  )
}
