export interface StockBar {
  id: string
  length: number
  quantity: number
  cost?: number
}

export interface Piece1D {
  id: string
  length: number
  quantity: number
  label?: string
}

export interface Sheet {
  id: string
  width: number
  height: number
  quantity: number
  cost?: number
}

export interface Piece2D {
  id: string
  width: number
  height: number
  quantity: number
  label?: string
  canRotate: boolean
}

export interface Block {
  id: string
  width: number
  height: number
  depth: number
  quantity: number
  cost?: number
}

export interface Piece3D {
  id: string
  width: number
  height: number
  depth: number
  quantity: number
  label?: string
  canRotate: boolean
}

export interface CalculatorSettings1D {
  kerfWidth: number
  minWasteLength: number
}

export interface CalculatorSettings2D {
  kerfWidth: number
  minWasteArea: number
  allowRotation: boolean
  margin: number
}

export interface CalculatorSettings3D {
  kerfWidth: number
  minWasteVolume: number
  allowRotation: boolean
  margin: number
}

export interface CalculatorSummary {
  efficiency: number
  wastePercentage: number
}

