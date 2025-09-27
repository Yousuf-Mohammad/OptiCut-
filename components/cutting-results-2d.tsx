"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { RotateCw } from "lucide-react"

interface PlacedPiece2D {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  rotated: boolean
  color: string
}

interface CuttingPattern2D {
  sheetWidth: number
  sheetHeight: number
  pieces: PlacedPiece2D[]
  wasteArea: number
  efficiency: number
  utilizedArea: number
}

interface CuttingResults2DProps {
  results: {
    patterns: CuttingPattern2D[]
    efficiency: number
    totalWasteArea: number
    sheetsUsed: number
    costSavings: number
    summary: {
      totalSheetArea: number
      totalRequiredArea: number
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

export function CuttingResults2D({ results }: CuttingResults2DProps) {
  const analyticsData = {
    efficiency: results.efficiency,
    wasteAmount: results.totalWasteArea,
    costSavings: results.costSavings,
    materialsUsed: results.sheetsUsed,
    dimension: "2D" as const,
    patterns: results.patterns,
    summary: results.summary,
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">2D Optimization Results</h2>
        <p className="text-muted-foreground">
          Your sheet cutting patterns have been optimized for maximum material utilization
        </p>
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
              <div className="text-2xl font-bold text-destructive">{results.totalWasteArea.toLocaleString()}mm²</div>
              <div className="text-sm text-muted-foreground">Total Waste Area</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-foreground">{results.sheetsUsed}</div>
              <div className="text-sm text-muted-foreground">Sheets Used</div>
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


      {/* 2D Cutting Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>2D Cutting Patterns</CardTitle>
          <CardDescription>Visual layout showing how to cut each sheet for optimal material usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {results.patterns.map((pattern, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Sheet #{index + 1} ({pattern.sheetWidth} × {pattern.sheetHeight}mm)
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Efficiency: {pattern.efficiency}%</Badge>
                  <Badge variant={pattern.wasteArea > 50000 ? "destructive" : "secondary"}>
                    Waste: {pattern.wasteArea.toLocaleString()}mm²
                  </Badge>
                </div>
              </div>

              {/* 2D Visual Pattern */}
              <div className="relative bg-muted rounded-lg border-2 border-border overflow-hidden">
                <div
                  className="relative"
                  style={{
                    width: "100%",
                    height: "400px",
                    maxWidth: "800px",
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${pattern.sheetWidth} ${pattern.sheetHeight}`}
                    className="border border-border"
                  >
                    {/* Sheet background */}
                    <rect
                      x="0"
                      y="0"
                      width={pattern.sheetWidth}
                      height={pattern.sheetHeight}
                      fill="rgb(248, 250, 252)"
                      stroke="rgb(203, 213, 225)"
                      strokeWidth="2"
                    />

                    {/* Placed pieces */}
                    {pattern.pieces.map((piece, pieceIndex) => (
                      <g key={pieceIndex}>
                        <rect
                          x={piece.x}
                          y={piece.y}
                          width={piece.width}
                          height={piece.height}
                          fill={piece.color}
                          fillOpacity="0.8"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x={piece.x + piece.width / 2}
                          y={piece.y + piece.height / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {piece.label}
                        </text>
                        {piece.rotated && (
                          <g transform={`translate(${piece.x + piece.width - 15}, ${piece.y + 15})`}>
                            <circle cx="0" cy="0" r="8" fill="white" fillOpacity="0.9" />
                            <RotateCw className="h-3 w-3" style={{ transform: "translate(-6px, -6px)" }} />
                          </g>
                        )}
                      </g>
                    ))}

                    {/* Grid lines for better visualization */}
                    <defs>
                      <pattern id={`grid-${index}`} width="100" height="100" patternUnits="userSpaceOnUse">
                        <path
                          d="M 100 0 L 0 0 0 100"
                          fill="none"
                          stroke="rgb(226, 232, 240)"
                          strokeWidth="1"
                          opacity="0.3"
                        />
                      </pattern>
                    </defs>
                    <rect
                      x="0"
                      y="0"
                      width={pattern.sheetWidth}
                      height={pattern.sheetHeight}
                      fill={`url(#grid-${index})`}
                    />
                  </svg>
                </div>

                {/* Dimensions */}
                <div className="absolute top-2 left-2 bg-background/90 px-2 py-1 rounded text-xs font-medium">
                  {pattern.sheetWidth} × {pattern.sheetHeight}mm
                </div>
              </div>

              {/* Piece Legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {pattern.pieces.map((piece, pieceIndex) => (
                  <div key={pieceIndex} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: piece.color }} />
                    <span>
                      {piece.label}: {piece.width} × {piece.height}mm
                      {piece.rotated && <RotateCw className="inline h-3 w-3 ml-1" />}
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
          <CardTitle>2D Optimization Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Material Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Sheet Area:</span>
                  <span className="font-medium">{results.summary.totalSheetArea.toLocaleString()}mm²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Required Area:</span>
                  <span className="font-medium">{results.summary.totalRequiredArea.toLocaleString()}mm²</span>
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
