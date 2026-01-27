import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const links = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Support", href: "/app/support" },
];

export function Footer({
  brand = "JobCollector",
  version,
}: {
  brand?: string;
  version?: string;
}) {
  return (
    <footer className="mt-10">
      <Separator />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm md:flex-row md:items-center md:justify-between md:px-6">
        <div className="text-muted-foreground">
          © {new Date().getFullYear()} {brand}. All rights reserved.
          {version ? (
            <span className="ml-2 text-xs text-muted-foreground">v{version}</span>
          ) : null}
        </div>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
