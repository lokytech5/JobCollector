import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DashboardJobRow, JobSource } from "@/types/job"

type Props = {
  jobs: DashboardJobRow[]
  isLoading?: boolean
  errorMessage?: string | null
  onRunIngest?: () => void
  onOpenJob?: (jobId: string) => void // later: open drawer
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-56" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    </TableRow>
  )
}

export function LatestJobsTableCard({
  jobs,
  isLoading = false,
  errorMessage = null,
  onRunIngest,
  onOpenJob,
}: Props) {
  const [source, setSource] = useState<"All" | JobSource>("All")
  const [location, setLocation] = useState("")
  const [onlyUnseen, setOnlyUnseen] = useState(false) // future

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const bySource = source === "All" ? true : j.source === source
      const byLocation = location.trim()
        ? j.location.toLowerCase().includes(location.trim().toLowerCase())
        : true

      // Only unseen: future (requires seen flag on dashboard rows)
      const byUnseen = onlyUnseen ? true : true

      return bySource && byLocation && byUnseen
    })
  }, [jobs, source, location, onlyUnseen])

  const empty = !isLoading && !errorMessage && filtered.length === 0

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Latest jobs
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              Most recent jobs stored in the database.
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={onRunIngest}>
            Run ingest
          </Button>
        </div>

        {/* Filters */}
        <div className="grid gap-2 md:grid-cols-3">
          <Select value={source} onValueChange={(v) => setSource(v as any)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All sources</SelectItem>
              <SelectItem value="Reed">Reed</SelectItem>
              <SelectItem value="Adzuna">Adzuna</SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Filter location…"
          />

          <div className="flex items-center justify-between rounded-md border border-border bg-background px-3">
            <div className="py-2">
              <div className="text-sm">Only unseen</div>
              <div className="text-xs text-muted-foreground">Future</div>
            </div>
            <Switch checked={onlyUnseen} onCheckedChange={setOnlyUnseen} disabled />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Separator className="mb-3" />

        {errorMessage ? (
          <div className="py-6">
            <div className="text-sm font-medium">Could not load jobs</div>
            <div className="mt-1 text-sm text-muted-foreground">{errorMessage}</div>
          </div>
        ) : empty ? (
          <div className="py-6">
            <div className="text-sm font-medium">No jobs to show</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Try changing filters or run ingest to fetch fresh listings.
            </div>
            <Button className="mt-4" onClick={onRunIngest}>
              Run ingest
            </Button>
          </div>
        ) : (
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Posted</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} />)
                ) : (
                  filtered.map((job) => (
                    <TableRow
                      key={job.id}
                      className="cursor-pointer"
                      onClick={() => onOpenJob?.(job.id)}
                      title="Later: opens job drawer"
                    >
                      <TableCell className="font-medium">
                        <span className="hover:underline">{job.title}</span>
                      </TableCell>
                      <TableCell className="text-sm">{job.company}</TableCell>
                      <TableCell className="text-sm">{job.location}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{job.source}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {job.postedAt}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
