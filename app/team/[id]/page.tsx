import type { Metadata } from "next"
import TeamMemberPageClient from "./TeamMemberPageClient"

export const metadata: Metadata = {
  title: "Team Member | WheelStreet Auto Experts",
  description: "Learn more about our automotive expert team member at WheelStreet Lithuania.",
}

export default function TeamMemberPage() {
  return <TeamMemberPageClient />
}
