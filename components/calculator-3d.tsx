"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Zap, RotateCcw, Rotate3D, AlertTriangle, Box } from "lucide-react"
import { CuttingResults3D } from "@/components/cutting-results-3d"
import { optimize3DCutting } from "@/lib/cutting-algorithms-3d"
import type { Block, Piece3D, CalculatorSettings3D } from "@/features/calculators/common/types"

type OptimizeResult = ReturnType<typeof optimize3DCutting>

const DEFAULT_BLOCKS: Block[] = [{ id: "1", width: 2400, height: 1200, depth: 600, quantity: 3 }]
const DEFAULT_PIECES: Piece3D[] = [
  { id: "1", width: 800, height: 400, depth: 200, quantity: 6, label: "Block A", canRotate: true },
  { id: "2", width: 600, height: 300, depth: 150, quantity: 4, label: "Block B", canRotate: true },
  { id: "3", width: 400, height: 600, depth: 300, quantity: 3, label: "Block C", canRotate: false },
]
const DEFAULT_SETTINGS: CalculatorSettings3D = { kerfWidth: 5, minWasteVolume: 1000000, allowRotation: true, margin: 15 }

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

export function Calculator3D() {
  const [blocks, setBlocks] = useState<Block[]>(DEFAULT_BLOCKS)
  const [pieces, setPieces] = useState<Piece3D[]>(DEFAULT_PIECES)
  const [settings, setSettings] = useState<CalculatorSettings3D>(DEFAULT_SETTINGS)
  const [results, setResults] = useState<OptimizeResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addBlock = () => {
    setBlocks((prev) => [...prev, { id: Date.now().toString(), width: 2400, height: 1200, depth: 600, quantity: 1 }])
  }
  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id))
  const updateBlock = (id: string, field: keyof Block, value: number) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  const addPiece = () => {
    setPieces((prev) => [
      ...prev,
      { id: Date.now().toString(), width: 0, height: 0, depth: 0, quantity: 1, label: `Block ${String.fromCharCode(65 + prev.length)}`, canRotate: true },
    ])
  }
  const removePiece = (id: string) => setPieces((prev) => prev.filter((p) => p.id !== id))
  const updatePiece = (id: string, field: keyof Piece3D, value: number | string | boolean) => {
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const validate = (): string | null => {
    if (blocks.some((b) => b.width <= 0 || b.height <= 0 || b.depth <= 0))
      return "All blocks must have positive width, height, and depth."
    for (const piece of pieces) {
      if (piece.width <= 0 || piece.height <= 0 || piece.depth <= 0)
        return `Piece "${piece.label || piece.id}" must have positive dimensions.`
    }
    return null
  }

  const handleOptimize = async () => {
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError(null)
    setIsCalculating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setResults(optimize3DCutting(blocks, pieces, settings))
    } catch (err) {
      console.error("3D Optimization failed:", err)
      setError("Optimization failed. Please check your inputs.")
    } finally {
      setIsCalculating(false)
    }
  }

  const resetCalculator = () => {
    setBlocks(DEFAULT_BLOCKS); setPieces(DEFAULT_PIECES)
    setSettings(DEFAULT_SETTINGS); setResults(null); setError(null)
  }

  const totalPieces = pieces.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-3 lg:gap-6">
      <div className="min-w-0 space-y-4 lg:col-span-2">

        {/* Blocks */}
        <Card className="border-border/50 bg-card/60 card-accent-violet">
          <CardHeader className="px-4 pb-4 sm:px-6">
            <CardTitle className="flex flex-wrap items-center gap-2.5 font-display text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/12 ring-1 ring-violet-500/25">
                <Box className="h-3.5 w-3.5 text-violet-400" />
              </div>
              Block Material
              <Badge variant="secondary" className="ml-auto shrink-0 text-xs">{blocks.length} type{blocks.length !== 1 ? "s" : ""}</Badge>
            </CardTitle>
            <CardDescription>Available blocks or volumes to cut from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            {blocks.map((block, idx) => (
              <div key={block.id} className="rounded-lg border border-border/40 bg-muted/20 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground/60">Block {idx + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeBlock(block.id)}
                    disabled={blocks.length === 1} aria-label={`Remove block ${idx + 1}`}
                    className="-mr-1 h-9 w-9 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-[repeat(3,minmax(0,1fr))_4rem_6rem]">
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Width</Label>
                    <UnitInput unit="mm" type="number" min="1" value={block.width || ""}
                      onChange={(e) => updateBlock(block.id, "width", Number(e.target.value))} placeholder="2400" />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Height</Label>
                    <UnitInput unit="mm" type="number" min="1" value={block.height || ""}
                      onChange={(e) => updateBlock(block.id, "height", Number(e.target.value))} placeholder="1200" />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Depth</Label>
                    <UnitInput unit="mm" type="number" min="1" value={block.depth || ""}
                      onChange={(e) => updateBlock(block.id, "depth", Number(e.target.value))} placeholder="600" />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                    <Input type="number" min="1" value={block.quantity || ""}
                      onChange={(e) => updateBlock(block.id, "quantity", Number(e.target.value))} placeholder="3" />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Cost</Label>
                    <UnitInput unit="$" type="number" step="0.01" min="0" value={block.cost || ""}
                      onChange={(e) => updateBlock(block.id, "cost", Number(e.target.value))} placeholder="300" className="pr-7" />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addBlock} className="h-10 w-full border-dashed bg-transparent text-muted-foreground hover:text-foreground sm:h-9">
              <Plus className="mr-2 h-3.5 w-3.5" />Add Block Type
            </Button>
          </CardContent>
        </Card>

        {/* Pieces */}
        <Card className="border-border/50 bg-card/60 card-accent-primary">
          <CardHeader className="px-4 pb-4 sm:px-6">
            <CardTitle className="flex flex-wrap items-center gap-2.5 font-display text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12 ring-1 ring-primary/25">
                <span className="text-xs font-bold text-primary">Pc</span>
              </div>
              Required Pieces
              <Badge variant="secondary" className="ml-auto shrink-0 text-xs">{totalPieces} total</Badge>
            </CardTitle>
            <CardDescription>3D pieces to cut from your blocks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            {pieces.map((piece, idx) => (
              <div key={piece.id} className="rounded-lg border border-border/40 bg-muted/20 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground/60">Piece {idx + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => removePiece(piece.id)}
                    disabled={pieces.length === 1} aria-label={`Remove piece ${idx + 1}`}
                    className="-mr-1 h-9 w-9 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-[7rem_repeat(3,minmax(0,1fr))_4rem]">
                  <div className="col-span-2 min-w-0 sm:col-span-3 xl:col-span-1">
                    <Label className="text-xs text-muted-foreground">Label</Label>
                    <Input value={piece.label || ""} onChange={(e) => updatePiece(piece.id, "label", e.target.value)} placeholder="Block A" />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Width</Label>
                    <UnitInput unit="mm" type="number" min="1" value={piece.width || ""}
                      onChange={(e) => updatePiece(piece.id, "width", Number(e.target.value))} placeholder="800" />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Height</Label>
                    <UnitInput unit="mm" type="number" min="1" value={piece.height || ""}
                      onChange={(e) => updatePiece(piece.id, "height", Number(e.target.value))} placeholder="400" />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs text-muted-foreground">Depth</Label>
                    <UnitInput unit="mm" type="number" min="1" value={piece.depth || ""}
                      onChange={(e) => updatePiece(piece.id, "depth", Number(e.target.value))} placeholder="200" />
                  </div>
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                    <Input type="number" min="1" value={piece.quantity || ""}
                      onChange={(e) => updatePiece(piece.id, "quantity", Number(e.target.value))} placeholder="6" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id={`rotate3d-${piece.id}`} checked={piece.canRotate}
                    onCheckedChange={(v) => updatePiece(piece.id, "canRotate", v)} />
                  <Label htmlFor={`rotate3d-${piece.id}`} className="text-xs text-muted-foreground cursor-pointer">
                    Allow 3D rotation
                  </Label>
                  <Rotate3D className="h-3.5 w-3.5 text-muted-foreground/50" />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addPiece} className="h-10 w-full border-dashed bg-transparent text-muted-foreground hover:text-foreground sm:h-9">
              <Plus className="mr-2 h-3.5 w-3.5" />Add Piece Type
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-border/50 bg-card/60">
          <CardHeader className="px-4 pb-4 sm:px-6">
            <CardTitle className="font-display text-base">Cut Settings</CardTitle>
            <CardDescription>3D cutting parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <Label className="text-xs text-muted-foreground">Min Waste Volume</Label>
              <UnitInput unit="mm³" type="number" min="0" value={settings.minWasteVolume}
                onChange={(e) => setSettings((p) => ({ ...p, minWasteVolume: Number(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="allow-rotation-3d" checked={settings.allowRotation}
                onCheckedChange={(v) => setSettings((p) => ({ ...p, allowRotation: v }))} />
              <Label htmlFor="allow-rotation-3d" className="text-sm cursor-pointer">Allow 3D rotation globally</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="min-w-0 space-y-4">
        <Card className="border-border/50 bg-card/60">
          <CardContent className="space-y-3 px-4 pt-6 sm:px-6">
            <Button onClick={handleOptimize} disabled={isCalculating} className="w-full gap-2" size="lg">
              <Zap className={`h-4 w-4 ${isCalculating ? "animate-pulse" : ""}`} />
              {isCalculating ? "Optimizing…" : "Optimize 3D Cuts"}
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
            <CardHeader className="px-4 pb-3 sm:px-6">
              <CardTitle className="font-display text-sm text-muted-foreground uppercase tracking-widest">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
              <div className="rounded-lg bg-violet-500/8 ring-1 ring-violet-500/20 p-3 text-center">
                <div className="font-display text-3xl font-bold text-violet-400">{results.efficiency}%</div>
                <div className="text-xs text-muted-foreground mt-0.5">Volume Efficiency</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                  <div className="font-display text-lg font-semibold text-foreground">{results.blocksUsed}</div>
                  <div className="text-xs text-muted-foreground">Blocks Used</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                  <div className="font-display text-sm font-semibold text-destructive">{(results.totalWasteVolume / 1_000_000).toFixed(1)}L</div>
                  <div className="text-xs text-muted-foreground">Waste Vol.</div>
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
        <div className="min-w-0 lg:col-span-3">
          <Separator className="my-6" />
          <CuttingResults3D results={results} />
        </div>
      )}
    </div>
  )
}
