"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Zap, RotateCcw, RotateCw, AlertTriangle, Square } from "lucide-react"
import { CuttingResults2D } from "@/components/cutting-results-2d"
import { optimize2DCutting } from "@/lib/cutting-algorithms-2d"
import type { Sheet, Piece2D, CalculatorSettings2D } from "@/features/calculators/common/types"

type OptimizeResult = ReturnType<typeof optimize2DCutting>

const DEFAULT_SHEETS: Sheet[] = [{ id: "1", width: 2440, height: 1220, quantity: 5 }]
const DEFAULT_PIECES: Piece2D[] = [
  { id: "1", width: 600, height: 400, quantity: 8, label: "Panel A", canRotate: true },
  { id: "2", width: 300, height: 800, quantity: 4, label: "Panel B", canRotate: true },
  { id: "3", width: 450, height: 300, quantity: 6, label: "Panel C", canRotate: false },
]
const DEFAULT_SETTINGS: CalculatorSettings2D = { kerfWidth: 3, minWasteArea: 10000, allowRotation: true, margin: 10 }

function UnitInput({ unit, className, ...props }: React.ComponentProps<typeof Input> & { unit: string }) {
  return (
    <div className="relative">
      <Input {...props} className={`pr-9 ${className ?? ""}`} />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/70 font-mono">
        {unit}
      </span>
    </div>
  )
}

