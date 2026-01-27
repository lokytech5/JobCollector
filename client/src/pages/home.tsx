import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Sparkles,
  Mail,
  Search,
  Shield,
  Clock,
  Layers,
  MapPin, Database, SlidersHorizontal, X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Reuse your existing toggle (adjust import path if needed)
import { ThemeToggle } from "@/components/layout/theme-toggle";

const sampleJobs = [
  {
    title: "Backend Engineer (FastAPI)",
    company: "FinTech Co",
    location: "London (Hybrid)",
    tag: "NEW",
  },
  {
    title: "Python Engineer — APIs",
    company: "HealthTech",
    location: "Remote (UK)",
    tag: "NEW",
  },
  {
    title: "Senior Backend Engineer — AWS",
    company: "ScaleUp",
    location: "London",
    tag: "SEEN",
  },
];

const comparisonRows = [
  {
    left: "Open 5–10 job boards and repeat the same searches.",
    right: "One saved search runs across sources automatically.",
  },
  {
    left: "See the same roles multiple times across sites.",
    right: "Duplicates removed + normalized into one clean feed.",
  },
  {
    left: "Hard to tell what’s actually new since yesterday.",
    right: "Seen tracking per search → only fresh matches.",
  },
  {
    left: "Manual triage every morning.",
    right: "Daily digest (08:00 GMT) — only when there’s new work.",
  },
  {
    left: "Noise-heavy lists with weak relevance.",
    right: "AI summaries + ranking to help you review faster.",
  },
];


export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Public header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>JobCollector</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/app">
                Go to dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* subtle background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-72 w-[900px] -translate-x-1/2 rounded-full bg-muted/40 blur-3xl dark:bg-muted/20" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
  {/* Badge + small descriptor */}
  <div className="flex flex-col items-center gap-2 md:items-start">
  <Badge variant="secondary" className="rounded-full px-3 py-1">
    Saved Searches • Daily Digest • AI Ranking
  </Badge>

  <p className="text-xs text-muted-foreground">
    Built for signal. Not noise.
  </p>
</div>

   {/* Headline */}
 <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
  Spend less time searching jobs.
  <span className="block text-muted-foreground">
    Spend more time applying.
  </span>
</h1>



  {/* Subhead */}
 <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
  Pull one feed from multiple sources, remove duplicates, and track what you’ve
  already seen and get a clean daily digest by email.
  <span className="text-foreground/80">
    {" "}
    AI summaries and ranking to help you review faster.
  </span>
</p>

 {/* CTAs */}
  <div className="mt-7 flex w-full flex-wrap items-center justify-center gap-3 md:justify-start">
    <Button asChild size="lg" className="h-11 w-full px-5 md:w-auto">
      <Link to="/app">
        Create saved searches <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>

    <Button asChild variant="outline" size="lg" className="h-11 w-full px-5 md:w-auto">
      <Link to="/login">Sign in</Link>
    </Button>
  </div>

  {/* Feature bullets */}
  <div className="mt-7 grid w-full gap-x-6 gap-y-3 text-sm text-muted-foreground md:grid-cols-2">
    <div className="flex items-center justify-center gap-2 md:justify-start">
      <Shield className="h-4 w-4 text-foreground/60" />
      <span>Normalized jobs</span>
    </div>
    <div className="flex items-center justify-center gap-2 md:justify-start">
      <Mail className="h-4 w-4 text-foreground/60" />
      <span>Daily email digest (08:00 GMT)</span>
    </div>
    <div className="flex items-center justify-center gap-2 md:justify-start">
      <Search className="h-4 w-4 text-foreground/60" />
      <span>“New jobs since last run”</span>
    </div>
    <div className="flex items-center justify-center gap-2 md:justify-start">
      <Layers className="h-4 w-4 text-foreground/60" />
      <span>Seen tracking per search</span>
    </div>
  </div>
</div>



            {/* Right column: “product preview” stack */}
            {/* Right column: “product preview” stack */}
