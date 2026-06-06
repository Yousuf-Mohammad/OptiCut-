"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Zap, RotateCcw, AlertTriangle, Ruler } from "lucide-react"
import { CuttingResults } from "@/components/cutting-results"
import { optimize1DCutting } from "@/lib/cutting-algorithms"
import type { StockBar, Piece1D, CalculatorSettings1D } from "@/features/calculators/common/types"

type OptimizeResult = ReturnType<typeof optimize1DCutting>

const DEFAULT_STOCKS: StockBar[] = [{ id: "1", length: 3000, quantity: 10 }]
const DEFAULT_PIECES: Piece1D[] = [
  { id: "1", length: 1200, quantity: 5, label: "Piece A" },
  { id: "2", length: 800, quantity: 8, label: "Piece B" },
]
const DEFAULT_SETTINGS: CalculatorSettings1D = { kerfWidth: 3, minWasteLength: 50 }

function UnitInput({
  unit,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { unit: string }) {
  return (
    <div className="relative">
      <Input {...props} className={`pr-9 ${className ?? ""}`} />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/70 font-mono">
        {unit}
      </span>
    </div>
  )
}

export function Calculator1D() {
  const [stockItems, setStockItems] = useState<StockBar[]>(DEFAULT_STOCKS)
  const [requiredPieces, setRequiredPieces] = useState<Piece1D[]>(DEFAULT_PIECES)
  const [settings, setSettings] = useState<CalculatorSettings1D>(DEFAULT_SETTINGS)
  const [results, setResults] = useState<OptimizeResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addStockItem = () => {
    const newId = Date.now().toString()
    setStockItems((prev) => [...prev, { id: newId, length: 3000, quantity: 1 }])
  }

  const removeStockItem = (id: string) => {
    setStockItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateStockItem = (id: string, field: keyof StockBar, value: number) => {
    setStockItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addRequiredPiece = () => {
    const newId = Date.now().toString()
    setRequiredPieces((prev) => [
      ...prev,
      { id: newId, length: 0, quantity: 1, label: `Piece ${String.fromCharCode(65 + prev.length)}` },
    ])
  }

  const removeRequiredPiece = (id: string) => {
    setRequiredPieces((prev) => prev.filter((piece) => piece.id !== id))
  }

  const updateRequiredPiece = (id: string, field: keyof Piece1D, value: number | string) => {
    setRequiredPieces((prev) => prev.map((piece) => (piece.id === id ? { ...piece, [field]: value } : piece)))
  }

  const validate = (): string | null => {
    const maxStock = Math.max(...stockItems.map((s) => s.length))
    for (const piece of requiredPieces) {
      if (piece.length <= 0) return `Piece "${piece.label || piece.id}" must have a length greater than 0.`
      if (piece.length > maxStock)
        return `Piece "${piece.label || piece.id}" (${piece.length}mm) is longer than the longest stock (${maxStock}mm).`
    }
    if (stockItems.some((s) => s.length <= 0)) return "All stock items must have a length greater than 0."
    return null
  }

  const handleOptimize = async () => {
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError(null)
    setIsCalculating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setResults(optimize1DCutting(stockItems, requiredPieces, settings))
    } catch (err) {
      console.error("Optimization failed:", err)
      setError("Optimization failed. Please check your inputs.")
    } finally {
      setIsCalculating(false)
    }
  }

  const resetCalculator = () => {
    setStockItems(DEFAULT_STOCKS)
    setRequiredPieces(DEFAULT_PIECES)
    setSettings(DEFAULT_SETTINGS)
    setResults(null)
    setError(null)
  }

  const totalPieceCount = requiredPieces.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-3 lg:gap-6">
      {/* ─── Left: inputs (2/3 width) ─── */}
      <div className="min-w-0 space-y-4 lg:col-span-2">

        {/* Stock Materials */}
        <Card className="border-border/50 bg-card/60 card-accent-primary">
          <CardHeader className="px-4 pb-4 sm:px-6">
            <CardTitle className="flex flex-wrap items-center gap-2.5 font-display text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12 ring-1 ring-primary/25">
                <Ruler className="h-3.5 w-3.5 text-primary" />
              </div>
              Stock Material
              <Badge variant="secondary" className="ml-auto shrink-0 text-xs">{stockItems.length} type{stockItems.length !== 1 ? "s" : ""}</Badge>
            </CardTitle>
            <CardDescription>Available bars or profiles to cut from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            {stockItems.map((item, idx) => (
              <div key={item.id} className="rounded-lg border border-border/40 bg-muted/20 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground/60">Stock {idx + 1}</span>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => removeStockItem(item.id)}
                    disabled={stockItems.length === 1}
                    aria-label={`Remove stock ${idx + 1}`}
                    className="-mr-1 h-9 w-9 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_5rem_7rem]">
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label className="text-xs text-muted-foreground">Length</Label>
                    <UnitInput
                      unit="mm"
                      type="number" min="1"
                      value={item.length || ""}
                      onChange={(e) => updateStockItem(item.id, "length", Number(e.target.value))}
                      placeholder="3000"
                    />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                    <Input
                      type="number" min="1"
                      value={item.quantity || ""}
                      onChange={(e) => updateStockItem(item.id, "quantity", Number(e.target.value))}
                      placeholder="10"
                    />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Cost / unit</Label>
                    <UnitInput
                      unit="$"
                      type="number" step="0.01" min="0"
                      value={item.cost || ""}
                      onChange={(e) => updateStockItem(item.id, "cost", Number(e.target.value))}
                      placeholder="25.00"
                      className="pr-7"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addStockItem} className="h-10 w-full border-dashed bg-transparent text-muted-foreground hover:text-foreground sm:h-9">
              <Plus className="mr-2 h-3.5 w-3.5" />
              Add Stock
            </Button>
          </CardContent>
        </Card>

        {/* Required Pieces */}
        <Card className="border-border/50 bg-card/60 card-accent-accent">
          <CardHeader className="px-4 pb-4 sm:px-6">
            <CardTitle className="flex flex-wrap items-center gap-2.5 font-display text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/12 ring-1 ring-accent/25">
                <span className="text-xs font-bold text-accent">Pc</span>
              </div>
              Required Pieces
              <Badge variant="secondary" className="ml-auto shrink-0 text-xs">{totalPieceCount} total</Badge>
            </CardTitle>
            <CardDescription>Pieces to cut from your stock</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            {requiredPieces.map((piece, idx) => (
              <div key={piece.id} className="rounded-lg border border-border/40 bg-muted/20 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground/60">Piece {idx + 1}</span>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => removeRequiredPiece(piece.id)}
                    disabled={requiredPieces.length === 1}
                    aria-label={`Remove piece ${idx + 1}`}
                    className="-mr-1 h-9 w-9 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[7rem_minmax(0,1fr)_5rem]">
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label className="text-xs text-muted-foreground">Label</Label>
                    <Input
                      value={piece.label || ""}
                      onChange={(e) => updateRequiredPiece(piece.id, "label", e.target.value)}
                      placeholder="Piece A"
                    />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Length</Label>
                    <UnitInput
                      unit="mm"
                      type="number" min="1"
                      value={piece.length || ""}
                      onChange={(e) => updateRequiredPiece(piece.id, "length", Number(e.target.value))}
                      placeholder="1200"
                    />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                    <Input
                      type="number" min="1"
                      value={piece.quantity || ""}
                      onChange={(e) => updateRequiredPiece(piece.id, "quantity", Number(e.target.value))}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addRequiredPiece} className="h-10 w-full border-dashed bg-transparent text-muted-foreground hover:text-foreground sm:h-9">
              <Plus className="mr-2 h-3.5 w-3.5" />
              Add Piece
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-border/50 bg-card/60">
          <CardHeader className="px-4 pb-4 sm:px-6">
            <CardTitle className="font-display text-base">Cut Settings</CardTitle>
            <CardDescription>Blade and tolerance parameters</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Kerf Width</Label>
                <UnitInput
                  unit="mm"
                  type="number" step="0.1" min="0"
                  value={settings.kerfWidth}
                  onChange={(e) => setSettings((prev) => ({ ...prev, kerfWidth: Number(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground/70">Blade thickness per cut</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Min Waste Length</Label>
                <UnitInput
                  unit="mm"
                  type="number" min="0"
                  value={settings.minWasteLength}
                  onChange={(e) => setSettings((prev) => ({ ...prev, minWasteLength: Number(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground/70">Offcut too small to reuse</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Right: actions + stats ─── */}
      <div className="min-w-0 space-y-4">
        <Card className="border-border/50 bg-card/60">
          <CardContent className="space-y-3 px-4 pt-6 sm:px-6">
            <Button
              onClick={handleOptimize}
              disabled={isCalculating}
              className="w-full gap-2"
              size="lg"
            >
              <Zap className={`h-4 w-4 ${isCalculating ? "animate-pulse" : ""}`} />
              {isCalculating ? "Optimizing…" : "Optimize Cuts"}
            </Button>

            <Button variant="outline" onClick={resetCalculator} className="w-full bg-transparent gap-2 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {results ? (
          <Card className="border-border/50 bg-card/60">
            <CardHeader className="px-4 pb-3 sm:px-6">
              <CardTitle className="font-display text-sm text-muted-foreground uppercase tracking-widest">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
              <div className="rounded-lg bg-primary/8 ring-1 ring-primary/20 p-3 text-center">
                <div className="font-display text-3xl font-bold text-primary">{results.efficiency}%</div>
                <div className="text-xs text-muted-foreground mt-0.5">Material Efficiency</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                  <div className="font-display text-lg font-semibold text-foreground">{results.stocksUsed}</div>
                  <div className="text-xs text-muted-foreground">Stocks Used</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                  <div className="font-display text-lg font-semibold text-destructive">{results.totalWaste}mm</div>
                  <div className="text-xs text-muted-foreground">Total Waste</div>
                </div>
              </div>
              {results.costSavings > 0 && (
                <div className="rounded-lg bg-accent/8 ring-1 ring-accent/20 p-2.5 text-center">
                  <div className="font-display text-lg font-semibold text-accent">${results.costSavings}</div>
                  <div className="text-xs text-muted-foreground">Estimated Savings</div>
                </div>
              )}
              {results.unplacedPieces > 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/8 p-2.5 text-xs text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{results.unplacedPieces} piece(s) couldn't be placed — add more stock.</span>
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
              <p className="text-sm text-muted-foreground">Run the optimizer to see efficiency stats here.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="min-w-0 lg:col-span-3">
          <Separator className="my-6" />
          <CuttingResults results={results} />
        </div>
      )}
    </div>
  )
}
