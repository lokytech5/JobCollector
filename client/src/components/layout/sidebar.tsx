import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { NavItem } from "./nav";
import { Plus } from "lucide-react";

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      end={item.href === "/app"}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
        )
      }
    >
      {/* active indicator */}
      <span className={cn(
        "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary opacity-0 transition-opacity",
        "group-[.active]:opacity-100"
      )} />

      <Icon className="h-4 w-4 opacity-80" />
      <span className="truncate">{item.title}</span>
    </NavLink>
  );
}

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-3 py-4">
      <div className="px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

export function SidebarContent({
  main,
  secondary,
}: {
  main: NavItem[];
  secondary: NavItem[];
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Primary action */}
      <div className="px-3 pt-4">
        <Button className="w-full justify-start" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New saved search
        </Button>
      </div>

      <SidebarSection label="Main">
        {main.map((item) => (
          <SidebarLink key={item.href} item={item} />
        ))}
      </SidebarSection>

      <div className="px-3">
        <Separator />
      </div>

      <SidebarSection label="More">
        {secondary.map((item) => (
          <SidebarLink key={item.href} item={item} />
        ))}
      </SidebarSection>

      <div className="mt-auto px-3 pb-4">
        <Separator className="mb-3" />
        <div className="rounded-xl border bg-muted/20 p-3">
          <div className="text-sm font-medium">Tip</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Keep saved searches specific (role + location) for cleaner results.
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  main,
  secondary,
  className,
}: {
  main: NavItem[];
  secondary: NavItem[];
  className?: string;
}) {
  return (
    <aside className={cn("hidden md:block md:w-64 lg:w-72", className)}>
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] border-r bg-background/60 backdrop-blur">
        <ScrollArea className="h-full">
          <SidebarContent main={main} secondary={secondary} />
        </ScrollArea>
      </div>
    </aside>
  );
}
