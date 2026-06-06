"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Rotate3D, Loader } from "lucide-react"
import { Viewer3D } from "@/components/viewer-3d"

interface PlacedPiece3D {
  id: string; label: string; x: number; y: number; z: number
  width: number; height: number; depth: number; rotated: boolean; color: string
}

interface CuttingPattern3D {
  blockWidth: number; blockHeight: number; blockDepth: number
  pieces: PlacedPiece3D[]; wasteVolume: number; efficiency: number; utilizedVolume: number
}

interface CuttingResults3DProps {
  results: {
    patterns: CuttingPattern3D[]
    efficiency: number; totalWasteVolume: number; blocksUsed: number; costSavings: number
    unplacedPieces?: number
    summary: { totalBlockVolume: number; totalRequiredVolume: number; wastePercentage: number }
  }
}

function EfficiencyBadge({ value }: { value: number }) {
  const color =
    value >= 85 ? "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" :
    value >= 65 ? "text-violet-400 bg-violet-500/10 ring-violet-500/20" :
    "text-destructive bg-destructive/10 ring-destructive/20"
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${color}`}>
      {value}%
    </span>
  )
}

export function CuttingResults3D({ results }: CuttingResults3DProps) {
  const efficiencyColor =
    results.efficiency >= 85 ? "text-emerald-400" :
    results.efficiency >= 65 ? "text-violet-400" : "text-destructive"

  return (
    <div className="space-y-6">
      {/* Hero metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/60 col-span-2 md:col-span-1">
          <CardContent className="pt-5 pb-5 text-center space-y-1">
            <div className={`font-display text-4xl font-extrabold leading-none ${efficiencyColor}`}>
              {results.efficiency}%
            </div>
            <div className="text-xs text-muted-foreground">Volume Efficiency</div>
            <Progress value={results.efficiency} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60">
          <CardContent className="pt-5 pb-5 text-center space-y-1">
            <div className="font-display text-3xl font-bold text-foreground leading-none">{results.blocksUsed}</div>
            <div className="text-xs text-muted-foreground">Blocks Used</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60">
          <CardContent className="pt-5 pb-5 text-center space-y-1">
            <div className="font-display text-3xl font-bold text-destructive leading-none">
              {results.summary.wastePercentage}%
            </div>
            <div className="text-xs text-muted-foreground">Waste Rate</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60">
          <CardContent className="pt-5 pb-5 text-center space-y-1">
            <div className="font-display text-3xl font-bold text-accent leading-none">${results.costSavings}</div>
            <div className="text-xs text-muted-foreground">Cost Savings</div>
          </CardContent>
        </Card>
      </div>

      {/* 3D visualizations */}
      <Card className="border-border/50 bg-card/60">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-base">3D Block Layouts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {results.patterns.map((pattern, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Block #{index + 1}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {pattern.blockWidth} × {pattern.blockHeight} × {pattern.blockDepth}mm
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <EfficiencyBadge value={pattern.efficiency} />
                  <Badge variant="secondary" className="text-xs font-mono">
                    {(pattern.wasteVolume / 1_000_000).toFixed(2)}L waste
                  </Badge>
                </div>
              </div>

              {/* 3D viewer */}
              <div className="relative rounded-xl border border-border/50 bg-muted/10 overflow-hidden h-80">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Loading 3D view…</span>
                      </div>
                    </div>
                  }
                >
                  <Viewer3D pattern={pattern} />
                </Suspense>

                {/* Overlay hints */}
                <div className="absolute top-2 left-2 rounded-md border border-border/50 bg-background/80 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-muted-foreground">
                  <div>{pattern.blockWidth} × {pattern.blockHeight} × {pattern.blockDepth}mm</div>
                  <div className="text-muted-foreground/60">Drag · Scroll to zoom</div>
                </div>
              </div>

              {/* Volume stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Utilized", value: `${(pattern.utilizedVolume / 1_000_000).toFixed(2)}L`, color: "text-primary" },
                  { label: "Waste", value: `${(pattern.wasteVolume / 1_000_000).toFixed(2)}L`, color: "text-destructive" },
                  { label: "Total", value: `${((pattern.utilizedVolume + pattern.wasteVolume) / 1_000_000).toFixed(2)}L`, color: "text-foreground" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-muted/30 p-2.5 text-center">
                    <div className={`font-display text-base font-semibold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Piece legend */}
              <div className="flex flex-wrap gap-3">
                {pattern.pieces.map((piece, pi) => (
                  <div key={pi} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: piece.color }} />
                    <span className="text-muted-foreground">
                      {piece.label} — {piece.width}×{piece.height}×{piece.depth}mm
                      {piece.rotated && <Rotate3D className="inline h-3 w-3 ml-1 opacity-60" />}
                    </span>
                  </div>
                ))}
              </div>

              {index < results.patterns.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-border/50 bg-card/60">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Volume Usage</h4>
              <div className="space-y-2 text-sm">
                {[
                  ["Total Block Volume", `${(results.summary.totalBlockVolume / 1_000_000).toFixed(2)}L`],
                  ["Required Volume", `${(results.summary.totalRequiredVolume / 1_000_000).toFixed(2)}L`],
                  ["Waste", <span key="w" className="text-destructive">{results.summary.wastePercentage}%</span>],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between items-center py-1 border-b border-border/30">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Efficiency</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Volume Utilization</span>
                    <span className="font-mono font-medium">{results.efficiency}%</span>
                  </div>
                  <Progress value={results.efficiency} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Waste Reduction</span>
                    <span className="font-mono font-medium">{100 - results.summary.wastePercentage}%</span>
                  </div>
                  <Progress value={100 - results.summary.wastePercentage} className="h-1.5" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
