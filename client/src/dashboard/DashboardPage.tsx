import { DashboardSummaryCards } from "@/components/DashboardSummaryCards"
import { DashboardHeader } from "./DashboardHeader"


export default function DashboardPage() {
  const isLoading = false

  // Replace with your GET /dashboard (or searches + jobs aggregation)
  const metrics = {
    savedSearches: 6,
    latestJobs: 214,
    // newJobsLastRun: 12,
    // emailStatus: "Enabled",
    // nextRunAt: "08:00 GMT",
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 space-y-6">
      <DashboardHeader />
      <DashboardSummaryCards isLoading={isLoading} metrics={metrics} />
    </div>
  )
}