export function Calculator2D() {
  const [sheets, setSheets] = useState<Sheet[]>(DEFAULT_SHEETS)
  const [pieces, setPieces] = useState<Piece2D[]>(DEFAULT_PIECES)
  const [settings, setSettings] = useState<CalculatorSettings2D>(DEFAULT_SETTINGS)
  const [results, setResults] = useState<OptimizeResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addSheet = () => {
    setSheets((prev) => [...prev, { id: Date.now().toString(), width: 2440, height: 1220, quantity: 1 }])
  }

  const removeSheet = (id: string) => setSheets((prev) => prev.filter((s) => s.id !== id))

  const updateSheet = (id: string, field: keyof Sheet, value: number) => {
    setSheets((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const addPiece = () => {
    setPieces((prev) => [
      ...prev,
      { id: Date.now().toString(), width: 0, height: 0, quantity: 1, label: `Panel ${String.fromCharCode(65 + prev.length)}`, canRotate: true },
    ])
  }

  const removePiece = (id: string) => setPieces((prev) => prev.filter((p) => p.id !== id))

  const updatePiece = (id: string, field: keyof Piece2D, value: number | string | boolean) => {
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const validate = (): string | null => {
    const maxW = Math.max(...sheets.map((s) => s.width))
    const maxH = Math.max(...sheets.map((s) => s.height))
    for (const piece of pieces) {
      if (piece.width <= 0 || piece.height <= 0)
        return `Piece "${piece.label || piece.id}" must have positive width and height.`
      const fitsNormal = piece.width <= maxW && piece.height <= maxH
      const fitsRotated = piece.canRotate && piece.height <= maxW && piece.width <= maxH
      if (!fitsNormal && !fitsRotated)
        return `Piece "${piece.label || piece.id}" (${piece.width}×${piece.height}mm) is too large for any sheet.`
    }
    if (sheets.some((s) => s.width <= 0 || s.height <= 0)) return "All sheets must have positive dimensions."
    return null
  }

  const handleOptimize = async () => {
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError(null)
    setIsCalculating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setResults(optimize2DCutting(sheets, pieces, settings))
    } catch (err) {
      console.error("2D Optimization failed:", err)
      setError("Optimization failed. Please check your inputs.")
    } finally {
      setIsCalculating(false)
    }
  }

  const resetCalculator = () => {
    setSheets(DEFAULT_SHEETS); setPieces(DEFAULT_PIECES)
    setSettings(DEFAULT_SETTINGS); setResults(null); setError(null)
  }

  const totalPieces = pieces.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">

        {/* Sheets */}
        <Card className="border-border/50 bg-card/60 card-accent-accent">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2.5 font-display text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/12 ring-1 ring-accent/25">
                <Square className="h-3.5 w-3.5 text-accent" />
              </div>
              Sheet Material
              <Badge variant="secondary" className="ml-auto text-xs">{sheets.length} type{sheets.length !== 1 ? "s" : ""}</Badge>
            </CardTitle>
            <CardDescription>Available sheets to cut from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sheets.map((sheet, idx) => (
              <div key={sheet.id} className="flex gap-3 items-end">
                <div className="w-6 text-xs text-muted-foreground/60 font-mono text-right pt-7 shrink-0">{idx + 1}</div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Width</Label>
                  <UnitInput unit="mm" type="number" min="1" value={sheet.width || ""}
                    onChange={(e) => updateSheet(sheet.id, "width", Number(e.target.value))} placeholder="2440" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Height</Label>
                  <UnitInput unit="mm" type="number" min="1" value={sheet.height || ""}
                    onChange={(e) => updateSheet(sheet.id, "height", Number(e.target.value))} placeholder="1220" />
                </div>
                <div className="w-18">
                  <Label className="text-xs text-muted-foreground">Qty</Label>
                  <Input type="number" min="1" value={sheet.quantity || ""}
                    onChange={(e) => updateSheet(sheet.id, "quantity", Number(e.target.value))} placeholder="5" />
                </div>
                <div className="w-24">
                  <Label className="text-xs text-muted-foreground">Cost</Label>
                  <UnitInput unit="$" type="number" step="0.01" min="0" value={sheet.cost || ""}
                    onChange={(e) => updateSheet(sheet.id, "cost", Number(e.target.value))} placeholder="150" className="pr-7" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeSheet(sheet.id)}
                  disabled={sheets.length === 1} className="mb-0 h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addSheet} className="w-full border-dashed bg-transparent text-muted-foreground hover:text-foreground">
              <Plus className="mr-2 h-3.5 w-3.5" />Add Sheet Type
            </Button>
          </CardContent>
        </Card>

        {/* Pieces */}
        <Card className="border-border/50 bg-card/60 card-accent-primary">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2.5 font-display text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12 ring-1 ring-primary/25">
                <span className="text-xs font-bold text-primary">Pc</span>
              </div>
              Required Pieces
              <Badge variant="secondary" className="ml-auto text-xs">{totalPieces} total</Badge>
            </CardTitle>
            <CardDescription>Rectangular pieces to cut</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pieces.map((piece, idx) => (
              <div key={piece.id} className="rounded-lg border border-border/40 bg-muted/20 p-3 space-y-3">
                <div className="flex gap-3 items-end">
                  <div className="w-5 text-xs text-muted-foreground/60 font-mono pt-6 shrink-0">{idx + 1}</div>
                  <div className="w-28">
                    <Label className="text-xs text-muted-foreground">Label</Label>
                    <Input value={piece.label || ""} onChange={(e) => updatePiece(piece.id, "label", e.target.value)} placeholder="Panel A" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Width</Label>
                    <UnitInput unit="mm" type="number" min="1" value={piece.width || ""}
                      onChange={(e) => updatePiece(piece.id, "width", Number(e.target.value))} placeholder="600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Height</Label>
                    <UnitInput unit="mm" type="number" min="1" value={piece.height || ""}
                      onChange={(e) => updatePiece(piece.id, "height", Number(e.target.value))} placeholder="400" />
                  </div>
                  <div className="w-16">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                    <Input type="number" min="1" value={piece.quantity || ""}
                      onChange={(e) => updatePiece(piece.id, "quantity", Number(e.target.value))} placeholder="8" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removePiece(piece.id)}
                    disabled={pieces.length === 1} className="mb-0 h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 ml-8">
                  <Switch id={`rotate-${piece.id}`} checked={piece.canRotate}
                    onCheckedChange={(v) => updatePiece(piece.id, "canRotate", v)} />
                  <Label htmlFor={`rotate-${piece.id}`} className="text-xs text-muted-foreground cursor-pointer">
                    Allow rotation
                  </Label>
                  <RotateCw className="h-3.5 w-3.5 text-muted-foreground/50" />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addPiece} className="w-full border-dashed bg-transparent text-muted-foreground hover:text-foreground">
              <Plus className="mr-2 h-3.5 w-3.5" />Add Piece Type
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-border/50 bg-card/60">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-base">Cut Settings</CardTitle>
            <CardDescription>Sheet cutting parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Kerf Width</Label>
                <UnitInput unit="mm" type="number" step="0.1" min="0" value={settings.kerfWidth}
                  onChange={(e) => setSettings((p) => ({ ...p, kerfWidth: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Edge Margin</Label>
                <UnitInput unit="mm" type="number" min="0" value={settings.margin}
                  onChange={(e) => setSettings((p) => ({ ...p, margin: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Min Waste Area</Label>
              <UnitInput unit="mm²" type="number" min="0" value={settings.minWasteArea}
                onChange={(e) => setSettings((p) => ({ ...p, minWasteArea: Number(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="allow-rotation" checked={settings.allowRotation}
                onCheckedChange={(v) => setSettings((p) => ({ ...p, allowRotation: v }))} />
              <Label htmlFor="allow-rotation" className="text-sm cursor-pointer">Allow rotation globally</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <Card className="border-border/50 bg-card/60">
          <CardContent className="pt-6 space-y-3">
            <Button onClick={handleOptimize} disabled={isCalculating} className="w-full gap-2" size="lg">
              <Zap className={`h-4 w-4 ${isCalculating ? "animate-pulse" : ""}`} />
              {isCalculating ? "Optimizing…" : "Optimize 2D Cuts"}
            </Button>
            <Button variant="outline" onClick={resetCalculator} className="w-full bg-transparent gap-2 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3.5 w-3.5" />Reset
            </Button>
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /><span>{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {results ? (
          <Card className="border-border/50 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm text-muted-foreground uppercase tracking-widest">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-accent/8 ring-1 ring-accent/20 p-3 text-center">
                <div className="font-display text-3xl font-bold text-accent">{results.efficiency}%</div>
                <div className="text-xs text-muted-foreground mt-0.5">Material Efficiency</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                  <div className="font-display text-lg font-semibold text-foreground">{results.sheetsUsed}</div>
                  <div className="text-xs text-muted-foreground">Sheets Used</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                  <div className="font-display text-sm font-semibold text-destructive">{(results.totalWasteArea / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-muted-foreground">Waste mm²</div>
                </div>
              </div>
              {results.costSavings > 0 && (
                <div className="rounded-lg bg-primary/8 ring-1 ring-primary/20 p-2.5 text-center">
                  <div className="font-display text-lg font-semibold text-primary">${results.costSavings}</div>
                  <div className="text-xs text-muted-foreground">Estimated Savings</div>
                </div>
              )}
              {results.unplacedPieces > 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/8 p-2.5 text-xs text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{results.unplacedPieces} piece(s) couldn't be placed.</span>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/40 border-dashed bg-transparent">
            <CardContent className="py-8 text-center space-y-2">
              <div className="mx-auto h-10 w-10 rounded-full bg-muted/40 flex items-center justify-center">
                <Zap className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">Run the optimizer to see results.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {results && (
        <div className="lg:col-span-3">
          <Separator className="my-6" />
          <CuttingResults2D results={results} />
        </div>
      )}
    </div>
  )
}
