import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-background">
          <div className="w-full p-4 space-y-4">
            <div className="text-sm font-medium">Navigation</div>
            <Separator />
            <nav className="space-y-1 text-sm text-muted-foreground">
              <div className="text-foreground">Dashboard</div>
              <div>Searches</div>
              <div>Settings</div>
            </nav>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Saved searches
              </div>
              <div className="text-sm text-muted-foreground">
                (List will render here)
              </div>
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-10 border-b border-border bg-background">
            <div className="mx-auto w-full max-w-7xl p-3 md:p-4 flex items-center gap-2">
              {/* Mobile: sidebar sheet */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Menu</Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                      <nav className="space-y-2 text-sm">
                        <div className="font-medium">Dashboard</div>
                        <div className="text-muted-foreground">Searches</div>
                        <div className="text-muted-foreground">Settings</div>
                      </nav>
                      <Separator />
                      <div className="text-sm text-muted-foreground">
                        Saved searches list (later)
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Global search */}
              <div className="flex-1">
                <Input placeholder="Search jobs, companies, locations…" />
              </div>

              {/* Run now (global) */}
              <Button>Run now</Button>

              {/* Account/settings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Account</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Theme</DropdownMenuItem>
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="mx-auto w-full max-w-7xl p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
