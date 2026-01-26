import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/use-toast"

type Props = {
  emailToAddress?: string
  schedulerText?: string
}

export default function SettingsPage({
  emailToAddress = "Not configured",
  schedulerText = "Scheduled daily at 08:00 GMT via Supabase cron ✅",
}: Props) {
  const sendTestEmail = async () => {
    try {
      // TODO: call your backend proxy (e.g. POST /api/tasks/email/test)
      toast({ title: "Test email queued", description: "If configured, you should receive it shortly." })
    } catch (e: any) {
      toast({
        title: "Test email failed",
        description: e?.message ?? "Could not trigger test email.",
      })
    }
  }

  const runSchedulerNow = async () => {
    try {
      // TODO: call backend proxy to trigger scheduled run
      toast({ title: "Run queued", description: "Scheduler run triggered." })
    } catch (e: any) {
      toast({
        title: "Run failed",
        description: e?.message ?? "Could not trigger run.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-xs text-muted-foreground">Email, scheduler, and AI configuration.</p>
        </div>
      </div>

      <Separator />

      {/* Email */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium">To address</div>
              <div className="text-xs text-muted-foreground truncate">{emailToAddress}</div>
            </div>
            <Badge variant={emailToAddress === "Not configured" ? "outline" : "secondary"}>
              {emailToAddress === "Not configured" ? "Not configured" : "Configured"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={sendTestEmail}>Send test email</Button>
            <Button variant="outline" disabled>
              Edit (later)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduler */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Scheduler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">{schedulerText}</div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={runSchedulerNow}>Run now</Button>
            <Button variant="outline" disabled>
              Change schedule (later)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Provider</div>
              <div className="text-xs text-muted-foreground">Future</div>
            </div>
            <Badge variant="outline">Not set</Badge>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">API key status</div>
              <div className="text-xs text-muted-foreground">
                Stored server-side only. Never displayed in the UI.
              </div>
            </div>
            <Badge variant="outline">Unknown</Badge>
          </div>

          <Button variant="outline" disabled>
            Configure AI (later)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
