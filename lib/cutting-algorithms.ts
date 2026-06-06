import { StockBar, Piece1D, CalculatorSettings1D } from "@/features/calculators/common/types"
import { PIECE_COLORS } from "@/lib/constants"

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

export function optimize1DCutting(
  stockItems: StockBar[],
  requiredPieces: Piece1D[],
  settings: CalculatorSettings1D,
) {
  // Expand by quantity and sort largest-first for First Fit Decreasing
  const expandedPieces = requiredPieces.flatMap((piece) =>
    Array.from({ length: piece.quantity }, (_, i) => ({
      ...piece,
      id: `${piece.id}-${i}`,
      originalId: piece.id,
      quantity: 1,
    }))
  )
  expandedPieces.sort((a, b) => b.length - a.length)

  const availableStocks = stockItems.flatMap((stock) =>
    Array.from({ length: stock.quantity }, () => ({ length: stock.length, cost: stock.cost }))
  )

  const patterns: CuttingPattern[] = []
  const remainingPieces = [...expandedPieces]
  let totalStockLength = 0

  while (remainingPieces.length > 0 && patterns.length < availableStocks.length) {
    const currentStock = availableStocks[patterns.length]
    let remainingLength = currentStock.length
    let colorIndex = 0
    const pattern: CuttingPattern = {
      stockLength: currentStock.length,
      pieces: [],
      waste: 0,
      efficiency: 0,
    }

    // FFD: iterate pieces largest-first, greedily place each one that fits
    const placedIds = new Set<string>()
    for (const piece of remainingPieces) {
      const requiredLength = piece.length + settings.kerfWidth
      if (requiredLength <= remainingLength) {
        pattern.pieces.push({
          label: piece.label || `Piece ${piece.originalId}`,
          length: piece.length,
          color: PIECE_COLORS[colorIndex % PIECE_COLORS.length],
        })
        remainingLength -= requiredLength
        placedIds.add(piece.id)
        colorIndex++
      }
    }

    // Remove placed pieces from remaining (iterate backward to preserve indices)
    for (let i = remainingPieces.length - 1; i >= 0; i--) {
      if (placedIds.has(remainingPieces[i].id)) {
        remainingPieces.splice(i, 1)
      }
    }

    const usedLength = currentStock.length - remainingLength
    pattern.waste = Math.max(0, remainingLength)
    pattern.efficiency = Math.round((usedLength / currentStock.length) * 100)

    totalStockLength += currentStock.length
    patterns.push(pattern)

    // Stop if no piece fit — remaining pieces exceed any available stock length
    if (placedIds.size === 0) break
  }

  const totalRequiredLength = expandedPieces.reduce((sum, p) => sum + p.length, 0)
  const totalWaste = patterns.reduce((sum, p) => sum + p.waste, 0)
  const efficiency = totalStockLength > 0 ? Math.round((totalRequiredLength / totalStockLength) * 100) : 0
  const wastePercentage = totalStockLength > 0 ? Math.round((totalWaste / totalStockLength) * 100) : 0

  const averageCost = stockItems.reduce((sum, item) => sum + (item.cost || 25), 0) / stockItems.length
  const potentialStocksNeeded = Math.ceil(totalRequiredLength / (stockItems[0]?.length || 3000))
  const costSavings = Math.max(0, Math.round((potentialStocksNeeded - patterns.length) * averageCost))

  return {
    patterns,
    efficiency,
    totalWaste,
    stocksUsed: patterns.length,
    unplacedPieces: remainingPieces.length,
    costSavings,
    summary: {
      totalStockLength,
      totalRequiredLength,
      wastePercentage,
    },
  }
}
