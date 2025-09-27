"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Calculator, Download, RotateCcw, RotateCw } from "lucide-react"
import { CuttingResults2D } from "@/components/cutting-results-2d"
import { optimize2DCutting } from "@/lib/cutting-algorithms-2d"

interface Sheet2D {
  id: string
  width: number
  height: number
  quantity: number
  cost?: number
}

interface Piece2D {
  id: string
  width: number
  height: number
  quantity: number
  label?: string
  canRotate: boolean
}

interface OptimizationSettings2D {
  kerfWidth: number
  minWasteArea: number
  allowRotation: boolean
  margin: number
}

export function Calculator2D() {
  const [sheets, setSheets] = useState<Sheet2D[]>([{ id: "1", width: 2440, height: 1220, quantity: 5 }])
  const [pieces, setPieces] = useState<Piece2D[]>([
    { id: "1", width: 600, height: 400, quantity: 8, label: "Panel A", canRotate: true },
    { id: "2", width: 300, height: 800, quantity: 4, label: "Panel B", canRotate: true },
    { id: "3", width: 450, height: 300, quantity: 6, label: "Panel C", canRotate: false },
  ])
  const [settings, setSettings] = useState<OptimizationSettings2D>({
    kerfWidth: 3,
    minWasteArea: 10000,
    allowRotation: true,
    margin: 10,
  })
  const [results, setResults] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const addSheet = () => {
    const newId = (sheets.length + 1).toString()
    setSheets([...sheets, { id: newId, width: 2440, height: 1220, quantity: 1 }])
  }

  const removeSheet = (id: string) => {
    setSheets(sheets.filter((sheet) => sheet.id !== id))
  }

  const updateSheet = (id: string, field: keyof Sheet2D, value: number) => {
    setSheets(sheets.map((sheet) => (sheet.id === id ? { ...sheet, [field]: value } : sheet)))
  }

  const addPiece = () => {
    const newId = (pieces.length + 1).toString()
    setPieces([
      ...pieces,
      {
        id: newId,
        width: 0,
        height: 0,
        quantity: 1,
        label: `Panel ${String.fromCharCode(65 + pieces.length)}`,
        canRotate: true,
      },
    ])
  }

  const removePiece = (id: string) => {
    setPieces(pieces.filter((piece) => piece.id !== id))
  }

  const updatePiece = (id: string, field: keyof Piece2D, value: number | string | boolean) => {
    setPieces(pieces.map((piece) => (piece.id === id ? { ...piece, [field]: value } : piece)))
  }

  const handleOptimize = async () => {
    setIsCalculating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const optimizationResults = optimize2DCutting(sheets, pieces, settings)
      setResults(optimizationResults)
    } catch (error) {
      console.error("2D Optimization failed:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const resetCalculator = () => {
    setSheets([{ id: "1", width: 2440, height: 1220, quantity: 5 }])
    setPieces([
      { id: "1", width: 600, height: 400, quantity: 8, label: "Panel A", canRotate: true },
      { id: "2", width: 300, height: 800, quantity: 4, label: "Panel B", canRotate: true },
      { id: "3", width: 450, height: 300, quantity: 6, label: "Panel C", canRotate: false },
    ])
    setResults(null)
  }

  const totalPieces = pieces.reduce((sum, piece) => sum + piece.quantity, 0)

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Sheet Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Sheet Materials
              <Badge variant="secondary">{sheets.length} types</Badge>
            </CardTitle>
            <CardDescription>Define your available sheet dimensions and quantities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sheets.map((sheet) => (
              <div key={sheet.id} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor={`sheet-width-${sheet.id}`}>Width (mm)</Label>
                  <Input
                    id={`sheet-width-${sheet.id}`}
                    type="number"
                    value={sheet.width || ""}
                    onChange={(e) => updateSheet(sheet.id, "width", Number(e.target.value))}
                    placeholder="2440"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`sheet-height-${sheet.id}`}>Height (mm)</Label>
                  <Input
                    id={`sheet-height-${sheet.id}`}
                    type="number"
                    value={sheet.height || ""}
                    onChange={(e) => updateSheet(sheet.id, "height", Number(e.target.value))}
                    placeholder="1220"
                  />
                </div>
                <div className="w-20">
                  <Label htmlFor={`sheet-qty-${sheet.id}`}>Qty</Label>
                  <Input
                    id={`sheet-qty-${sheet.id}`}
                    type="number"
                    value={sheet.quantity || ""}
                    onChange={(e) => updateSheet(sheet.id, "quantity", Number(e.target.value))}
                    placeholder="5"
                  />
                </div>
                <div className="w-28">
                  <Label htmlFor={`sheet-cost-${sheet.id}`}>Cost</Label>
                  <Input
                    id={`sheet-cost-${sheet.id}`}
                    type="number"
                    step="0.01"
                    value={sheet.cost || ""}
                    onChange={(e) => updateSheet(sheet.id, "cost", Number(e.target.value))}
                    placeholder="150.00"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeSheet(sheet.id)}
                  disabled={sheets.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addSheet} className="w-full bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add Sheet Type
            </Button>
          </CardContent>
        </Card>

        {/* Required Pieces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Required Pieces
              <Badge variant="secondary">{totalPieces} pieces</Badge>
            </CardTitle>
            <CardDescription>Specify the rectangular pieces you need to cut from your sheets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pieces.map((piece) => (
              <div key={piece.id} className="space-y-3 p-4 border border-border rounded-lg">
                <div className="flex gap-4 items-end">
                  <div className="w-32">
                    <Label htmlFor={`piece-label-${piece.id}`}>Label</Label>
                    <Input
                      id={`piece-label-${piece.id}`}
                      value={piece.label || ""}
                      onChange={(e) => updatePiece(piece.id, "label", e.target.value)}
                      placeholder="Panel A"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`piece-width-${piece.id}`}>Width (mm)</Label>
                    <Input
                      id={`piece-width-${piece.id}`}
                      type="number"
                      value={piece.width || ""}
                      onChange={(e) => updatePiece(piece.id, "width", Number(e.target.value))}
                      placeholder="600"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`piece-height-${piece.id}`}>Height (mm)</Label>
                    <Input
                      id={`piece-height-${piece.id}`}
                      type="number"
                      value={piece.height || ""}
                      onChange={(e) => updatePiece(piece.id, "height", Number(e.target.value))}
                      placeholder="400"
                    />
                  </div>
                  <div className="w-20">
                    <Label htmlFor={`piece-qty-${piece.id}`}>Qty</Label>
                    <Input
                      id={`piece-qty-${piece.id}`}
                      type="number"
                      value={piece.quantity || ""}
                      onChange={(e) => updatePiece(piece.id, "quantity", Number(e.target.value))}
                      placeholder="8"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removePiece(piece.id)}
                    disabled={pieces.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`piece-rotate-${piece.id}`}
                    checked={piece.canRotate}
                    onCheckedChange={(checked) => updatePiece(piece.id, "canRotate", checked)}
                  />
                  <Label htmlFor={`piece-rotate-${piece.id}`} className="text-sm">
                    Allow rotation
                  </Label>
                  <RotateCw className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addPiece} className="w-full bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add Piece Type
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>2D Optimization Settings</CardTitle>
            <CardDescription>Configure cutting parameters for sheet materials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kerf-width-2d">Kerf Width (mm)</Label>
                <Input
                  id="kerf-width-2d"
                  type="number"
                  step="0.1"
                  value={settings.kerfWidth}
                  onChange={(e) => setSettings({ ...settings, kerfWidth: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="margin-2d">Edge Margin (mm)</Label>
                <Input
                  id="margin-2d"
                  type="number"
                  value={settings.margin}
                  onChange={(e) => setSettings({ ...settings, margin: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="min-waste-area">Min Waste Area (mm²)</Label>
              <Input
                id="min-waste-area"
                type="number"
                value={settings.minWasteArea}
                onChange={(e) => setSettings({ ...settings, minWasteArea: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allow-rotation"
                checked={settings.allowRotation}
                onCheckedChange={(checked) => setSettings({ ...settings, allowRotation: checked })}
              />
              <Label htmlFor="allow-rotation">Allow global rotation for all pieces</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleOptimize} disabled={isCalculating} className="w-full" size="lg">
              <Calculator className="mr-2 h-4 w-4" />
              {isCalculating ? "Optimizing 2D..." : "Optimize 2D Cutting"}
            </Button>

            <Button variant="outline" onClick={resetCalculator} className="w-full bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            {/* {results && (
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export 2D Results
              </Button>
            )} */}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Material Efficiency</span>
                <span className="font-semibold text-primary">{results.efficiency}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Waste Area</span>
                <span className="font-semibold text-destructive">{results.totalWasteArea.toLocaleString()}mm²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sheets Used</span>
                <span className="font-semibold">{results.sheetsUsed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cost Savings</span>
                <span className="font-semibold text-accent">${results.costSavings}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div className="lg:col-span-3">
          <Separator className="my-8" />
          <CuttingResults2D results={results} />
        </div>
      )}
    </div>
  )
}
