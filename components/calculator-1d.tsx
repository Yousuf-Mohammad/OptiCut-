"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Calculator, Download, RotateCcw } from "lucide-react"
import { CuttingResults } from "@/components/cutting-results"
import { optimize1DCutting } from "@/lib/cutting-algorithms"

interface StockItem {
  id: string
  length: number
  quantity: number
  cost?: number
}

interface RequiredPiece {
  id: string
  length: number
  quantity: number
  label?: string
}

interface OptimizationSettings {
  kerfWidth: number
  minWasteLength: number
}

export function Calculator1D() {
  const [stockItems, setStockItems] = useState<StockItem[]>([{ id: "1", length: 3000, quantity: 10 }])
  const [requiredPieces, setRequiredPieces] = useState<RequiredPiece[]>([
    { id: "1", length: 1200, quantity: 5, label: "Piece A" },
    { id: "2", length: 800, quantity: 8, label: "Piece B" },
  ])
  const [settings, setSettings] = useState<OptimizationSettings>({
    kerfWidth: 3,
    minWasteLength: 50,
  })
  const [results, setResults] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const addStockItem = () => {
    const newId = (stockItems.length + 1).toString()
    setStockItems([...stockItems, { id: newId, length: 0, quantity: 1 }])
  }

  const removeStockItem = (id: string) => {
    setStockItems(stockItems.filter((item) => item.id !== id))
  }

  const updateStockItem = (id: string, field: keyof StockItem, value: number) => {
    setStockItems(stockItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addRequiredPiece = () => {
    const newId = (requiredPieces.length + 1).toString()
    setRequiredPieces([
      ...requiredPieces,
      { id: newId, length: 0, quantity: 1, label: `Piece ${String.fromCharCode(65 + requiredPieces.length)}` },
    ])
  }

  const removeRequiredPiece = (id: string) => {
    setRequiredPieces(requiredPieces.filter((piece) => piece.id !== id))
  }

  const updateRequiredPiece = (id: string, field: keyof RequiredPiece, value: number | string) => {
    setRequiredPieces(requiredPieces.map((piece) => (piece.id === id ? { ...piece, [field]: value } : piece)))
  }

  const handleOptimize = async () => {
    setIsCalculating(true)
    try {
      // Simulate calculation time for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const optimizationResults = optimize1DCutting(stockItems, requiredPieces, settings)
      setResults(optimizationResults)
    } catch (error) {
      console.error("Optimization failed:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const resetCalculator = () => {
    setStockItems([{ id: "1", length: 3000, quantity: 10 }])
    setRequiredPieces([
      { id: "1", length: 1200, quantity: 5, label: "Piece A" },
      { id: "2", length: 800, quantity: 8, label: "Piece B" },
    ])
    setResults(null)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Stock Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Stock Materials
              <Badge variant="secondary">{stockItems.length} items</Badge>
            </CardTitle>
            <CardDescription>Define your available stock lengths and quantities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockItems.map((item) => (
              <div key={item.id} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor={`stock-length-${item.id}`}>Length (mm)</Label>
                  <Input
                    id={`stock-length-${item.id}`}
                    type="number"
                    value={item.length || ""}
                    onChange={(e) => updateStockItem(item.id, "length", Number(e.target.value))}
                    placeholder="3000"
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor={`stock-qty-${item.id}`}>Qty</Label>
                  <Input
                    id={`stock-qty-${item.id}`}
                    type="number"
                    value={item.quantity || ""}
                    onChange={(e) => updateStockItem(item.id, "quantity", Number(e.target.value))}
                    placeholder="10"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor={`stock-cost-${item.id}`}>Cost (optional)</Label>
                  <Input
                    id={`stock-cost-${item.id}`}
                    type="number"
                    step="0.01"
                    value={item.cost || ""}
                    onChange={(e) => updateStockItem(item.id, "cost", Number(e.target.value))}
                    placeholder="25.00"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeStockItem(item.id)}
                  disabled={stockItems.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addStockItem} className="w-full bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add Stock Item
            </Button>
          </CardContent>
        </Card>

        {/* Required Pieces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Required Pieces
              <Badge variant="secondary">{requiredPieces.reduce((sum, piece) => sum + piece.quantity, 0)} pieces</Badge>
            </CardTitle>
            <CardDescription>Specify the pieces you need to cut from your stock</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requiredPieces.map((piece) => (
              <div key={piece.id} className="flex gap-4 items-end">
                <div className="w-32">
                  <Label htmlFor={`piece-label-${piece.id}`}>Label</Label>
                  <Input
                    id={`piece-label-${piece.id}`}
                    value={piece.label || ""}
                    onChange={(e) => updateRequiredPiece(piece.id, "label", e.target.value)}
                    placeholder="Piece A"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`piece-length-${piece.id}`}>Length (mm)</Label>
                  <Input
                    id={`piece-length-${piece.id}`}
                    type="number"
                    value={piece.length || ""}
                    onChange={(e) => updateRequiredPiece(piece.id, "length", Number(e.target.value))}
                    placeholder="1200"
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor={`piece-qty-${piece.id}`}>Qty</Label>
                  <Input
                    id={`piece-qty-${piece.id}`}
                    type="number"
                    value={piece.quantity || ""}
                    onChange={(e) => updateRequiredPiece(piece.id, "quantity", Number(e.target.value))}
                    placeholder="5"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeRequiredPiece(piece.id)}
                  disabled={requiredPieces.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addRequiredPiece} className="w-full bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add Required Piece
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Settings</CardTitle>
            <CardDescription>Fine-tune the cutting parameters for your specific needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kerf-width">Kerf Width (mm)</Label>
                <Input
                  id="kerf-width"
                  type="number"
                  step="0.1"
                  value={settings.kerfWidth}
                  onChange={(e) => setSettings({ ...settings, kerfWidth: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="min-waste">Min Waste Length (mm)</Label>
                <Input
                  id="min-waste"
                  type="number"
                  value={settings.minWasteLength}
                  onChange={(e) => setSettings({ ...settings, minWasteLength: Number(e.target.value) })}
                />
              </div>
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
              {isCalculating ? "Optimizing..." : "Optimize Cutting"}
            </Button>

            <Button variant="outline" onClick={resetCalculator} className="w-full bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            {/* {results && (
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export Results
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
                <span className="text-sm text-muted-foreground">Total Waste</span>
                <span className="font-semibold text-destructive">{results.totalWaste}mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Stocks Used</span>
                <span className="font-semibold">{results.stocksUsed}</span>
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
          <CuttingResults results={results} />
        </div>
      )}
    </div>
  )
}
