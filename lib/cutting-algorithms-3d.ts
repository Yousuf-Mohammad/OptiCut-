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

// 3D bin packing algorithm using Bottom-Left-Back Fill
export function optimize3DCutting(blocks: Block3D[], pieces: Piece3D[], settings: OptimizationSettings3D) {
  // Expand pieces into individual items
  const allPieces: Array<Piece3D & { originalId: string; colorIndex: number }> = []
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

  // Sort pieces by volume (descending) for better packing
  allPieces.sort((a, b) => b.width * b.height * b.depth - a.width * a.height * a.depth)

  const patterns: CuttingPattern3D[] = []
  const remainingPieces = [...allPieces]
  let blocksUsed = 0
  let totalWasteVolume = 0

  // Expand blocks
  const availableBlocks: Array<{ width: number; height: number; depth: number; cost?: number }> = []
  blocks.forEach((block) => {
    for (let i = 0; i < block.quantity; i++) {
      availableBlocks.push({
        width: block.width,
        height: block.height,
        depth: block.depth,
        cost: block.cost,
      })
    }
  })

  // Pack pieces into blocks
  while (remainingPieces.length > 0 && blocksUsed < availableBlocks.length) {
    const currentBlock = availableBlocks[blocksUsed]
    const pattern: CuttingPattern3D = {
      blockWidth: currentBlock.width,
      blockHeight: currentBlock.height,
      blockDepth: currentBlock.depth,
      pieces: [],
      wasteVolume: 0,
      efficiency: 0,
      utilizedVolume: 0,
    }

    // Use a 3D bottom-left-back fill algorithm
    const placedPieces = packPiecesIntoBlock(
      remainingPieces,
      currentBlock.width - 2 * settings.margin,
      currentBlock.height - 2 * settings.margin,
      currentBlock.depth - 2 * settings.margin,
      settings,
    )

    // Add placed pieces to pattern with margin offset
    placedPieces.forEach((piece) => {
      pattern.pieces.push({
        ...piece,
        x: piece.x + settings.margin,
        y: piece.y + settings.margin,
        z: piece.z + settings.margin,
      })

      // Remove from remaining pieces
      const index = remainingPieces.findIndex((p) => p.id === piece.id)
      if (index !== -1) {
        remainingPieces.splice(index, 1)
      }
    })

    // Calculate pattern statistics
    const utilizedVolume = pattern.pieces.reduce((sum, piece) => sum + piece.width * piece.height * piece.depth, 0)
    const totalBlockVolume = currentBlock.width * currentBlock.height * currentBlock.depth
    pattern.utilizedVolume = utilizedVolume
    pattern.wasteVolume = totalBlockVolume - utilizedVolume
    pattern.efficiency = Math.round((utilizedVolume / totalBlockVolume) * 100)

    totalWasteVolume += pattern.wasteVolume
    patterns.push(pattern)
    blocksUsed++
  }

  // Calculate overall statistics
  const totalBlockVolume = blocksUsed * (blocks[0]?.width * blocks[0]?.height * blocks[0]?.depth || 0)
  const totalRequiredVolume = allPieces.reduce((sum, piece) => sum + piece.width * piece.height * piece.depth, 0)
  const efficiency = Math.round((totalRequiredVolume / totalBlockVolume) * 100)
  const wastePercentage = Math.round((totalWasteVolume / totalBlockVolume) * 100)

  // Calculate cost savings
  const averageCost = blocks.reduce((sum, block) => sum + (block.cost || 300), 0) / blocks.length
  const potentialBlocksNeeded = Math.ceil(
    totalRequiredVolume / (blocks[0]?.width * blocks[0]?.height * blocks[0]?.depth || 1),
  )
  const costSavings = Math.round((potentialBlocksNeeded - blocksUsed) * averageCost)

  return {
    patterns,
    efficiency,
    totalWasteVolume,
    blocksUsed,
    costSavings: Math.max(0, costSavings),
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
  settings: OptimizationSettings3D,
): PlacedPiece3D[] {
  const placedPieces: PlacedPiece3D[] = []
  const occupiedBoxes: Array<{ x: number; y: number; z: number; width: number; height: number; depth: number }> = []

  for (const piece of pieces) {
    let placed = false
    const orientations = []

    // Add original orientation
    orientations.push({
      width: piece.width,
      height: piece.height,
      depth: piece.depth,
      rotated: false,
    })

    // Add rotated orientations if allowed
    if (settings.allowRotation && piece.canRotate) {
      // All possible 3D rotations (6 orientations for a cuboid)
      const dims = [piece.width, piece.height, piece.depth]
      const rotations = [
        [dims[0], dims[1], dims[2]], // original
        [dims[0], dims[2], dims[1]], // rotate around X
        [dims[1], dims[0], dims[2]], // rotate around Z
        [dims[1], dims[2], dims[0]], // rotate around Y
        [dims[2], dims[0], dims[1]], // rotate around Y then X
        [dims[2], dims[1], dims[0]], // rotate around X then Y
      ]

      rotations.forEach((rotation, index) => {
        if (index > 0) {
          // Skip original orientation
          orientations.push({
            width: rotation[0],
            height: rotation[1],
            depth: rotation[2],
            rotated: true,
          })
        }
      })
    }

    // Try each orientation
    for (const orientation of orientations) {
      if (placed) break

      const pieceWidth = orientation.width + settings.kerfWidth
      const pieceHeight = orientation.height + settings.kerfWidth
      const pieceDepth = orientation.depth + settings.kerfWidth

      // Try to place at each possible position (bottom-left-back fill)
      for (let z = 0; z <= blockDepth - pieceDepth; z += 20) {
        if (placed) break
        for (let y = 0; y <= blockHeight - pieceHeight; y += 20) {
          if (placed) break
          for (let x = 0; x <= blockWidth - pieceWidth; x += 20) {
            if (canPlacePiece3D(x, y, z, pieceWidth, pieceHeight, pieceDepth, occupiedBoxes)) {
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
                color: pieceColors[piece.colorIndex],
              })

              occupiedBoxes.push({
                x,
                y,
                z,
                width: pieceWidth,
                height: pieceHeight,
                depth: pieceDepth,
              })

              placed = true
              break
            }
          }
        }
      }
    }

    if (!placed) {
      // If we can't place this piece, stop trying to place more pieces in this block
      break
    }
  }

  return placedPieces
}

function canPlacePiece3D(
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  depth: number,
  occupiedBoxes: Array<{ x: number; y: number; z: number; width: number; height: number; depth: number }>,
): boolean {
  for (const box of occupiedBoxes) {
    if (
      x < box.x + box.width &&
      x + width > box.x &&
      y < box.y + box.height &&
      y + height > box.y &&
      z < box.z + box.depth &&
      z + depth > box.z
    ) {
      return false // Overlaps with existing piece
    }
  }
  return true
}
