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
  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    {/* Left: Title */}
    <div className="min-w-0">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-xs text-muted-foreground">
        Quick view of saved searches and latest jobs.
      </p>
    </div>

    {/* Right: Actions */}
    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
      <Button className="w-full sm:w-auto" onClick={onRunAllNow} disabled={isRunning}>
        {isRunning ? "Running…" : "Run all now"}
      </Button>

      <Button className="w-full sm:w-auto" variant="secondary" onClick={onNewSearch}>
        New search
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full sm:w-auto" variant="outline">
            Quick actions
          </Button>
        </DropdownMenuTrigger>
        {/* ... */}
      </DropdownMenu>
    </div>
  </div>

  <Separator />
</div>

  )
}
