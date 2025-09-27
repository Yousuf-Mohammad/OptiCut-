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

// Simple 2D bin packing algorithm using Bottom-Left Fill
export function optimize2DCutting(sheets: Sheet2D[], pieces: Piece2D[], settings: OptimizationSettings2D) {
  // Expand pieces into individual items
  const allPieces: Array<Piece2D & { originalId: string; colorIndex: number }> = []
  let colorIndex = 0

  pieces.forEach((piece) => {
    for (let i = 0; i < piece.quantity; i++) {
      allPieces.push({
        ...piece,
        id: `${piece.id}-${i}`,
        originalId: piece.id,
        quantity: 1,
        colorIndex: colorIndex % pieceColors.length,
      })
    }
    colorIndex++
  })

  // Sort pieces by area (descending) for better packing
  allPieces.sort((a, b) => b.width * b.height - a.width * a.height)

  const patterns: CuttingPattern2D[] = []
  const remainingPieces = [...allPieces]
  let sheetsUsed = 0
  let totalWasteArea = 0

  // Expand sheets
  const availableSheets: Array<{ width: number; height: number; cost?: number }> = []
  sheets.forEach((sheet) => {
    for (let i = 0; i < sheet.quantity; i++) {
      availableSheets.push({ width: sheet.width, height: sheet.height, cost: sheet.cost })
    }
  })

  // Pack pieces into sheets
  while (remainingPieces.length > 0 && sheetsUsed < availableSheets.length) {
    const currentSheet = availableSheets[sheetsUsed]
    const pattern: CuttingPattern2D = {
      sheetWidth: currentSheet.width,
      sheetHeight: currentSheet.height,
      pieces: [],
      wasteArea: 0,
      efficiency: 0,
      utilizedArea: 0,
    }

    // Use a simple bottom-left fill algorithm
    const placedPieces = packPiecesIntoSheet(
      remainingPieces,
      currentSheet.width - 2 * settings.margin,
      currentSheet.height - 2 * settings.margin,
      settings,
    )

    // Add placed pieces to pattern with margin offset
    placedPieces.forEach((piece) => {
      pattern.pieces.push({
        ...piece,
        x: piece.x + settings.margin,
        y: piece.y + settings.margin,
      })

      // Remove from remaining pieces
      const index = remainingPieces.findIndex((p) => p.id === piece.id)
      if (index !== -1) {
        remainingPieces.splice(index, 1)
      }
    })

    // Calculate pattern statistics
    const utilizedArea = pattern.pieces.reduce((sum, piece) => sum + piece.width * piece.height, 0)
    const totalSheetArea = currentSheet.width * currentSheet.height
    pattern.utilizedArea = utilizedArea
    pattern.wasteArea = totalSheetArea - utilizedArea
    pattern.efficiency = Math.round((utilizedArea / totalSheetArea) * 100)

    totalWasteArea += pattern.wasteArea
    patterns.push(pattern)
    sheetsUsed++
  }

  // Calculate overall statistics
  const totalSheetArea = sheetsUsed * (sheets[0]?.width * sheets[0]?.height || 0)
  const totalRequiredArea = allPieces.reduce((sum, piece) => sum + piece.width * piece.height, 0)
  const efficiency = Math.round((totalRequiredArea / totalSheetArea) * 100)
  const wastePercentage = Math.round((totalWasteArea / totalSheetArea) * 100)

  // Calculate cost savings
  const averageCost = sheets.reduce((sum, sheet) => sum + (sheet.cost || 150), 0) / sheets.length
  const potentialSheetsNeeded = Math.ceil(totalRequiredArea / (sheets[0]?.width * sheets[0]?.height || 1))
  const costSavings = Math.round((potentialSheetsNeeded - sheetsUsed) * averageCost)

  return {
    patterns,
    efficiency,
    totalWasteArea,
    sheetsUsed,
    costSavings: Math.max(0, costSavings),
    summary: {
      totalSheetArea,
      totalRequiredArea,
      wastePercentage,
    },
  }
}

function packPiecesIntoSheet(
  pieces: Array<Piece2D & { originalId: string; colorIndex: number }>,
  sheetWidth: number,
  sheetHeight: number,
  settings: OptimizationSettings2D,
): PlacedPiece2D[] {
  const placedPieces: PlacedPiece2D[] = []
  const occupiedRects: Array<{ x: number; y: number; width: number; height: number }> = []

  for (const piece of pieces) {
    let placed = false
    const orientations = []

    // Add original orientation
    orientations.push({ width: piece.width, height: piece.height, rotated: false })

    // Add rotated orientation if allowed
    if (settings.allowRotation && piece.canRotate && piece.width !== piece.height) {
      orientations.push({ width: piece.height, height: piece.width, rotated: true })
    }

    // Try each orientation
    for (const orientation of orientations) {
      if (placed) break

      const pieceWidth = orientation.width + settings.kerfWidth
      const pieceHeight = orientation.height + settings.kerfWidth

      // Try to place at each possible position (bottom-left fill)
      for (let y = 0; y <= sheetHeight - pieceHeight; y += 10) {
        if (placed) break
        for (let x = 0; x <= sheetWidth - pieceWidth; x += 10) {
          if (canPlacePiece(x, y, pieceWidth, pieceHeight, occupiedRects)) {
            placedPieces.push({
              id: piece.id,
              label: piece.label || `Piece ${piece.originalId}`,
              x,
              y,
              width: orientation.width,
              height: orientation.height,
              rotated: orientation.rotated,
              color: pieceColors[piece.colorIndex],
            })

            occupiedRects.push({
              x,
              y,
              width: pieceWidth,
              height: pieceHeight,
            })

            placed = true
            break
          }
        }
      }
    }

    if (!placed) {
      // If we can't place this piece, stop trying to place more pieces in this sheet
      break
    }
  }

  return placedPieces
}

function canPlacePiece(
  x: number,
  y: number,
  width: number,
  height: number,
  occupiedRects: Array<{ x: number; y: number; width: number; height: number }>,
): boolean {
  for (const rect of occupiedRects) {
    if (x < rect.x + rect.width && x + width > rect.x && y < rect.y + rect.height && y + height > rect.y) {
      return false // Overlaps with existing piece
    }
  }
  return true
}
