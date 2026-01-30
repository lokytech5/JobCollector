import { useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockByUid: Record<string, any> = {
  "adzuna:5601447823": {
    uid: "adzuna:5601447823",
    source: "adzuna",
    title: "Cloud Engineer",
    company: "Réalta Associates",
    location: "Farringdon, Central London",
    url: "https://www.adzuna.co.uk/jobs/details/5601447823",
    posted_at: "2026-01-27T01:43:28",
  },
};

export function JobDetailPage() {
  const params = useParams();
  const uid = params.uid ? decodeURIComponent(params.uid) : "";
  const job = uid ? mockByUid[uid] : null;

  return (
    <div className="pb-10">
      <PageHeader
        title={job?.title ?? "Job"}
        description={job ? `${job.company} • ${job.location}` : "Loading…"}
        actions={
          job?.url ? (
            <Button asChild>
              <a href={job.url} target="_blank" rel="noreferrer">
                Open original <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : null
        }
      />

      <div className="px-4 pt-6 md:px-6">
        {job ? (
          <div className="grid gap-4 lg:grid-cols-12">
            <Card className="shadow-sm lg:col-span-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {job.source}
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    {job.uid}
                  </Badge>
                </div>

                <div className="text-muted-foreground">
                  Posted:{" "}
                  <span className="text-foreground/80">
                    {new Date(job.posted_at).toLocaleString()}
                  </span>
                </div>

                <div className="rounded-lg border bg-muted/20 p-3 text-muted-foreground">
                  MVP: notes, saved/seen, AI summary, and score will live here.
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm lg:col-span-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">AI preview</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Coming next: 3–6 bullet summary, extracted stack, and fit score.
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Job not found.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
