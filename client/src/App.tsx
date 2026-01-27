import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { HomePage } from "@/pages/home";
import { AppShell } from "./components/layout/app-shell";
import { DashboardPage } from "./pages/dashboard-page";
import { ThemeProvider } from "./components/providers/theme-provider";

// placeholders
function LoginPage() {
  return <div className="p-6">Login</div>;
}

function NotFound() {
  return <div className="p-6">Page not found</div>;
}

export default function App() {
  return (
    <ThemeProvider>

    <BrowserRouter>
      <Routes>
        {/* Public homepage */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* App area uses AppShell */}
        <Route path="/app" element={<AppShell brand="YourApp" />}>
          <Route index element={<DashboardPage />} />
          {/* add more:
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              */}
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}
