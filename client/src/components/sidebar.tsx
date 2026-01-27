import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { NavItem } from "./nav";

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      end={item.href === "/app"}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground"
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span>{item.title}</span>
    </NavLink>
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
      <div className="px-3 py-4">
        <div className="text-xs font-medium text-muted-foreground">Main</div>
        <div className="mt-2 space-y-1">
          {main.map((item) => (
            <SidebarLink key={item.href} item={item} />
          ))}
        </div>
      </div>

      <div className="px-3">
        <Separator />
      </div>

      <div className="px-3 py-4">
        <div className="text-xs font-medium text-muted-foreground">
          More
        </div>
        <div className="mt-2 space-y-1">
          {secondary.map((item) => (
            <SidebarLink key={item.href} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-auto px-3 pb-4">
        <Separator className="mb-3" />
        <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
          Tip: Keep nav labels short for mobile.
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
      <div className="h-full border-r">
        <ScrollArea className="h-full">
          <SidebarContent main={main} secondary={secondary} />
        </ScrollArea>
      </div>
    </aside>
  );
}
