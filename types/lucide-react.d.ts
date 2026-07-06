declare module "lucide-react" {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react"

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    absoluteStrokeWidth?: boolean
  }

  export type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>

  export const AlertTriangle: LucideIcon
  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const BarChart3: LucideIcon
  export const Box: LucideIcon
  export const Calculator: LucideIcon
  export const CheckIcon: LucideIcon
  export const ChevronDownIcon: LucideIcon
  export const ChevronLeftIcon: LucideIcon
  export const ChevronRight: LucideIcon
  export const ChevronRightIcon: LucideIcon
  export const ChevronUpIcon: LucideIcon
  export const CircleIcon: LucideIcon
  export const DollarSign: LucideIcon
  export const Factory: LucideIcon
  export const GripVerticalIcon: LucideIcon
  export const Loader: LucideIcon
  export const Menu: LucideIcon
  export const MinusIcon: LucideIcon
  export const MoreHorizontal: LucideIcon
  export const MoreHorizontalIcon: LucideIcon
  export const PanelLeftIcon: LucideIcon
  export const Plus: LucideIcon
  export const Rotate3D: LucideIcon
  export const RotateCcw: LucideIcon
  export const RotateCw: LucideIcon
  export const Ruler: LucideIcon
  export const SearchIcon: LucideIcon
  export const Scissors: LucideIcon
  export const Shield: LucideIcon
  export const Square: LucideIcon
  export const Trash2: LucideIcon
  export const TrendingUp: LucideIcon
  export const Users: LucideIcon
  export const X: LucideIcon
  export const XIcon: LucideIcon
  export const Zap: LucideIcon
}