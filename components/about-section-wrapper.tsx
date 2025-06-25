"use client"

import AboutSection from "@/components/about-section"
import EditableSection from "@/components/admin/editable-section"
import DynamicContentLoader from "@/components/dynamic-content-loader"

export default function AboutSectionWrapper() {
  return (
    <DynamicContentLoader sectionType="about">
      {(content, isLoading) => (
        <EditableSection sectionType="about" sectionId={content?.id || ""} title="About">
          <AboutSection />
        </EditableSection>
      )}
    </DynamicContentLoader>
  )
}
