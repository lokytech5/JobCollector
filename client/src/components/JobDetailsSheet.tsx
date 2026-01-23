import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Job } from "@/types/job"

type JobDetailsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: Job | null
}

export function JobDetailsSheet({ open, onOpenChange, job }: JobDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-base font-medium">
            {job?.title ?? "Job details"}
          </SheetTitle>

          {job ? (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                {job.company} • {job.location}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{job.source}</Badge>
                <Badge variant={job.seen ? "outline" : "default"}>
                  {job.seen ? "Seen" : "Unseen"}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Posted: {job.postedAt}
                </div>
              </div>
            </div>
          ) : null}
        </SheetHeader>

        <div className="mt-4 flex gap-2">
          <Button
            className="w-full"
            disabled={!job?.url}
            onClick={() => job?.url && window.open(job.url, "_blank", "noopener,noreferrer")}
          >
            Open original posting
          </Button>

          {/* Future actions */}
          <Button variant="outline" className="w-full" disabled>
            AI Summary (soon)
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <section className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Raw details</div>
            <div className="text-sm whitespace-pre-wrap">
              {job?.rawDetails ?? job?.description ?? "No details available."}
            </div>
          </section>

          <Separator />

          <section className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">AI Summary</div>
            <div className="text-sm text-muted-foreground">
              Placeholder — will be populated by your summarizer later.
            </div>
          </section>

          <Separator />

          <section className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Why this matches you</div>
            <div className="text-sm text-muted-foreground">
              Placeholder — future personalization.
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
