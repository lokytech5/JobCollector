import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import type { NavItem } from "./nav";
import { SidebarContent } from "./sidebar";

export function Topbar({
  brand,
  mainNav,
  secondaryNav,
  showSearch = true,
  onSearch,
}: {
  brand?: string;
  mainNav: NavItem[];
  secondaryNav: NavItem[];
  showSearch?: boolean;
  onSearch?: (q: string) => void;
}) {
  const [q, setQ] = React.useState("");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        {/* Mobile sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="border-b px-4 py-3">
              <Link to="/app" className="text-sm font-semibold">
                {brand}
              </Link>
            </div>
            <SidebarContent main={mainNav} secondary={secondaryNav} />
          </SheetContent>
        </Sheet>

        {/* Brand */}
<Link
  to="/app"
  className="group inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold tracking-tight hover:bg-accent hover:text-accent-foreground"
>
  {/* Logo mark */}
  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-background shadow-sm">
    {/* you can swap Sparkles for your own logo later */}
    <Sparkles className="h-4 w-4" />
  </span>

  {/* Wordmark */}
  <span className="leading-none">JC</span>

  {/* Optional tiny badge (remove if you don’t want it) */}
  <span className="hidden rounded-full border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline">
    beta
  </span>

  {/* subtle divider cue */}
  <span className="ml-1 hidden h-5 w-px bg-border sm:inline-block" />
</Link>


        {/* Search */}
        <div className="flex flex-1 items-center justify-center">
          {showSearch ? (
            <div className="w-full max-w-lg">
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  onSearch?.(e.target.value);
                }}
                placeholder="Search…"
                className="h-9"
              />
            </div>
          ) : (
            <div />
          )}
        </div>

        <ThemeToggle />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="ml-2 hidden text-sm md:inline">Account</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/support">Support</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                // hook this to your auth logout
                console.log("logout");
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
