import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ruler, Square, Box, BarChart3, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: Ruler,
    title: "1D Linear Cutting",
    description:
      "Optimize cuts for bars, pipes, and linear materials with advanced algorithms that minimize waste and maximize efficiency.",
  },
  {
    icon: Square,
    title: "2D Sheet Optimization",
    description:
      "Perfect for sheet metal, glass, and fabric cutting with intelligent nesting algorithms for complex shapes.",
  },
  {
    icon: Box,
    title: "3D Volume Packing",
    description: "Advanced 3D optimization for blocks, lumber, and volumetric materials with real-time visualization.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Comprehensive reporting and analytics to track waste reduction, cost savings, and efficiency improvements.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Process thousands of cutting patterns in seconds with our optimized algorithms and cloud computing power.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with encrypted data transmission and secure cloud storage for your sensitive designs.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30 max-w-7xl mx-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">Powerful Features for Every Industry</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From small workshops to large manufacturing facilities, our cutting-edge optimization technology adapts to
            your specific needs and materials.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
