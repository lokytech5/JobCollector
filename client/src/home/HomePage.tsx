import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
          <p className="text-xs text-muted-foreground">
            Your workspace for tracking roles, runs, and review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button>New search</Button>
          <Button variant="outline">Run ingest</Button>
        </div>
      </div>

      <Separator />

      {/* Top grid */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Quick start */}
        <Card className="bg-card border border-border lg:col-span-7">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quick start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">1) Create a saved search</div>
                  <div className="text-xs text-muted-foreground">
                    Define query, location, and ingestion limit.
                  </div>
                </div>
                <Button size="sm">Create</Button>
              </div>
            </div>

            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">2) Run ingest</div>
                  <div className="text-xs text-muted-foreground">
                    Pull fresh jobs from sources into your database.
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Run
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">3) Review results per search</div>
                  <div className="text-xs text-muted-foreground">
                    Track seen/unseen and open postings quickly.
                  </div>
                </div>
                <Button size="sm" variant="secondary" disabled>
                  AI Review (soon)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="bg-card border border-border lg:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">System status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">Scheduler</div>
                <div className="text-xs text-muted-foreground">Daily at 08:00 GMT</div>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="text-xs text-muted-foreground">Test email available</div>
              </div>
              <Badge variant="outline">Not configured</Badge>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">AI</div>
                <div className="text-xs text-muted-foreground">Scoring + summaries</div>
              </div>
              <Badge variant="outline">Future</Badge>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              <Button className="flex-1">Go to Dashboard</Button>
              <Button variant="outline" className="flex-1">
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity / placeholder */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No activity yet. Create a search and run ingest to start tracking jobs.
        </CardContent>
      </Card>
    </div>
  )
}
