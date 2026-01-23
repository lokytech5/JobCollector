import { SavedSearchesCard } from "./SavedSearchesCard"
import { LatestJobsTableCard } from "./LatestJobsTableCard"
import type { DashboardJobRow, SavedSearch } from "@/types/job"

type Props = {
  searches: SavedSearch[]
  jobs: DashboardJobRow[]
  isLoadingSearches?: boolean
  isLoadingJobs?: boolean
  jobsError?: string | null
  onOpenSearch?: (name: string) => void
  onCreateSearch?: () => void
  onRunIngest?: () => void
  onOpenJob?: (jobId: string) => void
}

export function DashboardRow({
  searches,
  jobs,
  isLoadingSearches = false,
  isLoadingJobs = false,
  jobsError = null,
  onOpenSearch,
  onCreateSearch,
  onRunIngest,
  onOpenJob,
}: Props) {
  return (
    <section className="grid gap-4 lg:grid-cols-10">
      <div className="lg:col-span-4">
        <SavedSearchesCard
          searches={searches}
          isLoading={isLoadingSearches}
          onOpenSearch={onOpenSearch}
          onCreateSearch={onCreateSearch}
        />
      </div>

      <div className="lg:col-span-6">
        <LatestJobsTableCard
          jobs={jobs}
          isLoading={isLoadingJobs}
          errorMessage={jobsError}
          onRunIngest={onRunIngest}
          onOpenJob={onOpenJob}
        />
      </div>
    </section>
  )
}
