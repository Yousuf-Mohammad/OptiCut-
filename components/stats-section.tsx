import { TrendingUp, Users, Factory, DollarSign } from "lucide-react"

const stats = [
  {
    icon: TrendingUp,
    value: "40%",
    label: "Average Waste Reduction",
    description: "Across all material types",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Active Users",
    description: "Worldwide manufacturers",
  },
  {
    icon: Factory,
    value: "500+",
    label: "Companies",
    description: "Trust our platform",
  },
  {
    icon: DollarSign,
    value: "$2M+",
    label: "Cost Savings",
    description: "Generated for clients",
  },
]

export function StatsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">Proven Results Across Industries</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of manufacturers who have transformed their operations with our optimization technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold text-primary">{stat.value}</div>
                <div className="text-lg font-semibold text-foreground">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
