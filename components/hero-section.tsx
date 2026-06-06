import { Button } from "@/components/ui/button"
import { ArrowRight, Ruler, Square, Box } from "lucide-react"
import Link from "next/link"

const stats = [
  { value: "40%", label: "Waste Reduction" },
  { value: "94%", label: "Avg Efficiency" },
  { value: "3D", label: "Dimensions" },
]

const dimensionCards = [
  {
    label: "1D Linear",
    icon: Ruler,
    color: "text-primary",
    bg: "bg-primary/10",
    ring: "ring-primary/25",
    bar: "bg-primary",
    bars: [85, 65, 90, 45, 78],
  },
  {
    label: "2D Sheet",
    icon: Square,
    color: "text-accent",
    bg: "bg-accent/10",
    ring: "ring-accent/25",
    bar: "bg-accent",
    bars: [70, 90, 55, 88, 60],
  },
  {
    label: "3D Volume",
    icon: Box,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    ring: "ring-violet-500/25",
    bar: "bg-violet-400",
    bars: [60, 75, 85, 50, 95],
  },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Radial glow */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3.5 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Precision Cutting Optimizer
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-5xl lg:text-[4rem] font-extrabold leading-[1.05] tracking-tight text-foreground">
                Cut Smarter.<br />
                <span className="text-primary">Waste Less.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Professional-grade 1D, 2D, and 3D cutting optimization. Run the algorithm, see the layout, cut with confidence.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button size="lg" asChild className="group gap-2 px-6">
                <Link href="/calculator">
                  Open Calculator
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-muted-foreground">Optimization Preview</span>
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-accent/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-primary/70" />
                </div>
              </div>

              {/* Dimension cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {dimensionCards.map((card) => (
                  <div
                    key={card.label}
                    className={`rounded-xl ${card.bg} ring-1 ${card.ring} p-3.5 space-y-3`}
                  >
                    <div className="flex items-center gap-2">
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                      <span className={`text-xs font-medium ${card.color}`}>{card.label}</span>
                    </div>
                    <div className="space-y-1.5">
                      {card.bars.map((width, i) => (
                        <div key={i} className="h-1.5 rounded-full bg-border/50 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${card.bar} opacity-80`}
                            style={{ width: `${width}%`, transition: `width 0.6s ease ${i * 0.1}s` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Efficiency row */}
              <div className="space-y-3 rounded-xl border border-border/50 bg-muted/30 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Material Utilization</span>
                  <span className="font-display text-lg font-bold text-primary">94.2%</span>
                </div>
                <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                  <div className="h-full w-[94.2%] rounded-full bg-primary" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Waste Removed</span>
                  <span className="font-display text-lg font-bold text-accent">38.7%</span>
                </div>
                <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                  <div className="h-full w-[38.7%] rounded-full bg-accent" />
                </div>
              </div>
            </div>

            {/* Floating accent */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
