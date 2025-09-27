import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingDown, Zap, Target } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden max-w-7xl mx-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-2">
            <div className="space-y-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="mr-2 h-4 w-4" />
                Advanced Optimization Engine
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Minimize Waste, <span className="text-primary">Maximize</span> Efficiency
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Revolutionary cutting stock optimization for 1D, 2D, and 3D materials. Reduce waste by up to 40% and
                boost your production efficiency with our AI-powered optimization algorithms.
              </p>
            </div>


            <div className="flex items-center space-x-8 ">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">Up to 40% waste reduction</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">99.9% accuracy</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 ">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/calculator">
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {/* <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 bg-transparent">
                <Link href="#demo">Watch Demo</Link>
              </Button> */}
            </div>

            
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-primary h-16 rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">1D</span>
                </div>
                <div className="bg-accent h-16 rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-bold">2D</span>
                </div>
                <div className="bg-secondary h-16 rounded-lg flex items-center justify-center">
                  <span className="text-secondary-foreground font-bold">3D</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Material Utilization</span>
                  <span className="text-lg font-bold text-primary">94.2%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "94.2%" }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Waste Reduction</span>
                  <span className="text-lg font-bold text-accent">38.7%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "38.7%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