<div className="space-y-4">
  {/* Saved Search example */}
 <Card className="overflow-hidden border bg-gradient-to-b from-muted/30 to-background shadow-sm dark:from-white/5">
  {/* subtle top accent */}
  <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />

  <CardHeader className="pb-4">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <div className="text-xs font-medium tracking-wide text-muted-foreground">
          SAVED SEARCH RULE
        </div>
        <div className="text-lg font-semibold leading-tight">backend-london</div>
        <p className="text-sm text-muted-foreground">
          Create it once — we keep it fresh every day.
        </p>
      </div>

      <Badge variant="secondary" className="rounded-full px-3">
        Active
      </Badge>
    </div>
  </CardHeader>

  <CardContent className="space-y-4">
    {/* key facts */}
    <div className="grid gap-3 rounded-xl bg-background/60 p-4 ring-1 ring-border/50 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          Query
        </div>
        <div className="text-sm font-medium">backend engineer</div>
      </div>

      <Separator className="opacity-50" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Location
        </div>
        <div className="text-sm font-medium">London</div>
      </div>
    </div>

    {/* chips row */}
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
        <Database className="h-3.5 w-3.5" />
        Sources
      </div>

      <Badge variant="outline" className="rounded-full px-3">
        reed
      </Badge>
      <Badge variant="outline" className="rounded-full px-3">
        adzuna
      </Badge>

      <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        limit: <span className="font-medium text-foreground/80">50</span>
      </div>
    </div>

    {/* footer hint */}
    <div className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
      <span>Runs daily • deduped • seen tracking</span>
      <span className="font-medium text-foreground/70">08:00 GMT</span>
    </div>
  </CardContent>
