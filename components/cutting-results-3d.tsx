"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Rotate3D, Loader } from "lucide-react"
import { Viewer3D } from "@/components/viewer-3d"


interface PlacedPiece3D {
  id: string
  label: string
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
  rotated: boolean
  color: string
}

interface CuttingPattern3D {
  blockWidth: number
  blockHeight: number
  blockDepth: number
  pieces: PlacedPiece3D[]
  wasteVolume: number
  efficiency: number
  utilizedVolume: number
}

interface CuttingResults3DProps {
  results: {
    patterns: CuttingPattern3D[]
    efficiency: number
    totalWasteVolume: number
    blocksUsed: number
    costSavings: number
    summary: {
      totalBlockVolume: number
      totalRequiredVolume: number
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

export function CuttingResults3D({ results }: CuttingResults3DProps) {
  const analyticsData = {
    efficiency: results.efficiency,
    wasteAmount: results.totalWasteVolume,
    costSavings: results.costSavings,
    materialsUsed: results.blocksUsed,
    dimension: "3D" as const,
    patterns: results.patterns,
    summary: results.summary,
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">3D Optimization Results</h2>
        <p className="text-muted-foreground">
          Your volumetric cutting patterns have been optimized for maximum material utilization
        </p>
      </div>

     



      {/* 3D Cutting Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>3D Cutting Patterns</CardTitle>
          <CardDescription>Interactive 3D visualization showing how to cut each block optimally</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {results.patterns.map((pattern, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Block #{index + 1} ({pattern.blockWidth} × {pattern.blockHeight} × {pattern.blockDepth}mm)
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Efficiency: {pattern.efficiency}%</Badge>
                  <Badge variant={pattern.wasteVolume > 100000000 ? "destructive" : "secondary"}>
                    Waste: {(pattern.wasteVolume / 1000000).toFixed(2)}L
                  </Badge>
                </div>
              </div>

              {/* 3D Visualization */}
              <div className="relative bg-muted rounded-lg border-2 border-border overflow-hidden">
                <div className="w-full h-96">
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    }
                  >
                    <Viewer3D pattern={pattern} />
                  </Suspense>
                </div>

                {/* Controls overlay */}
                <div className="absolute top-2 left-2 bg-background/90 px-3 py-2 rounded text-xs font-medium">
                  <div>Drag to rotate • Scroll to zoom</div>
                  <div className="text-muted-foreground">
                    {pattern.blockWidth} × {pattern.blockHeight} × {pattern.blockDepth}mm
                  </div>
                </div>
              </div>

              {/* Piece Legend */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {pattern.pieces.map((piece, pieceIndex) => (
                  <div key={pieceIndex} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: piece.color }} />
                    <span>
                      {piece.label}: {piece.width} × {piece.height} × {piece.depth}mm
                      {piece.rotated && <Rotate3D className="inline h-3 w-3 ml-1" />}
                    </span>
                  </div>
                ))}
              </div>

              {/* Volume breakdown */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-primary">{(pattern.utilizedVolume / 1000000).toFixed(2)}L</div>
                  <div className="text-muted-foreground">Utilized Volume</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-destructive">{(pattern.wasteVolume / 1000000).toFixed(2)}L</div>
                  <div className="text-muted-foreground">Waste Volume</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">
                    {((pattern.utilizedVolume + pattern.wasteVolume) / 1000000).toFixed(2)}L
                  </div>
                  <div className="text-muted-foreground">Total Volume</div>
                </div>
              </div>

              {index < results.patterns.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Detailed Summary */}
      <Card>
        <CardHeader>
          <CardTitle>3D Optimization Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Volume Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Block Volume:</span>
                  <span className="font-medium">{(results.summary.totalBlockVolume / 1000000).toFixed(2)}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Required Volume:</span>
                  <span className="font-medium">{(results.summary.totalRequiredVolume / 1000000).toFixed(2)}L</span>
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
                    <span>Volume Utilization</span>
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
