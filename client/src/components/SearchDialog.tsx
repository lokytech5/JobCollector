import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SavedSearch, SearchSource } from "@/types/job"
import { toast } from "./use-toast"

type Mode = "create" | "edit"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void

  mode: Mode
  initial?: Partial<SavedSearch> // for edit
  existingNames?: string[] // for uniqueness warning

  onSave: (payload: SavedSearch) => Promise<void> | void
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function SearchDialog({
  open,
  onOpenChange,
  mode,
  initial,
  existingNames = [],
  onSave,
}: Props) {
  const [name, setName] = useState("")
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [limit, setLimit] = useState<number>(50)

  // Optional advanced
  const [source, setSource] = useState<SearchSource>("All")
  const [postedAfter, setPostedAfter] = useState("") // ISO date string, optional

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    setName(initial?.name ?? "")
    setQuery(initial?.query ?? "")
    setLocation(initial?.location ?? "")
    setLimit(initial?.limit ?? 50)
    setSource((initial?.source as SearchSource) ?? "All")
    setPostedAfter(initial?.posted_after ?? "")
  }, [open, initial])

  const normalizedName = useMemo(() => slugify(name), [name])

  const nameExists = useMemo(() => {
    const set = new Set(existingNames.map((n) => n.toLowerCase()))
    const current = (initial?.name ?? "").toLowerCase()
    // In edit mode, allow current name
    if (mode === "edit" && normalizedName.toLowerCase() === current) return false
    return set.has(normalizedName.toLowerCase())
  }, [existingNames, normalizedName, mode, initial?.name])

  const canSave = useMemo(() => {
    if (!normalizedName) return false
    if (!query.trim()) return false
    if (!location.trim()) return false
    if (!Number.isFinite(limit) || limit <= 0) return false
    return true
  }, [normalizedName, query, location, limit])

  const handleSave = async () => {
    if (!canSave) return

    const payload: SavedSearch = {
      name: normalizedName,
      query: query.trim(),
      location: location.trim(),
      limit,
      // Only include optional fields if you want them enabled now
      source,
      posted_after: postedAfter || undefined,
    }

    try {
      setIsSaving(true)
      await onSave(payload)
      toast({
        title: mode === "create" ? "Search created" : "Search updated",
        description: `${payload.name} • ${payload.query} • ${payload.location}`,
      })
      onOpenChange(false)
    } catch (e: any) {
      toast({
        title: "Save failed",
        description: e?.message ?? "Could not save the search.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-base font-medium">
            {mode === "create" ? "Create search" : "Edit search"}
          </DialogTitle>
          <div className="text-xs text-muted-foreground">
            Name should be slug-like. We will normalize it automatically.
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. frontend-london"
              autoComplete="off"
            />
            <div className="text-xs text-muted-foreground">
              Normalized: <span className="font-medium text-foreground">{normalizedName || "—"}</span>
            </div>

            {nameExists ? (
              <div className="text-xs text-muted-foreground">
                Warning: a search with this name already exists. Saving may overwrite it (upsert).
              </div>
            ) : null}
          </div>

          {/* Query */}
          <div className="space-y-2">
            <Label htmlFor="query">Query (q)</Label>
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. react typescript"
              autoComplete="off"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. London, UK"
              autoComplete="off"
            />
          </div>

          {/* Limit */}
          <div className="space-y-2">
            <Label htmlFor="limit">Limit</Label>
            <Input
              id="limit"
              type="number"
              inputMode="numeric"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              min={1}
              placeholder="50"
            />
            <div className="text-xs text-muted-foreground">Max results to ingest per run.</div>
          </div>

          <Separator />

          {/* Optional advanced (kept lightweight) */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Advanced (optional)</div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={source} onValueChange={(v) => setSource(v as SearchSource)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Reed">Reed</SelectItem>
                    <SelectItem value="Adzuna">Adzuna</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postedAfter">Posted after</Label>
                <Input
                  id="postedAfter"
                  type="date"
                  value={postedAfter}
                  onChange={(e) => setPostedAfter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave || isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
