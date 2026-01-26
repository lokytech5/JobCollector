import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Search,
  Settings,
  Sun,
  Moon,
  User,
  Menu,
} from "lucide-react"

type NavKey = "dashboard" | "searches" | "settings"

export type SavedSearchNavItem = {
  name: string
  seen_count?: number
}

type AppShellProps = {
  children: ReactNode

  // Optional routing integration:
  activeNav?: NavKey

  // Optional saved searches for sidebar:
  savedSearches?: SavedSearchNavItem[]
  onOpenSearch?: (name: string) => void

  onNavigate?: (key: NavKey) => void
  onRunNow?: () => void
}

function useThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    const initial = stored === "dark" ? "dark" : "light"
    setTheme(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")
  }, [])

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }

  return { theme, toggle }
}

function SidebarNavItem({
  collapsed,
  active,
  label,
  icon,
  onClick,
}: {
  collapsed: boolean
  active?: boolean
  label: string
  icon: ReactNode
  onClick?: () => void
}) {
  const base =
    "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors"
  const activeCls = "bg-muted text-foreground"
  const idleCls = "text-muted-foreground hover:bg-muted hover:text-foreground"

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            className={cn(base, "justify-center", active ? activeCls : idleCls)}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(base, active ? activeCls : idleCls)}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

export function AppShell({
  children,
  activeNav = "dashboard",
  savedSearches = [],
  onOpenSearch,
  onNavigate,
  onRunNow,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, toggle } = useThemeToggle()

  const nav = useMemo(
    () => [
      { key: "dashboard" as const, label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { key: "searches" as const, label: "Searches", icon: <Search className="h-4 w-4" /> },
      { key: "settings" as const, label: "Settings", icon: <Settings className="h-4 w-4" /> },
    ],
    []
  )

  const sidebarWidth = collapsed ? "w-[72px]" : "w-64"

  const SidebarContent = (
    <div className="h-full flex flex-col">
      {/* App header */}
      <div className={cn("p-4", collapsed ? "px-3" : "")}>
        <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "")}>
          <div className="h-9 w-9 rounded-md border border-border bg-card" />
          {!collapsed ? (
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight">Job Tracker</div>
              <div className="text-xs text-muted-foreground truncate">Personal workspace</div>
            </div>
          ) : null}
        </div>
      </div>

      <Separator />

      {/* Primary nav */}
      <div className={cn("p-3 space-y-1", collapsed ? "px-2" : "")}>
        {!collapsed ? (
          <div className="text-xs font-medium text-muted-foreground px-2 pb-1">
            Navigation
          </div>
        ) : null}

        <TooltipProvider delayDuration={120}>
          {nav.map((item) => (
            <SidebarNavItem
              key={item.key}
              collapsed={collapsed}
              active={activeNav === item.key}
              label={item.label}
              icon={item.icon}
              onClick={() => onNavigate?.(item.key)}
            />
          ))}
        </TooltipProvider>
      </div>

      <Separator />

      {/* Saved searches list */}
      <div className={cn("p-3 flex-1", collapsed ? "px-2" : "")}>
        {!collapsed ? (
          <div className="flex items-center justify-between px-2">
            <div className="text-xs font-medium text-muted-foreground">Saved searches</div>
            <Badge variant="secondary" className="text-[10px]">
              {savedSearches.length}
            </Badge>
          </div>
        ) : null}

        <ScrollArea className={cn("mt-2", collapsed ? "h-[calc(100vh-290px)]" : "h-[calc(100vh-280px)]")}>
          <div className={cn("space-y-1", collapsed ? "" : "pr-2")}>
            {savedSearches.length === 0 ? (
              !collapsed ? (
                <div className="px-2 py-2 text-xs text-muted-foreground">
                  No saved searches yet.
                </div>
              ) : null
            ) : (
              savedSearches.map((s) => {
                const row = (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => onOpenSearch?.(s.name)}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm",
                      "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    )}
                  >
                    <span className={cn("truncate", collapsed ? "hidden" : "")}>{s.name}</span>
                    {!collapsed ? (
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {(s.seen_count ?? 0).toString()}
                      </Badge>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                    )}
                  </button>
                )

                if (!collapsed) return row

                return (
                  <TooltipProvider key={s.name} delayDuration={120}>
                    <Tooltip>
                      <TooltipTrigger asChild>{row}</TooltipTrigger>
                      <TooltipContent side="right">{s.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Collapse control */}
      <div className={cn("p-3", collapsed ? "px-2" : "")}>
        <Button
          variant="outline"
          className={cn("w-full", collapsed ? "px-0" : "")}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : (
            <span className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Collapse
            </span>
          )}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className={cn("hidden md:block shrink-0 border-r border-border bg-background", sidebarWidth)}>
          {SidebarContent}
        </aside>

        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
        {/* Top bar */}
<header className="sticky top-0 z-10 border-b border-border bg-background">
  <div className="mx-auto w-full max-w-7xl px-4 py-3 md:px-6">
    {/* Row 1: menu + search */}
    <div className="flex items-center gap-2">
      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[85vw] sm:w-80 p-0">
            <SheetHeader className="p-4">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="h-[calc(100vh-73px)] overflow-hidden">
              {SidebarContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Global search */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9 w-full" placeholder="Search jobs, companies, locations…" />
      </div>
    </div>

    {/* Row 2: actions (wrap on small) */}
    <div className="mt-2 flex items-center justify-end gap-2 flex-wrap">
      <Button onClick={onRunNow} className="shrink-0">
        <span className="hidden sm:inline">Run now</span>
        <span className="sm:hidden">Run</span>
      </Button>

      <Button variant="outline" size="icon" onClick={toggle} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Account">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onNavigate?.("settings")}>Settings</DropdownMenuItem>
          <DropdownMenuItem disabled>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</header>


          {/* Page content */}
          <main className="mx-auto w-full max-w-7xl p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
