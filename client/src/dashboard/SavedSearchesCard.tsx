import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { SavedSearch } from "@/types/job"

type Props = {
  searches: SavedSearch[]
  isLoading?: boolean
  onOpenSearch?: (name: string) => void
  onCreateSearch?: () => void
}

function RowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  )
}

export function SavedSearchesCard({
  searches,
  isLoading = false,
  onOpenSearch,
  onCreateSearch,
}: Props) {
  const empty = !isLoading && searches.length === 0

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saved searches
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              Your configured searches and seen counts.
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={onCreateSearch}>
            New
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Separator />

        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        ) : empty ? (
          <div className="py-6">
            <div className="text-sm font-medium">No saved searches yet</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Create your first search to start collecting jobs.
            </div>
            <Button className="mt-4" onClick={onCreateSearch}>
              Create your first search
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {searches.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {s.seen_count} seen
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground truncate">
                    {s.query} • {s.location}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenSearch?.(s.name)}
                >
                  Open
                </Button>
              </div>
            ))}
          </div>
        )}

        <Separator className="my-4" />

        <Button variant="secondary" className="w-full" onClick={onCreateSearch}>
          + Create search
        </Button>
      </CardContent>
    </Card>
  )
}
