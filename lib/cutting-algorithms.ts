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

export function optimize1DCutting(
  stockItems: StockItem[],
  requiredPieces: RequiredPiece[],
  settings: OptimizationSettings,
) {
  // Expand required pieces into individual pieces
  const allRequiredPieces: Array<RequiredPiece & { originalId: string }> = []
  requiredPieces.forEach((piece) => {
    for (let i = 0; i < piece.quantity; i++) {
      allRequiredPieces.push({
        ...piece,
        id: `${piece.id}-${i}`,
        originalId: piece.id,
        quantity: 1,
      })
    }
  })

  // Sort pieces by length (descending) for better optimization
  allRequiredPieces.sort((a, b) => b.length - a.length)

  const patterns: CuttingPattern[] = []
  const remainingPieces = [...allRequiredPieces]
  let stockUsed = 0
  let totalWaste = 0

  // Expand stock items
  const availableStocks: Array<{ length: number; cost?: number }> = []
  stockItems.forEach((stock) => {
    for (let i = 0; i < stock.quantity; i++) {
      availableStocks.push({ length: stock.length, cost: stock.cost })
    }
  })

  // First Fit Decreasing algorithm
  while (remainingPieces.length > 0 && stockUsed < availableStocks.length) {
    const currentStock = availableStocks[stockUsed]
    const pattern: CuttingPattern = {
      stockLength: currentStock.length,
      pieces: [],
      waste: currentStock.length,
      efficiency: 0,
    }

    let remainingLength = currentStock.length
    let colorIndex = 0

    // Try to fit pieces into current stock
    for (let i = remainingPieces.length - 1; i >= 0; i--) {
      const piece = remainingPieces[i]
      const requiredLength = piece.length + settings.kerfWidth

      if (requiredLength <= remainingLength) {
        pattern.pieces.push({
          label: piece.label || `Piece ${piece.originalId}`,
          length: piece.length,
          color: pieceColors[colorIndex % pieceColors.length],
        })

        remainingLength -= requiredLength
        remainingPieces.splice(i, 1)
        colorIndex++
      }
    }

    // Calculate pattern efficiency
    const usedLength = currentStock.length - remainingLength
    pattern.waste = Math.max(0, remainingLength)
    pattern.efficiency = Math.round((usedLength / currentStock.length) * 100)

    totalWaste += pattern.waste
    patterns.push(pattern)
    stockUsed++
  }

  // Calculate overall statistics
  const totalStockLength = stockUsed * (stockItems[0]?.length || 0)
  const totalRequiredLength = allRequiredPieces.reduce((sum, piece) => sum + piece.length, 0)
  const efficiency = Math.round((totalRequiredLength / totalStockLength) * 100)
  const wastePercentage = Math.round((totalWaste / totalStockLength) * 100)

  // Calculate cost savings (simplified)
  const averageCost = stockItems.reduce((sum, item) => sum + (item.cost || 25), 0) / stockItems.length
  const potentialStocksNeeded = Math.ceil(totalRequiredLength / (stockItems[0]?.length || 3000))
  const costSavings = Math.round((potentialStocksNeeded - stockUsed) * averageCost)

  return {
    patterns,
    efficiency,
    totalWaste,
    stocksUsed: stockUsed,
    costSavings: Math.max(0, costSavings),
    summary: {
      totalStockLength,
      totalRequiredLength,
      wastePercentage,
    },
  }
}
