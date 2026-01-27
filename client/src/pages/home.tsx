import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="rounded-2xl border p-6 md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome to YourApp
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Short value proposition here. Explain what users can do in the app.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/app">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
