"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid } from "@react-three/drei"
import { Suspense } from "react"
import * as THREE from "three"

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

interface Viewer3DProps {
  pattern: CuttingPattern3D
}

function Block3D({ piece }: { piece: PlacedPiece3D }) {
  // Convert mm to scene units (divide by 100 for better scale)
  const scaleX = piece.width / 100
  const scaleY = piece.height / 100
  const scaleZ = piece.depth / 100
  const posX = (piece.x + piece.width / 2) / 100
  const posY = (piece.y + piece.height / 2) / 100
  const posZ = (piece.z + piece.depth / 2) / 100

  return (
    <mesh position={[posX, posY, posZ]}>
      <boxGeometry args={[scaleX, scaleY, scaleZ]} />
      <meshStandardMaterial color={piece.color} transparent opacity={0.8} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(scaleX, scaleY, scaleZ)]} />
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </lineSegments>
    </mesh>
  )
}

function BlockOutline({ pattern }: { pattern: CuttingPattern3D }) {
  const scaleX = pattern.blockWidth / 100
  const scaleY = pattern.blockHeight / 100
  const scaleZ = pattern.blockDepth / 100

  return (
    <mesh position={[scaleX / 2, scaleY / 2, scaleZ / 2]}>
      <boxGeometry args={[scaleX, scaleY, scaleZ]} />
      <meshBasicMaterial transparent opacity={0.1} color="#164e63" />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(scaleX, scaleY, scaleZ)]} />
        <lineBasicMaterial color="#164e63" linewidth={3} />
      </lineSegments>
    </mesh>
  )
}

export function Viewer3D({ pattern }: Viewer3DProps) {
  // Calculate camera position based on block size
  const maxDimension = Math.max(pattern.blockWidth, pattern.blockHeight, pattern.blockDepth) / 100
  const cameraDistance = maxDimension * 2

  return (
    <Canvas
      camera={{
        position: [cameraDistance, cameraDistance, cameraDistance],
        fov: 50,
      }}
      style={{ background: "rgb(248, 250, 252)" }}
    >
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Block outline */}
        <BlockOutline pattern={pattern} />

        {/* Placed pieces */}
        {pattern.pieces.map((piece, index) => (
          <Block3D key={index} piece={piece} />
        ))}

        {/* Grid for reference */}
        <Grid
          position={[pattern.blockWidth / 200, 0, pattern.blockDepth / 200]}
          args={[pattern.blockWidth / 100, pattern.blockDepth / 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#e2e8f0"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#cbd5e1"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={maxDimension}
          maxDistance={maxDimension * 4}
        />
      </Suspense>
    </Canvas>
  )
}
