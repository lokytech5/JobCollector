import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

type DashboardHeaderProps = {
  onRunAllNow?: () => void
  onNewSearch?: () => void
  onQuickAction?: (action: "run-latest" | "export" | "refresh") => void
  isRunning?: boolean
}

export function DashboardHeader({
  onRunAllNow,
  onNewSearch,
  onQuickAction,
  isRunning = false,
}: DashboardHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Title */}
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Quick view of saved searches and latest jobs.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button onClick={onRunAllNow} disabled={isRunning}>
            {isRunning ? "Running…" : "Run all now"}
          </Button>

          <Button variant="secondary" onClick={onNewSearch}>
            New search
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Quick actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onQuickAction?.("run-latest")}>
                Run latest ingest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onQuickAction?.("refresh")}>
                Refresh dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onQuickAction?.("export")}>
                Export searches (CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator />
    </div>
  )
}
