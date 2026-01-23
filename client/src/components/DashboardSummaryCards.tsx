import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

type Metric = {
  label: string
  value?: number | string
  hint?: string
  status?: "ok" | "pending" | "disabled"
}

type DashboardSummaryCardsProps = {
  isLoading?: boolean
  metrics?: {
    savedSearches: number
    latestJobs: number
    newJobsLastRun?: number // future
    emailStatus?: "Enabled" | "Disabled" | "Not configured" // future
    nextRunAt?: string // future
  }
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card className="bg-card border border-border">
      <CardHeader className="space-y-1 pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {metric.label}
          </CardTitle>

          {metric.status === "pending" && (
            <Badge variant="secondary" className="text-xs">
              Soon
            </Badge>
          )}
          {metric.status === "disabled" && (
            <Badge variant="outline" className="text-xs">
              Future
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="text-2xl font-semibold leading-none">
          {metric.value ?? "—"}
        </div>
        {metric.hint ? (
          <div className="mt-2 text-xs text-muted-foreground">{metric.hint}</div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function MetricCardSkeleton() {
  return (
    <Card className="bg-card border border-border">
      <CardHeader className="space-y-2 pb-2">
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  )
}

export function DashboardSummaryCards({
  isLoading = false,
  metrics,
}: DashboardSummaryCardsProps) {
  const cards: Metric[] = [
    {
      label: "Total saved searches",
      value: metrics?.savedSearches,
      hint: "Your configured search set.",
      status: "ok",
    },
    {
      label: "Latest jobs in DB",
      value: metrics?.latestJobs,
      hint: "Newest jobs currently stored.",
      status: "ok",
    },
    {
      label: "New jobs last run",
      value: metrics?.newJobsLastRun ?? "—",
      hint: "Will populate after ingest runs.",
      status: "disabled",
    },
    {
      label: "Email / next scheduled run",
      value: metrics?.emailStatus ?? "—",
      hint: metrics?.nextRunAt ? `Next run: ${metrics.nextRunAt}` : "Scheduler status coming soon.",
      status: "pending",
    },
  ]

  return (
    <section className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">
        Overview
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
          : cards.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </div>
    </section>
  )
}
