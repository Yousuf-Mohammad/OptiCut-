import { Calculator1D } from "@/features/calculators/one-d/Calculator1D"
import { Calculator2D } from "@/features/calculators/two-d/Calculator2D"
import { Calculator3D } from "@/features/calculators/three-d/Calculator3D"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ruler, Square, Box } from "lucide-react"
import { Header } from "@/features/layout/Header"

const tabs = [
  {
    value: "1d",
    label: "1D Linear",
    icon: Ruler,
    description: "Bars, pipes, profiles",
    accent: "data-[state=active]:text-primary data-[state=active]:border-primary/60",
  },
  {
    value: "2d",
    label: "2D Sheets",
    icon: Square,
    description: "Panels, glass, board",
    accent: "data-[state=active]:text-accent data-[state=active]:border-accent/60",
  },
  {
    value: "3d",
    label: "3D Volumes",
    icon: Box,
    description: "Blocks, lumber, foam",
    accent: "data-[state=active]:text-violet-400 data-[state=active]:border-violet-400/60",
  },
]

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-bold text-foreground">Cutting Calculator</h1>
            <p className="text-muted-foreground">
              Enter your stock dimensions and required pieces — the optimizer handles the rest.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="1d" className="w-full">
          {/* Custom tab list */}
          <TabsList className="h-auto w-full grid grid-cols-3 gap-2 rounded-xl border border-border/50 bg-card/60 p-1.5 mb-8">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`group flex flex-col sm:flex-row items-center gap-2 rounded-lg border border-transparent px-3 py-3 text-left transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground ${tab.accent}`}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold leading-none">{tab.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-normal">{tab.description}</div>
                </div>
                <span className="sm:hidden text-xs font-semibold">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="1d" className="mt-0">
            <Calculator1D />
          </TabsContent>
          <TabsContent value="2d" className="mt-0">
            <Calculator2D />
          </TabsContent>
          <TabsContent value="3d" className="mt-0">
            <Calculator3D />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
