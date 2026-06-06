import { Sheet, Piece2D, CalculatorSettings2D } from "@/features/calculators/common/types"
import { PIECE_COLORS } from "@/lib/constants"

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

interface OccupiedRect {
  x: number
  y: number
  width: number
  height: number
}

export function optimize2DCutting(sheets: Sheet[], pieces: Piece2D[], settings: CalculatorSettings2D) {
  // Expand by quantity, assign a stable color per piece type, sort largest-area first
  const expandedPieces = pieces.flatMap((piece, typeIndex) =>
    Array.from({ length: piece.quantity }, (_, i) => ({
      ...piece,
      id: `${piece.id}-${i}`,
      originalId: piece.id,
      quantity: 1,
      colorIndex: typeIndex % PIECE_COLORS.length,
    }))
  )
  expandedPieces.sort((a, b) => b.width * b.height - a.width * a.height)

  const availableSheets = sheets.flatMap((sheet) =>
    Array.from({ length: sheet.quantity }, () => ({
      width: sheet.width,
      height: sheet.height,
      cost: sheet.cost,
    }))
  )

  const patterns: CuttingPattern2D[] = []
  const remainingPieces = [...expandedPieces]
  let totalWasteArea = 0

  while (remainingPieces.length > 0 && patterns.length < availableSheets.length) {
    const currentSheet = availableSheets[patterns.length]
    const innerWidth = currentSheet.width - 2 * settings.margin
    const innerHeight = currentSheet.height - 2 * settings.margin

    const placedPieces = packPiecesIntoSheet(remainingPieces, innerWidth, innerHeight, settings)

    // No pieces fit at all — remaining pieces exceed this sheet size; stop
    if (placedPieces.length === 0) break

    const pattern: CuttingPattern2D = {
      sheetWidth: currentSheet.width,
      sheetHeight: currentSheet.height,
      pieces: [],
      wasteArea: 0,
      efficiency: 0,
      utilizedArea: 0,
    }

    const placedIds = new Set(placedPieces.map((p) => p.id))
    placedPieces.forEach((piece) => {
      pattern.pieces.push({
        ...piece,
        x: piece.x + settings.margin,
        y: piece.y + settings.margin,
      })
    })

    // Remove placed pieces from remaining
    for (let i = remainingPieces.length - 1; i >= 0; i--) {
      if (placedIds.has(remainingPieces[i].id)) {
        remainingPieces.splice(i, 1)
      }
    }

    const utilizedArea = pattern.pieces.reduce((sum, p) => sum + p.width * p.height, 0)
    const totalSheetArea = currentSheet.width * currentSheet.height
    pattern.utilizedArea = utilizedArea
    pattern.wasteArea = totalSheetArea - utilizedArea
    pattern.efficiency = Math.round((utilizedArea / totalSheetArea) * 100)

    totalWasteArea += pattern.wasteArea
    patterns.push(pattern)
  }

  const totalSheetArea = patterns.reduce((sum, _, i) => sum + availableSheets[i].width * availableSheets[i].height, 0)
  const totalRequiredArea = expandedPieces.reduce((sum, p) => sum + p.width * p.height, 0)
  const efficiency = totalSheetArea > 0 ? Math.round((totalRequiredArea / totalSheetArea) * 100) : 0
  const wastePercentage = totalSheetArea > 0 ? Math.round((totalWasteArea / totalSheetArea) * 100) : 0

  const averageCost = sheets.reduce((sum, s) => sum + (s.cost || 150), 0) / sheets.length
  const potentialSheetsNeeded = Math.ceil(totalRequiredArea / (sheets[0]?.width * sheets[0]?.height || 1))
  const costSavings = Math.max(0, Math.round((potentialSheetsNeeded - patterns.length) * averageCost))

  return {
    patterns,
    efficiency,
    totalWasteArea,
    sheetsUsed: patterns.length,
    unplacedPieces: remainingPieces.length,
    costSavings,
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
  settings: CalculatorSettings2D,
): PlacedPiece2D[] {
  const placedPieces: PlacedPiece2D[] = []
  const occupiedRects: OccupiedRect[] = []

  for (const piece of pieces) {
    const orientations = [{ width: piece.width, height: piece.height, rotated: false }]

    if (settings.allowRotation && piece.canRotate && piece.width !== piece.height) {
      orientations.push({ width: piece.height, height: piece.width, rotated: true })
    }

    let placed = false
    for (const orientation of orientations) {
      if (placed) break

      const pw = orientation.width + settings.kerfWidth
      const ph = orientation.height + settings.kerfWidth

      for (let y = 0; y <= sheetHeight - ph && !placed; y += 10) {
        for (let x = 0; x <= sheetWidth - pw && !placed; x += 10) {
          if (canPlace(x, y, pw, ph, occupiedRects)) {
            placedPieces.push({
              id: piece.id,
              label: piece.label || `Piece ${piece.originalId}`,
              x,
              y,
              width: orientation.width,
              height: orientation.height,
              rotated: orientation.rotated,
              color: PIECE_COLORS[piece.colorIndex],
            })
            occupiedRects.push({ x, y, width: pw, height: ph })
            placed = true
          }
        }
      }
    }
    // If this piece didn't fit, continue to try the next piece (don't break)
  }

  return placedPieces
}

function canPlace(
  x: number,
  y: number,
  width: number,
  height: number,
  occupied: OccupiedRect[],
): boolean {
  for (const r of occupied) {
    if (x < r.x + r.width && x + width > r.x && y < r.y + r.height && y + height > r.y) {
      return false
    }
  }
  return true
}