</Card>


  {/* Latest jobs preview (lightweight “table-like” rows) */}
  <Card className="shadow-sm">
    <CardHeader>
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">Latest jobs (preview)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Fresh roles across your saved searches.
          </p>
        </div>

        <Badge variant="outline" className="h-7 rounded-full px-3">
          Today
        </Badge>
      </div>
    </CardHeader>

    <CardContent className="space-y-3">
      {/* “Columns” hint */}
      <div className="grid grid-cols-12 gap-3 px-1 text-xs text-muted-foreground">
        <div className="col-span-7">Role</div>
        <div className="col-span-3 text-right">Posted</div>
        <div className="col-span-2 text-right">Status</div>
      </div>

      {/* Rows */}
      {sampleJobs.map((j, idx) => (
        <div
          key={j.title}
          className="grid grid-cols-12 items-center gap-3 rounded-lg border p-3"
        >
          {/* Role + meta */}
          <div className="col-span-7 min-w-0">
            <div className="truncate font-medium">{j.title}</div>
            <div className="mt-1 truncate text-sm text-muted-foreground">
              {j.company} • {j.location}
            </div>
          </div>

          {/* Posted (demo) */}
          <div className="col-span-3 text-right text-sm text-muted-foreground">
            {idx === 0 ? "2h" : idx === 1 ? "6h" : "1d"}
          </div>

          {/* Status */}
          <div className="col-span-2 flex justify-end">
            <Badge
              variant={j.tag === "NEW" ? "default" : "secondary"}
              className="rounded-full"
            >
              {j.tag.toLowerCase()}
            </Badge>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>

  {/* Digest hint */}
  <div className="flex items-center gap-2 rounded-lg border bg-background p-3 text-sm text-muted-foreground">
    <Clock className="h-4 w-4" />
    Runs daily — emails only when there are new jobs.
  </div>
</div>



          </div>
        </div>
      </section>

      <Separator />

      {/* Why JobCollector (comparison) */}
<section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
  <div className="mb-6">
    <h2 className="text-2xl font-semibold tracking-tight">Why JobCollector</h2>
    <p className="mt-2 max-w-2xl text-muted-foreground">
      Stop juggling job boards. Run one search system that stays fresh daily.
    </p>
  </div>

  <Card className="relative overflow-hidden border bg-muted/10">
    {/* soft glow */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-24 left-1/2 h-60 w-[700px] -translate-x-1/2 rounded-full bg-muted/40 blur-3xl dark:bg-white/5" />
    </div>

    {/* Header */}
    <div className="grid gap-3 border-b px-5 py-5 md:grid-cols-2 md:gap-6 md:px-6">
      <div className="flex items-center justify-between md:justify-start md:gap-3">
        <Badge variant="outline" className="rounded-full">
          Job boards
        </Badge>
        <span className="text-xs text-muted-foreground md:hidden">
          The old way
        </span>
      </div>

      <div className="flex items-center justify-between md:justify-start md:gap-3">
        <Badge variant="secondary" className="rounded-full">
          JobCollector
        </Badge>
        <span className="text-xs text-muted-foreground md:hidden">
          The better way
        </span>
      </div>

      {/* desktop helper line */}
      <div className="hidden text-xs text-muted-foreground md:block">
        Manual, repetitive, noisy
      </div>
      <div className="hidden text-xs text-muted-foreground md:block">
        Automated, clean, trackable
      </div>
    </div>

    {/* Rows */}
    <div className="relative">
      {/* center divider (desktop) */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-border md:block" />

      <div className="divide-y">
        {comparisonRows.map((row, idx) => (
          <div
            key={idx}
            className="grid gap-4 px-5 py-5 md:grid-cols-2 md:gap-6 md:px-6"
          >
            {/* Left */}
            <div className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background">
                <X className="h-4 w-4 text-muted-foreground" />
              </span>
              <p className="text-sm text-muted-foreground">{row.left}</p>
            </div>

            {/* Right */}
            <div className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Check className="h-4 w-4 text-primary" />
              </span>
              <p className="text-sm">{row.right}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div className="border-t px-5 py-5 md:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm">
          <span className="font-medium">Set it once.</span>{" "}
          <span className="text-muted-foreground">We’ll keep it fresh daily.</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full">
            Deduped
          </Badge>
          <Badge variant="outline" className="rounded-full">
            Seen tracking
          </Badge>
          <Badge variant="outline" className="rounded-full">
            Daily digest
          </Badge>
        </div>
      </div>
    </div>
  </Card>
</section>

      







      {/* How it works (updated) */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-2 text-muted-foreground">
            Set rules once. Everything else runs automatically.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1) Save searches</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Create rules like “Backend Engineer • London” with optional filters.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">2) Ingest + dedupe</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We fetch from job sources, normalize fields, and prevent duplicates.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">3) Detect what’s new</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We compare against your “seen jobs” so you only get fresh matches.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">4) Deliver the digest</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Dashboard updates + daily email at 08:00 GMT (only if there’s new work).
            </CardContent>
          </Card>
        </div>
      </section>

      {/* MVP now vs next */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What you get today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                "Saved searches (your job rules)",
                "New job detection (no repeats)",
                "Daily email digest of new roles",
                "Dashboard to review new matches",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Use Our AI To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                "Short job summaries (3–6 bullets)",
                "Extracted stack + seniority signals",
                "Fit score (0–100) with explanations",
                "Smart flags: strong match / maybe / low match",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

{/* Trust / Status */}
<section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
  <div className="mb-6">
    <h2 className="text-2xl font-semibold tracking-tight">Built for consistency</h2>
    <p className="mt-2 max-w-2xl text-muted-foreground">
      A simple system you can rely on daily — with clear expectations while we keep shipping.
    </p>
  </div>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">No spam</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Digest sends only when there are new jobs to review.
      </CardContent>
    </Card>

    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Private by default</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Your saved searches and seen history stay tied to your account.
      </CardContent>
    </Card>

    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Early access</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        We’re actively improving relevance, speed, and source coverage.
      </CardContent>
    </Card>

    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Feedback loop</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Have a source request or a bug? Send it in Support.
      </CardContent>
    </Card>
  </div>

  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div className="space-y-0.5">
    <p className="text-sm font-medium">Want to shape what ships next?</p>
    <p className="text-sm text-muted-foreground">
      Tell us which sources to add and what roles you’re targeting.
    </p>
  </div>

  <Button asChild variant="outline" className="sm:h-10">
    <Link to="/app/support">Request a source</Link>
  </Button>
</div>

</section>


      {/* Simple public footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <div>© {new Date().getFullYear()} JobCollector</div>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link to="/app/support" className="hover:text-foreground hover:underline underline-offset-4">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
