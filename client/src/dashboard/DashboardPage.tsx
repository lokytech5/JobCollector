import { DashboardSummaryCards } from "@/components/DashboardSummaryCards"
import { DashboardHeader } from "./DashboardHeader"
import type { DashboardJobRow, SavedSearch } from "@/types/job"
import { DashboardRow } from "./DashboardRow"
import { SearchDialog } from "@/components/SearchDialog"
import { useState } from "react"

export default function DashboardPage() {

  const isLoading = false

  const searches: SavedSearch[] = [
    { name: "Frontend London", query: "react typescript", location: "London", seen_count: 31 },
    { name: "Remote Full Stack", query: "node react", location: "Remote (UK)", seen_count: 12 },
  ]

  const jobs: DashboardJobRow[] = [
    {
      id: "j1",
      title: "Frontend Engineer (React)",
      company: "Acme Ltd",
      location: "London, UK",
      source: "Reed",
      postedAt: "2026-01-22",
    },
    {
      id: "j2",
      title: "Full Stack Developer",
      company: "Northwind",
      location: "Remote (UK)",
      source: "Adzuna",
      postedAt: "2026-01-21",
    },
  ]

  const [dialogOpen, setDialogOpen] = useState(false)
const [mode, setMode] = useState<"create" | "edit">("create")
const [initial, setInitial] = useState<Partial<SavedSearch> | undefined>(undefined)

// Example existing names for uniqueness warning:
const existingNames = searches.map((s) => s.name)

const openCreate = () => {
  setMode("create")
  setInitial(undefined)
  setDialogOpen(true)
}

const openEdit = (search: SavedSearch) => {
  setMode("edit")
  setInitial(search)
  setDialogOpen(true)
}

<SearchDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  mode={mode}
  initial={initial}
  existingNames={existingNames}
  onSave={async (payload) => {
    // TODO: POST /searches (upsert)
    console.log("save search:", payload)
  }}
/>

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardSummaryCards
        isLoading={isLoading}
        metrics={{ savedSearches: searches.length, latestJobs: jobs.length }}
      />

      <DashboardRow
        searches={searches}
        jobs={jobs}
        isLoadingSearches={isLoading}
        isLoadingJobs={isLoading}
        onOpenSearch={(name) => console.log("open search:", name)}
        onCreateSearch={() => console.log("create search")}
        onRunIngest={() => console.log("run ingest")}
        onOpenJob={(jobId) => console.log("open job (later drawer):", jobId)}
      />
    </div>
  )
}
