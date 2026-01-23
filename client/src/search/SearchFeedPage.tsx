import { useState } from "react"
import type { Job } from "@/types/job"
import { JobFeedList } from "@/components/JobFeedList"

export default function SearchFeedPage() {
  const [isLoading] = useState(false)

  const jobs: Job[] = [
    {
      id: "1",
      title: "Frontend Engineer (React)",
      company: "Acme Ltd",
      location: "London, UK",
      source: "Reed",
      postedAt: "2026-01-22",
      url: "https://example.com/job/1",
      seen: false,
      rawDetails: "Role details go here.\n\nTech: React, TypeScript, shadcn/ui.",
    },
    {
      id: "2",
      title: "Full Stack Developer",
      company: "Northwind",
      location: "Remote (UK)",
      source: "Adzuna",
      postedAt: "2026-01-21",
      url: "https://example.com/job/2",
      seen: true,
      rawDetails: "More details go here.",
    },
  ]

  return <JobFeedList jobs={jobs} isLoading={isLoading} />
}
