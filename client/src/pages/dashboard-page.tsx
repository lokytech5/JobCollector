import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  Database,
  Mail,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const kpis = [
  {
    label: "Saved searches",
    value: "3",
    icon: Search,
    helper: "Active rules running daily",
  },
  {
    label: "New jobs (24h)",
    value: "12",
    icon: TrendingUp,
    helper: "Deduped across sources",
  },
  {
    label: "Digest",
    value: "Enabled",
    icon: Mail,
    helper: "Only emails when new jobs",
  },
  {
    label: "Sources",
    value: "2",
    icon: Database,
    helper: "Reed, Adzuna",
  },
];

const savedSearches = [
  {
    name: "backend-london",
    query: "backend engineer",
    location: "London",
    sources: ["reed", "adzuna"],
    lastRun: "Today, 08:00",
    newCount: 7,
    status: "Active",
  },
  {
    name: "python-remote",
    query: "python engineer",
    location: "Remote (UK)",
    sources: ["adzuna"],
    lastRun: "Yesterday, 08:00",
    newCount: 3,
    status: "Active",
  },
  {
    name: "aws-senior",
    query: "senior backend aws",
    location: "London",
    sources: ["reed"],
    lastRun: "2 days ago",
    newCount: 0,
    status: "Paused",
  },
];

const latestJobs = [
  {
    title: "Backend Engineer (FastAPI)",
    company: "FinTech Co",
    location: "London (Hybrid)",
    posted: "2h",
    tag: "new",
  },
  {
    title: "Python Engineer — APIs",
    company: "HealthTech",
    location: "Remote (UK)",
    posted: "6h",
    tag: "new",
  },
  {
    title: "Senior Backend Engineer — AWS",
    company: "ScaleUp",
    location: "London",
    posted: "1d",
    tag: "seen",
  },
];

function KpiCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <div className="text-xs text-muted-foreground">{helper}</div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  return (
    <div className="pb-10">
      <PageHeader
        title="Dashboard"
        description="Your saved searches, latest jobs, and today’s activity."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/app/support">
                Feedback <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New saved search
            </Button>
          </div>
        }
      />

      <div className="px-4 pt-6 md:px-6">
        {/* KPI row */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          {/* Saved searches */}
          <Card className="shadow-sm lg:col-span-7">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Saved searches</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Rules that run daily across sources.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {savedSearches.map((s) => (
                <div
                  key={s.name}
                  className="rounded-lg border p-3 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="truncate font-medium">{s.name}</div>
                        <Badge
                          variant={s.status === "Active" ? "secondary" : "outline"}
                          className="rounded-full"
                        >
                          {s.status}
                        </Badge>
                        {s.newCount > 0 ? (
                          <Badge className="rounded-full">{s.newCount} new</Badge>
                        ) : (
                          <Badge variant="outline" className="rounded-full">
                            0 new
                          </Badge>
                        )}
                      </div>

                      <div className="mt-1 text-sm text-muted-foreground">
                        {s.query} • {s.location}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Database className="h-3.5 w-3.5" />
                          {s.sources.join(", ")}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Last run: {s.lastRun}
                        </span>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="shrink-0">
                      Open <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Latest jobs */}
          <Card className="shadow-sm lg:col-span-5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Latest jobs</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fresh roles across your searches.
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full">
                  Today
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-12 gap-3 px-1 text-xs text-muted-foreground">
                <div className="col-span-7">Role</div>
                <div className="col-span-3 text-right">Posted</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              {latestJobs.map((j) => (
                <div key={j.title} className="grid grid-cols-12 items-center gap-3 rounded-lg border p-3">
                  <div className="col-span-7 min-w-0">
                    <div className="truncate font-medium">{j.title}</div>
                    <div className="mt-1 truncate text-sm text-muted-foreground">
                      {j.company} • {j.location}
                    </div>
                  </div>

                  <div className="col-span-3 text-right text-sm text-muted-foreground">
                    {j.posted}
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <Badge
                      variant={j.tag === "new" ? "default" : "secondary"}
                      className="rounded-full"
                    >
                      {j.tag}
                    </Badge>
                  </div>
                </div>
              ))}

              <Separator className="my-1" />

              <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI ranking & summaries coming next.
                </span>
                <Button variant="ghost" size="sm">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System / status row */}
        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <Card className="shadow-sm lg:col-span-12">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">System</div>
                  <div className="text-sm text-muted-foreground">
                    Next run at <span className="font-medium text-foreground/80">08:00 GMT</span>. Emails only if new jobs exist.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-full">
                    Deduped
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    Seen tracking
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    Digest enabled
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
