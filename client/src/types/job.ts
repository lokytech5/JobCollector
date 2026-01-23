export type JobSource = "Reed" | "Adzuna" | "Other"

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
