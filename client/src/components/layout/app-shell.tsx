import { Outlet } from "react-router-dom";


import { Topbar } from "./topbar";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";
import { mainNav, secondaryNav } from "./nav";


export function AppShell({
  brand = "JC",
  showSearch = true,
}: {
  brand?: string;
  showSearch?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Topbar
        brand={brand}
        mainNav={mainNav}
        secondaryNav={secondaryNav}
        showSearch={showSearch}
      />

      <div className="flex">
        <Sidebar main={mainNav} secondary={secondaryNav} />

        <main className="flex-1">
          {/* Content wrapper */}
          <div className="mx-auto w-full max-w-6xl">
            {/* Route content (your pages) */}
            <Outlet />
          </div>

          <Footer brand="JobCollector" />
        </main>
      </div>
    </div>
  );
}
