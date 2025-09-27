"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Calculator, Download, RotateCcw, Rotate3D } from "lucide-react"
import { CuttingResults3D } from "@/components/cutting-results-3d"
import { optimize3DCutting } from "@/lib/cutting-algorithms-3d"

interface Block3D {
  id: string
  width: number
  height: number
  depth: number
  quantity: number
  cost?: number
}

interface Piece3D {
  id: string
  width: number
  height: number
  depth: number
  quantity: number
  label?: string
  canRotate: boolean
}

interface OptimizationSettings3D {
  kerfWidth: number
  minWasteVolume: number
  allowRotation: boolean
  margin: number
}

export function Calculator3D() {
  const [blocks, setBlocks] = useState<Block3D[]>([{ id: "1", width: 2400, height: 1200, depth: 600, quantity: 3 }])
  const [pieces, setPieces] = useState<Piece3D[]>([
    { id: "1", width: 800, height: 400, depth: 200, quantity: 6, label: "Block A", canRotate: true },
    { id: "2", width: 600, height: 300, depth: 150, quantity: 4, label: "Block B", canRotate: true },
    { id: "3", width: 400, height: 600, depth: 300, quantity: 3, label: "Block C", canRotate: false },
  ])
  const [settings, setSettings] = useState<OptimizationSettings3D>({
    kerfWidth: 5,
    minWasteVolume: 1000000,
    allowRotation: true,
    margin: 15,
  })
  const [results, setResults] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const addBlock = () => {
    const newId = (blocks.length + 1).toString()
    setBlocks([...blocks, { id: newId, width: 2400, height: 1200, depth: 600, quantity: 1 }])
  }

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id))
  }

  const updateBlock = (id: string, field: keyof Block3D, value: number) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, [field]: value } : block)))
  }

  const addPiece = () => {
    const newId = (pieces.length + 1).toString()
    setPieces([
      ...pieces,
      {
        id: newId,
        width: 0,
        height: 0,
        depth: 0,
        quantity: 1,
        label: `Block ${String.fromCharCode(65 + pieces.length)}`,
        canRotate: true,
      },
    ])
  }

  const removePiece = (id: string) => {
    setPieces(pieces.filter((piece) => piece.id !== id))
  }

  const updatePiece = (id: string, field: keyof Piece3D, value: number | string | boolean) => {
    setPieces(pieces.map((piece) => (piece.id === id ? { ...piece, [field]: value } : piece)))
  }

  const handleOptimize = async () => {
    setIsCalculating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const optimizationResults = optimize3DCutting(blocks, pieces, settings)
      setResults(optimizationResults)
    } catch (error) {
      console.error("3D Optimization failed:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const resetCalculator = () => {
    setBlocks([{ id: "1", width: 2400, height: 1200, depth: 600, quantity: 3 }])
    setPieces([
      { id: "1", width: 800, height: 400, depth: 200, quantity: 6, label: "Block A", canRotate: true },
      { id: "2", width: 600, height: 300, depth: 150, quantity: 4, label: "Block B", canRotate: true },
      { id: "3", width: 400, height: 600, depth: 300, quantity: 3, label: "Block C", canRotate: false },
    ])
    setResults(null)
  }

  const totalPieces = pieces.reduce((sum, piece) => sum + piece.quantity, 0)

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Block Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Block Materials
              <Badge variant="secondary">{blocks.length} types</Badge>
            </CardTitle>
            <CardDescription>Define your available block dimensions and quantities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {blocks.map((block) => (
              <div key={block.id} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor={`block-width-${block.id}`}>Width (mm)</Label>
                  <Input
                    id={`block-width-${block.id}`}
                    type="number"
                    value={block.width || ""}
                    onChange={(e) => updateBlock(block.id, "width", Number(e.target.value))}
                    placeholder="2400"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`block-height-${block.id}`}>Height (mm)</Label>
                  <Input
                    id={`block-height-${block.id}`}
                    type="number"
                    value={block.height || ""}
                    onChange={(e) => updateBlock(block.id, "height", Number(e.target.value))}
                    placeholder="1200"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`block-depth-${block.id}`}>Depth (mm)</Label>
                  <Input
                    id={`block-depth-${block.id}`}
                    type="number"
                    value={block.depth || ""}
                    onChange={(e) => updateBlock(block.id, "depth", Number(e.target.value))}
                    placeholder="600"
                  />
                </div>
                <div className="w-20">
                  <Label htmlFor={`block-qty-${block.id}`}>Qty</Label>
                  <Input
                    id={`block-qty-${block.id}`}
                    type="number"
                    value={block.quantity || ""}
                    onChange={(e) => updateBlock(block.id, "quantity", Number(e.target.value))}
                    placeholder="3"
                  />
                </div>
                <div className="w-28">
                  <Label htmlFor={`block-cost-${block.id}`}>Cost</Label>
                  <Input
                    id={`block-cost-${block.id}`}
                    type="number"
                    step="0.01"
                    value={block.cost || ""}
                    onChange={(e) => updateBlock(block.id, "cost", Number(e.target.value))}
                    placeholder="300.00"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeBlock(block.id)}
                  disabled={blocks.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addBlock} className="w-full bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add Block Type
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
            <CardDescription>Specify the 3D pieces you need to cut from your blocks</CardDescription>
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
                      placeholder="Block A"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`piece-width-${piece.id}`}>Width (mm)</Label>
                    <Input
                      id={`piece-width-${piece.id}`}
                      type="number"
                      value={piece.width || ""}
                      onChange={(e) => updatePiece(piece.id, "width", Number(e.target.value))}
                      placeholder="800"
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
                  <div className="flex-1">
                    <Label htmlFor={`piece-depth-${piece.id}`}>Depth (mm)</Label>
                    <Input
                      id={`piece-depth-${piece.id}`}
                      type="number"
                      value={piece.depth || ""}
                      onChange={(e) => updatePiece(piece.id, "depth", Number(e.target.value))}
                      placeholder="200"
                    />
                  </div>
                  <div className="w-20">
                    <Label htmlFor={`piece-qty-${piece.id}`}>Qty</Label>
                    <Input
                      id={`piece-qty-${piece.id}`}
                      type="number"
                      value={piece.quantity || ""}
                      onChange={(e) => updatePiece(piece.id, "quantity", Number(e.target.value))}
                      placeholder="6"
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
                    Allow 3D rotation
                  </Label>
                  <Rotate3D className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle>3D Optimization Settings</CardTitle>
            <CardDescription>Configure cutting parameters for volumetric materials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kerf-width-3d">Kerf Width (mm)</Label>
                <Input
                  id="kerf-width-3d"
                  type="number"
                  step="0.1"
                  value={settings.kerfWidth}
                  onChange={(e) => setSettings({ ...settings, kerfWidth: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="margin-3d">Edge Margin (mm)</Label>
                <Input
                  id="margin-3d"
                  type="number"
                  value={settings.margin}
                  onChange={(e) => setSettings({ ...settings, margin: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="min-waste-volume">Min Waste Volume (mm³)</Label>
              <Input
                id="min-waste-volume"
                type="number"
                value={settings.minWasteVolume}
                onChange={(e) => setSettings({ ...settings, minWasteVolume: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="allow-rotation-3d"
                checked={settings.allowRotation}
                onCheckedChange={(checked) => setSettings({ ...settings, allowRotation: checked })}
              />
              <Label htmlFor="allow-rotation-3d">Allow global 3D rotation for all pieces</Label>
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
              {isCalculating ? "Optimizing 3D..." : "Optimize 3D Cutting"}
            </Button>

            <Button variant="outline" onClick={resetCalculator} className="w-full bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            {/* {results && (
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export 3D Results
              </Button>
            )} */}
          </CardContent>
        </Card>

       
      </div>

      {/* Results Section */}
      {results && (
        <div className="lg:col-span-3">
          <Separator className="my-8" />
          <CuttingResults3D results={results} />
        </div>
      )}
    </div>
  )
}
