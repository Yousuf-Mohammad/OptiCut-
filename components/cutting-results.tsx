"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"


interface CuttingPattern {
  stockLength: number
  pieces: Array<{
    label: string
    length: number
    color: string
  }>
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
    summary: {
      totalStockLength: number
      totalRequiredLength: number
      wastePercentage: number
    }
  }
}

const pieceColors = [
  "#164e63", // primary
  "#d97706", // accent
  "#dc2626", // destructive
  "#059669", // emerald
  "#7c3aed", // violet
  "#db2777", // pink
  "#ea580c", // orange
  "#0891b2", // cyan
]

export function CuttingResults({ results }: CuttingResultsProps) {
  const analyticsData = {
    efficiency: results.efficiency,
    wasteAmount: results.totalWaste,
    costSavings: results.costSavings,
    materialsUsed: results.stocksUsed,
    dimension: "1D" as const,
    patterns: results.patterns,
    summary: results.summary,
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Optimization Results</h2>
        <p className="text-muted-foreground">Your cutting patterns have been optimized for maximum efficiency</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">{results.efficiency}%</div>
              <div className="text-sm text-muted-foreground">Material Efficiency</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-destructive">{results.totalWaste}mm</div>
              <div className="text-sm text-muted-foreground">Total Waste</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-foreground">{results.stocksUsed}</div>
              <div className="text-sm text-muted-foreground">Stocks Used</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-accent">${results.costSavings}</div>
              <div className="text-sm text-muted-foreground">Cost Savings</div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Cutting Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Cutting Patterns</CardTitle>
          <CardDescription>Visual representation of how to cut each stock piece</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {results.patterns.map((pattern, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Stock #{index + 1} ({pattern.stockLength}mm)
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Efficiency: {pattern.efficiency}%</Badge>
                  <Badge variant={pattern.waste > 100 ? "destructive" : "secondary"}>Waste: {pattern.waste}mm</Badge>
                </div>
              </div>

              {/* Visual cutting pattern */}
              <div className="relative">
                <div className="h-12 bg-muted rounded-lg border-2 border-border overflow-hidden flex">
                  {pattern.pieces.map((piece, pieceIndex) => {
                    const widthPercentage = (piece.length / pattern.stockLength) * 100
                    return (
                      <div
                        key={pieceIndex}
                        className="h-full flex items-center justify-center text-xs font-medium text-white border-r border-background"
                        style={{
                          width: `${widthPercentage}%`,
                          backgroundColor: piece.color,
                          minWidth: "40px",
                        }}
                      >
                        {piece.label}
                      </div>
                    )
                  })}
                  {pattern.waste > 0 && (
                    <div
                      className="h-full bg-destructive/20 border-l-2 border-destructive flex items-center justify-center text-xs text-destructive font-medium"
                      style={{
                        width: `${(pattern.waste / pattern.stockLength) * 100}%`,
                      }}
                    >
                      Waste
                    </div>
                  )}
                </div>

                {/* Length markers */}
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0mm</span>
                  <span>{pattern.stockLength}mm</span>
                </div>
              </div>

              {/* Piece details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {pattern.pieces.map((piece, pieceIndex) => (
                  <div key={pieceIndex} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: piece.color }} />
                    <span>
                      {piece.label}: {piece.length}mm
                    </span>
                  </div>
                ))}
              </div>

              {index < results.patterns.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Detailed Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Material Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Stock Length:</span>
                  <span className="font-medium">{results.summary.totalStockLength}mm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Required Length:</span>
                  <span className="font-medium">{results.summary.totalRequiredLength}mm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Waste Percentage:</span>
                  <span className="font-medium text-destructive">{results.summary.wastePercentage}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Efficiency Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Material Utilization</span>
                    <span>{results.efficiency}%</span>
                  </div>
                  <Progress value={results.efficiency} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Waste Reduction</span>
                    <span>{100 - results.summary.wastePercentage}%</span>
                  </div>
                  <Progress value={100 - results.summary.wastePercentage} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
