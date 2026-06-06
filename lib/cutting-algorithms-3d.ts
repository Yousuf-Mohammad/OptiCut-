import { Block, Piece3D, CalculatorSettings3D } from "@/features/calculators/common/types"
import { PIECE_COLORS } from "@/lib/constants"

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

interface OccupiedBox {
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
}

export function optimize3DCutting(blocks: Block[], pieces: Piece3D[], settings: CalculatorSettings3D) {
  // Expand by quantity, assign stable color per piece type, sort largest-volume first
  const expandedPieces = pieces.flatMap((piece, typeIndex) =>
    Array.from({ length: piece.quantity }, (_, i) => ({
      ...piece,
      id: `${piece.id}-${i}`,
      originalId: piece.id,
      quantity: 1,
      colorIndex: typeIndex % PIECE_COLORS.length,
    }))
  )
  expandedPieces.sort((a, b) => b.width * b.height * b.depth - a.width * a.height * a.depth)

  const availableBlocks = blocks.flatMap((block) =>
    Array.from({ length: block.quantity }, () => ({
      width: block.width,
      height: block.height,
      depth: block.depth,
      cost: block.cost,
    }))
  )

  const patterns: CuttingPattern3D[] = []
  const remainingPieces = [...expandedPieces]
  let totalWasteVolume = 0

  while (remainingPieces.length > 0 && patterns.length < availableBlocks.length) {
    const currentBlock = availableBlocks[patterns.length]
    const innerWidth = currentBlock.width - 2 * settings.margin
    const innerHeight = currentBlock.height - 2 * settings.margin
    const innerDepth = currentBlock.depth - 2 * settings.margin

    const placedPieces = packPiecesIntoBlock(remainingPieces, innerWidth, innerHeight, innerDepth, settings)

    // No pieces fit at all — remaining pieces exceed this block size; stop
    if (placedPieces.length === 0) break

    const pattern: CuttingPattern3D = {
      blockWidth: currentBlock.width,
      blockHeight: currentBlock.height,
      blockDepth: currentBlock.depth,
      pieces: [],
      wasteVolume: 0,
      efficiency: 0,
      utilizedVolume: 0,
    }

    const placedIds = new Set(placedPieces.map((p) => p.id))
    placedPieces.forEach((piece) => {
      pattern.pieces.push({
        ...piece,
        x: piece.x + settings.margin,
        y: piece.y + settings.margin,
        z: piece.z + settings.margin,
      })
    })

    // Remove placed pieces from remaining
    for (let i = remainingPieces.length - 1; i >= 0; i--) {
      if (placedIds.has(remainingPieces[i].id)) {
        remainingPieces.splice(i, 1)
      }
    }

    const utilizedVolume = pattern.pieces.reduce((sum, p) => sum + p.width * p.height * p.depth, 0)
    const totalBlockVolume = currentBlock.width * currentBlock.height * currentBlock.depth
    pattern.utilizedVolume = utilizedVolume
    pattern.wasteVolume = totalBlockVolume - utilizedVolume
    pattern.efficiency = Math.round((utilizedVolume / totalBlockVolume) * 100)

    totalWasteVolume += pattern.wasteVolume
    patterns.push(pattern)
  }

  const totalBlockVolume = patterns.reduce(
    (sum, _, i) => sum + availableBlocks[i].width * availableBlocks[i].height * availableBlocks[i].depth,
    0,
  )
  const totalRequiredVolume = expandedPieces.reduce((sum, p) => sum + p.width * p.height * p.depth, 0)
  const efficiency = totalBlockVolume > 0 ? Math.round((totalRequiredVolume / totalBlockVolume) * 100) : 0
  const wastePercentage = totalBlockVolume > 0 ? Math.round((totalWasteVolume / totalBlockVolume) * 100) : 0

  const averageCost = blocks.reduce((sum, b) => sum + (b.cost || 300), 0) / blocks.length
  const potentialBlocksNeeded = Math.ceil(
    totalRequiredVolume / (blocks[0]?.width * blocks[0]?.height * blocks[0]?.depth || 1),
  )
  const costSavings = Math.max(0, Math.round((potentialBlocksNeeded - patterns.length) * averageCost))

  return {
    patterns,
    efficiency,
    totalWasteVolume,
    blocksUsed: patterns.length,
    unplacedPieces: remainingPieces.length,
    costSavings,
    summary: {
      totalBlockVolume,
      totalRequiredVolume,
      wastePercentage,
    },
  }
}

function packPiecesIntoBlock(
  pieces: Array<Piece3D & { originalId: string; colorIndex: number }>,
  blockWidth: number,
  blockHeight: number,
  blockDepth: number,
  settings: CalculatorSettings3D,
): PlacedPiece3D[] {
  const placedPieces: PlacedPiece3D[] = []
  const occupiedBoxes: OccupiedBox[] = []

  for (const piece of pieces) {
    const orientations: Array<{ width: number; height: number; depth: number; rotated: boolean }> = [
      { width: piece.width, height: piece.height, depth: piece.depth, rotated: false },
    ]

    if (settings.allowRotation && piece.canRotate) {
      const [w, h, d] = [piece.width, piece.height, piece.depth]
      // All 6 unique axis-aligned orientations for a cuboid
      const rotations = [
        [w, d, h],
        [h, w, d],
        [h, d, w],
        [d, w, h],
        [d, h, w],
      ]
      rotations.forEach(([rw, rh, rd]) => {
        orientations.push({ width: rw, height: rh, depth: rd, rotated: true })
      })
    }

    let placed = false
    for (const orientation of orientations) {
      if (placed) break

      const pw = orientation.width + settings.kerfWidth
      const ph = orientation.height + settings.kerfWidth
      const pd = orientation.depth + settings.kerfWidth

      for (let z = 0; z <= blockDepth - pd && !placed; z += 20) {
        for (let y = 0; y <= blockHeight - ph && !placed; y += 20) {
          for (let x = 0; x <= blockWidth - pw && !placed; x += 20) {
            if (canPlace3D(x, y, z, pw, ph, pd, occupiedBoxes)) {
              placedPieces.push({
                id: piece.id,
                label: piece.label || `Block ${piece.originalId}`,
                x,
                y,
                z,
                width: orientation.width,
                height: orientation.height,
                depth: orientation.depth,
                rotated: orientation.rotated,
                color: PIECE_COLORS[piece.colorIndex],
              })
              occupiedBoxes.push({ x, y, z, width: pw, height: ph, depth: pd })
              placed = true
            }
          }
        }
      }
    }
    // If this piece didn't fit, continue to try the next piece (don't break)
  }

  return placedPieces
}

function canPlace3D(
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  depth: number,
  occupied: OccupiedBox[],
): boolean {
  for (const box of occupied) {
    if (
      x < box.x + box.width &&
      x + width > box.x &&
      y < box.y + box.height &&
      y + height > box.y &&
      z < box.z + box.depth &&
      z + depth > box.z
    ) {
      return false
    }
  }
  return true
}
