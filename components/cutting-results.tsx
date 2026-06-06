"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface CuttingPattern {
  stockLength: number
  pieces: Array<{ label: string; length: number; color: string }>
  waste: number
  efficiency: number
}

interface CuttingResultsProps {
  results: {
    patterns: CuttingPattern[]
    efficiency: number
    totalWaste: number
    stocksUsed: number
    costSavings: number
    unplacedPieces?: number
    summary: {
      totalStockLength: number
      totalRequiredLength: number
      wastePercentage: number
    }
  }
}

function EfficiencyBadge({ value }: { value: number }) {
  const color =
    value >= 85 ? "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" :
    value >= 65 ? "text-accent bg-accent/10 ring-accent/20" :
    "text-destructive bg-destructive/10 ring-destructive/20"
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${color}`}>
      {value}%
    </span>
  )
}

export function CuttingResults({ results }: CuttingResultsProps) {
  const efficiencyColor =
    results.efficiency >= 85 ? "text-emerald-400" :
    results.efficiency >= 65 ? "text-accent" :
    "text-destructive"

  return (
    <div className="space-y-6">
      {/* Hero metric row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/60 col-span-2 md:col-span-1">
          <CardContent className="pt-5 pb-5 text-center space-y-1">
            <div className={`font-display text-4xl font-extrabold leading-none ${efficiencyColor}`}>
              {results.efficiency}%
            </div>
            <div className="text-xs text-muted-foreground">Material Efficiency</div>
            <Progress value={results.efficiency} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60">
          <CardContent className="pt-5 pb-5 text-center space-y-1">
            <div className="font-display text-3xl font-bold text-foreground leading-none">{results.stocksUsed}</div>
            <div className="text-xs text-muted-foreground">Stocks Used</div>
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

      {/* Cutting patterns */}
      <Card className="border-border/50 bg-card/60">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-base">Cutting Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {results.patterns.map((pattern, index) => (
            <div key={index} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Stock #{index + 1}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">{pattern.stockLength}mm</span>
                </span>
                <div className="flex items-center gap-2">
                  <EfficiencyBadge value={pattern.efficiency} />
                  <Badge
                    variant={pattern.waste > 100 ? "destructive" : "secondary"}
                    className="text-xs font-mono"
                  >
                    {pattern.waste}mm waste
                  </Badge>
                </div>
              </div>

              {/* Visual bar */}
              <div className="h-10 rounded-lg border border-border/50 bg-muted/20 overflow-hidden flex">
                {pattern.pieces.map((piece, pi) => {
                  const pct = (piece.length / pattern.stockLength) * 100
                  return (
                    <div
                      key={pi}
                      className="h-full flex items-center justify-center overflow-hidden border-r border-background/30"
                      style={{ width: `${pct}%`, backgroundColor: piece.color, minWidth: 32 }}
                    >
                      <span className="text-[10px] font-semibold text-white/90 px-1 truncate">{piece.label}</span>
                    </div>
                  )
                })}
                {pattern.waste > 0 && (
                  <div
                    className="h-full flex items-center justify-center bg-destructive/15 border-l border-destructive/30"
                    style={{ width: `${(pattern.waste / pattern.stockLength) * 100}%`, minWidth: 8 }}
                  >
                    {pattern.waste > 80 && (
                      <span className="text-[9px] text-destructive/70 font-medium">waste</span>
                    )}
                  </div>
                )}
              </div>

              {/* Length scale */}
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground/60 px-0.5">
                <span>0</span>
                <span>{pattern.stockLength}mm</span>
              </div>

              {/* Piece legend */}
              <div className="flex flex-wrap gap-2">
                {pattern.pieces.map((piece, pi) => (
                  <div key={pi} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: piece.color }} />
                    <span className="text-muted-foreground">{piece.label} — {piece.length}mm</span>
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
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Material Usage</h4>
              <div className="space-y-2 text-sm">
                {[
                  ["Total Stock", `${results.summary.totalStockLength.toLocaleString()}mm`],
                  ["Required Length", `${results.summary.totalRequiredLength.toLocaleString()}mm`],
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
                    <span className="text-muted-foreground">Material Utilization</span>
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
