"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { RotateCw } from "lucide-react"

interface PlacedPiece2D {
  id: string; label: string; x: number; y: number
  width: number; height: number; rotated: boolean; color: string
}

interface CuttingPattern2D {
  sheetWidth: number; sheetHeight: number; pieces: PlacedPiece2D[]
  wasteArea: number; efficiency: number; utilizedArea: number
}

interface CuttingResults2DProps {
  results: {
    patterns: CuttingPattern2D[]
    efficiency: number; totalWasteArea: number; sheetsUsed: number; costSavings: number
    unplacedPieces?: number
    summary: { totalSheetArea: number; totalRequiredArea: number; wastePercentage: number }
  }
}

function EfficiencyBadge({ value }: { value: number }) {
  const color =
    value >= 85 ? "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" :
    value >= 65 ? "text-accent bg-accent/10 ring-accent/20" :
    "text-destructive bg-destructive/10 ring-destructive/20"
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${color}`}>
      {value}%
    </span>
  )
}

export function CuttingResults2D({ results }: CuttingResults2DProps) {
  const efficiencyColor =
    results.efficiency >= 85 ? "text-emerald-400" :
    results.efficiency >= 65 ? "text-accent" : "text-destructive"

  return (
    <div className="space-y-6">
      {/* Hero metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/60 col-span-2 md:col-span-1">
          <CardContent className="pt-5 pb-5 text-center space-y-1">
            <div className={`font-display text-4xl font-extrabold leading-none ${efficiencyColor}`}>
              {results.efficiency}%
            </div>
            <div className="text-xs text-muted-foreground">Sheet Efficiency</div>
            <Progress value={results.efficiency} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60">
          <CardContent className="pt-5 pb-5 text-center space-y-1">
            <div className="font-display text-3xl font-bold text-foreground leading-none">{results.sheetsUsed}</div>
            <div className="text-xs text-muted-foreground">Sheets Used</div>
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

      {/* Sheet layouts */}
      <Card className="border-border/50 bg-card/60">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-base">Sheet Layouts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {results.patterns.map((pattern, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Sheet #{index + 1}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {pattern.sheetWidth} × {pattern.sheetHeight}mm
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <EfficiencyBadge value={pattern.efficiency} />
                  <Badge
                    variant={pattern.wasteArea > 50000 ? "destructive" : "secondary"}
                    className="text-xs font-mono"
                  >
                    {(pattern.wasteArea / 1000).toFixed(0)}k mm² waste
                  </Badge>
                </div>
              </div>

              {/* SVG visualization */}
              <div className="rounded-xl border border-border/50 bg-muted/10 overflow-hidden relative">
                <div className="w-full" style={{ aspectRatio: `${pattern.sheetWidth} / ${Math.min(pattern.sheetHeight, pattern.sheetWidth * 0.7)}` }}>
                  <svg
                    width="100%" height="100%"
                    viewBox={`0 0 ${pattern.sheetWidth} ${pattern.sheetHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="block max-h-72"
                  >
                    {/* Sheet background */}
                    <rect x="0" y="0" width={pattern.sheetWidth} height={pattern.sheetHeight}
                      fill="oklch(0.14 0.01 255)" rx="4" />

                    {/* Grid overlay */}
                    <defs>
                      <pattern id={`grid2d-${index}`} width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 100 0 L 0 0 0 100" fill="none"
                          stroke="oklch(0.72 0.15 185 / 0.06)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect x="0" y="0" width={pattern.sheetWidth} height={pattern.sheetHeight}
                      fill={`url(#grid2d-${index})`} />

                    {/* Pieces */}
                    {pattern.pieces.map((piece, pi) => (
                      <g key={pi}>
                        <rect
                          x={piece.x} y={piece.y} width={piece.width} height={piece.height}
                          fill={piece.color} fillOpacity="0.85" rx="3"
                          stroke="oklch(0.09 0.015 255 / 0.5)" strokeWidth="1.5"
                        />
                        {piece.width > 80 && piece.height > 30 && (
                          <text
                            x={piece.x + piece.width / 2} y={piece.y + piece.height / 2}
                            textAnchor="middle" dominantBaseline="middle"
                            fill="white" fontSize={Math.min(piece.width, piece.height) * 0.16}
                            fontWeight="600" fontFamily="var(--font-syne, sans-serif)"
                          >
                            {piece.label}
                          </text>
                        )}
                        {piece.rotated && (
                          <circle cx={piece.x + piece.width - 12} cy={piece.y + 12} r="8"
                            fill="white" fillOpacity="0.15" />
                        )}
                      </g>
                    ))}

                    {/* Sheet border */}
                    <rect x="0" y="0" width={pattern.sheetWidth} height={pattern.sheetHeight}
                      fill="none" stroke="oklch(0.72 0.15 185 / 0.3)" strokeWidth="2" rx="4" />
                  </svg>
                </div>

                {/* Dimension label */}
                <div className="absolute top-2 left-2 rounded-md border border-border/50 bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {pattern.sheetWidth} × {pattern.sheetHeight}mm
                </div>
              </div>

              {/* Piece legend */}
              <div className="flex flex-wrap gap-3">
                {pattern.pieces.map((piece, pi) => (
                  <div key={pi} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: piece.color }} />
                    <span className="text-muted-foreground">
                      {piece.label} — {piece.width}×{piece.height}mm
                      {piece.rotated && <RotateCw className="inline h-3 w-3 ml-1 opacity-60" />}
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
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Area Usage</h4>
              <div className="space-y-2 text-sm">
                {[
                  ["Total Sheet Area", `${results.summary.totalSheetArea.toLocaleString()} mm²`],
                  ["Required Area", `${results.summary.totalRequiredArea.toLocaleString()} mm²`],
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
