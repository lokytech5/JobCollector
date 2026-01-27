import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  LifeBuoy,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/app", icon: LayoutDashboard },
  { title: "Projects", href: "/app/projects", icon: FolderKanban },
  { title: "Users", href: "/app/users", icon: Users },
];

export const secondaryNav: NavItem[] = [
  { title: "Settings", href: "/app/settings", icon: Settings },
  { title: "Support", href: "/app/support", icon: LifeBuoy },
];
