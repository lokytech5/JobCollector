export type JobSource = "Reed" | "Adzuna" | "Other"

export type SearchSource = "All" | "Reed" | "Adzuna"

export type Job = {
  id: string
  title: string
  company: string
  location: string
  source: JobSource
  postedAt: string // ISO string or display string; keep consistent
  url: string
  seen: boolean
  description?: string
  rawDetails?: string
}

export type SavedSearch = {
  name: string
  query: string
  location: string
  seen_count?: number
  limit?: number
  source?: SearchSource // optional advanced
  posted_after?: string 
}

export type DashboardJobRow = {
  id: string
  title: string
  company: string
  location: string
  source: JobSource
  postedAt: string // keep as display string for now (e.g., 2026-01-22)
  url?: string
  // future: seen flag (if you want only unseen toggle to work here)
}
