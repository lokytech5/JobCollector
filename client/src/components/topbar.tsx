import * as React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

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
import { SidebarContent } from "./sidebar";
import type { NavItem } from "./nav";

export function Topbar({
  brand = "YourApp",
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
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
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
        <Link to="/app" className="text-sm font-semibold tracking-tight">
          {brand}
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
