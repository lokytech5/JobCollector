import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ExternalLink, RefreshCcw, SlidersHorizontal } from "lucide-react";

type Job = {
  uid: string;
  source: string;
  source_job_id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  posted_at: string; // ISO
};

const demoJobs: Job[] = [
  {
    uid: "adzuna:5601447823",
    source: "adzuna",
    source_job_id: "5601447823",
    title: "Cloud Engineer",
    company: "Réalta Associates",
    location: "Farringdon, Central London",
    url: "https://www.adzuna.co.uk/jobs/details/5601447823",
    posted_at: "2026-01-27T01:43:28",
  },
  {
    uid: "reed:56377957",
    source: "reed",
    source_job_id: "56377957",
    title: "Senior IT Engineer",
    company: "Proactive Appointments",
    location: "London",
    url: "https://www.reed.co.uk/jobs/senior-it-engineer/56377957",
    posted_at: "2026-01-26T00:00:00",
  },
];

function formatPosted(iso: string) {
  const d = new Date(iso);
  // lightweight formatting without deps
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SourceBadge({ source }: { source: string }) {
  const label = source.toLowerCase();
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full px-3 py-1 text-xs",
        label === "adzuna" && "bg-muted/60 text-foreground",
        label === "reed" && "bg-muted/60 text-foreground"
      )}
    >
      {label}
    </Badge>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
        {hint ? (
          <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function JobsPage() {
  const [q, setQ] = React.useState("");
  const [source, setSource] = React.useState<"all" | "adzuna" | "reed">("all");
  const [status, setStatus] = React.useState<"all" | "new" | "seen">("all");

  // MVP: status is placeholder (you’ll wire it when you track seen/new)
  const jobs = React.useMemo(() => {
    return demoJobs
      .filter((j) => (source === "all" ? true : j.source === source))
      .filter((j) => {
        const hay = `${j.title} ${j.company} ${j.location} ${j.source}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      });
  }, [q, source]);

  return (
    <div className="pb-10">
      <PageHeader
        title="Jobs"
        description="Your deduped feed across sources."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/app/support">Manage sources</a>
            </Button>
            <Button variant="secondary">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="px-4 pt-5 md:px-6">
        {/* Stats */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total jobs" value={jobs.length} hint="Across all sources" />
          <StatCard label="New (24h)" value="—" hint="Coming soon" />
          <StatCard label="Sources" value="2" hint="adzuna + reed" />
          <StatCard label="Last sync" value="—" hint="Runs on schedule" />
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-md">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search roles, companies, locations…"
                className="h-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={source === "all" ? "default" : "outline"}
                className="h-9 rounded-full px-4"
                onClick={() => setSource("all")}
              >
                All sources
              </Button>
              <Button
                variant={source === "adzuna" ? "default" : "outline"}
                className="h-9 rounded-full px-4"
                onClick={() => setSource("adzuna")}
              >
                Adzuna
              </Button>
              <Button
                variant={source === "reed" ? "default" : "outline"}
                className="h-9 rounded-full px-4"
                onClick={() => setSource("reed")}
              >
                Reed
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden text-xs text-muted-foreground md:block">
              Status:
            </div>
            <Button
              variant={status === "all" ? "default" : "outline"}
              className="h-9 rounded-full px-4"
              onClick={() => setStatus("all")}
            >
              All
            </Button>
            <Button
              variant={status === "new" ? "default" : "outline"}
              className="h-9 rounded-full px-4"
              onClick={() => setStatus("new")}
            >
              New
            </Button>
            <Button
              variant={status === "seen" ? "default" : "outline"}
              className="h-9 rounded-full px-4"
              onClick={() => setStatus("seen")}
            >
              Seen
            </Button>

            <Button variant="outline" size="icon" className="h-9 w-9">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="mt-5 overflow-hidden shadow-sm">
          <CardHeader className="border-b py-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Jobs feed</CardTitle>
              <div className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{jobs.length}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Header row */}
            <div className="hidden grid-cols-12 gap-3 border-b px-5 py-3 text-xs text-muted-foreground md:grid">
              <div className="col-span-5">Role</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-2 text-right">Posted</div>
            </div>

            {/* Rows */}
            <div className="divide-y">
              {jobs.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="text-sm font-medium">No jobs match your filters</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Try clearing filters or searching a different keyword.
                  </div>
                </div>
              ) : (
                jobs.map((j) => (
                  <div
                    key={j.uid}
                    className={cn(
                      "group grid grid-cols-1 gap-2 px-5 py-4 transition-colors",
                      "hover:bg-accent/40 md:grid-cols-12 md:gap-3"
                    )}
                  >
                    {/* Role */}
                    <div className="md:col-span-5">
                      <div className="flex items-start justify-between gap-3 md:block">
                        <div className="min-w-0">
                          <div className="truncate font-medium">{j.title}</div>
                          <div className="mt-1 truncate text-sm text-muted-foreground">
                            {j.location}
                          </div>
                        </div>

                        {/* mobile action */}
                        <a
                          href={j.url}
                          target="_blank"
                          rel="noreferrer"
                          className="md:hidden"
                          aria-label="Open job link"
                        >
                          <Button variant="outline" size="icon" className="h-9 w-9">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>

                    {/* Company */}
                    <div className="md:col-span-3">
                      <div className="text-sm font-medium md:mt-0">{j.company}</div>
                      <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                        {j.source_job_id}
                      </div>
                    </div>

                    {/* Source */}
                    <div className="md:col-span-2">
                      <SourceBadge source={j.source} />
                    </div>

                    {/* Posted + Desktop action */}
                    <div className="flex items-center justify-between md:col-span-2 md:justify-end md:gap-2">
                      <div className="text-xs text-muted-foreground md:text-right">
                        {formatPosted(j.posted_at)}
                      </div>

                      <a
                        href={j.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden md:block"
                        aria-label="Open job link"
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>

                    <div className="md:hidden">
                      <Separator className="mt-3" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
