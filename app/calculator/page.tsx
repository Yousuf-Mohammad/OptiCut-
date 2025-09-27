import { Calculator1D } from "@/components/calculator-1d"
import { Calculator2D } from "@/components/calculator-2d"
import { Calculator3D } from "@/components/calculator-3d"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ruler, Square, Box } from "lucide-react"
import { Header } from "@/components/header"

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Cutting Stock Calculator</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Optimize your material cutting across 1D, 2D, and 3D dimensions. Minimize waste and maximize efficiency
              with our advanced algorithms.
            </p>
          </div>

          <Tabs defaultValue="1d" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="1d" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                1D Linear
              </TabsTrigger>
              <TabsTrigger value="2d" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                2D Sheets
              </TabsTrigger>
              <TabsTrigger value="3d" className="flex items-center gap-2">
                <Box className="h-4 w-4" />
                3D Volumes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="1d">
              <Calculator1D />
            </TabsContent>

            <TabsContent value="2d">
              <Calculator2D />
            </TabsContent>

            <TabsContent value="3d">
              <Calculator3D />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
