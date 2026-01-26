import { useState } from 'react'
import './App.css'
import { Toaster } from './components/toaster'
import DashboardPage from './dashboard/DashboardPage'
import { AppShell } from './layout/AppShell'
import SettingsPage from './settings/SettingsPage'
import HomePage from './home/HomePage'

function App() {

    const [page, setPage] = useState<"home" | "dashboard" | "settings">("dashboard")

  return (
    <>
     <AppShell
        activeNav={page === "settings" ? "settings" : "dashboard"}
        savedSearches={[
          { name: "Frontend London", seen_count: 31 },
          { name: "Remote Full Stack", seen_count: 12 },
        ]}
        onNavigate={(key) => {
          if (key === "settings") setPage("settings")
          if (key === "dashboard") setPage("dashboard")
          if (key === "searches") setPage("dashboard") // until you add the Searches page route
        }}
        onOpenSearch={(name) => console.log("open search:", name)}
        onRunNow={() => console.log("run now")}
      >
        {page === "home" ? <HomePage /> : null}
        {page === "dashboard" ? <DashboardPage /> : null}
        {page === "settings" ? <SettingsPage /> : null}
      </AppShell>

      <Toaster />
    </>
  )
}

export default App
