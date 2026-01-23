import './App.css'
import { Toaster } from './components/toaster'
import DashboardPage from './dashboard/DashboardPage'
import { AppShell } from './layout/AppShell'

function App() {

  return (
    <>
      <AppShell>
        <DashboardPage />
      </AppShell>

      {/* Global toast outlet */}
      <Toaster />
    </>
  )
}

export default App
