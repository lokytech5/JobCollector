import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import type { Job } from "@/types/job"
import { JobDetailsSheet } from "./JobDetailsSheet"

type JobFeedListProps = {
  jobs: Job[]
  isLoading?: boolean
  errorMessage?: string | null
  emptyMessage?: string
}

function JobCardSkeleton() {
  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function JobFeedList({
  jobs,
  isLoading = false,
  errorMessage = null,
  emptyMessage = "No jobs match your filters.",
}: JobFeedListProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const hasJobs = useMemo(() => jobs && jobs.length > 0, [jobs])

  const openDrawer = (job: Job) => {
    setSelectedJob(job)
    setDrawerOpen(true)
  }

  if (errorMessage) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="p-4 space-y-2">
          <div className="text-sm font-medium">Something went wrong</div>
          <div className="text-sm text-muted-foreground">{errorMessage}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <section className="space-y-3">
        <div className="text-sm font-medium text-muted-foreground">Jobs</div>
        <Separator />

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : !hasJobs ? (
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-sm text-muted-foreground">
              {emptyMessage}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Card key={job.id} className="bg-card border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: title + meta */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => openDrawer(job)}
                        className="text-left w-full"
                      >
                        <div className="text-base font-medium truncate hover:underline">
                          {job.title}
                        </div>
                      </button>

                      <div className="text-xs text-muted-foreground truncate">
                        {job.company} • {job.location}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge variant="secondary">{job.source}</Badge>
                        <div className="text-xs text-muted-foreground">
                          Posted: {job.postedAt}
                        </div>

                        {/* Future badge placeholder */}
                        <Badge variant="outline" className="text-xs" title="Future">
                          AI Score: —
                        </Badge>
                      </div>
                    </div>

                    {/* Right: seen + open */}
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={job.seen ? "outline" : "default"}>
                        {job.seen ? "Seen" : "Unseen"}
                      </Badge>

                      <Button
                        variant="outline"
                        onClick={() => window.open(job.url, "_blank", "noopener,noreferrer")}
                      >
                        Open
                      </Button>
                    </div>
                  </div>

                  {/* Optional: tiny footer row (future actions) */}
                  <div className="mt-3 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" disabled>
                      Summarize (soon)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <JobDetailsSheet
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        job={selectedJob}
      />
    </>
  )
}
