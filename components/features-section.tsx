import { Ruler, Square, Box, BarChart3, Zap, Shield } from "lucide-react"

const features = [
  {
    number: "01",
    icon: Ruler,
    title: "1D Linear Cutting",
    description: "Optimize bars, pipes, and linear stock with First Fit Decreasing. Maximum yield, minimum offcuts.",
    color: "text-primary",
    bg: "bg-primary/8",
    ring: "ring-primary/20",
  },
  {
    number: "02",
    icon: Square,
    title: "2D Sheet Optimization",
    description: "Bottom-left fill packing for sheet metal, glass, and board. Handles rotation and edge margins.",
    color: "text-accent",
    bg: "bg-accent/8",
    ring: "ring-accent/20",
  },
  {
    number: "03",
    icon: Box,
    title: "3D Volume Packing",
    description: "Six-orientation 3D bin packing for blocks and lumber. Interactive Three.js visualization.",
    color: "text-violet-400",
    bg: "bg-violet-500/8",
    ring: "ring-violet-500/20",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Live Analytics",
    description: "Per-pattern efficiency scores, waste %, cost savings, and unplaced piece warnings in real time.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/8",
    ring: "ring-cyan-500/20",
  },
  {
    number: "05",
    icon: Zap,
    title: "Instant Results",
    description: "Client-side algorithms — no server round-trips. Results appear in under a second for typical jobs.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/8",
    ring: "ring-emerald-500/20",
  },
  {
    number: "06",
    icon: Shield,
    title: "Privacy First",
    description: "All computation runs in your browser. Your measurements and designs never leave your machine.",
    color: "text-rose-400",
    bg: "bg-rose-500/8",
    ring: "ring-rose-500/20",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-fine opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Capabilities
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Everything you need<br />
            <span className="text-muted-foreground">to cut without waste</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="group relative rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card hover:shadow-lg"
            >
              {/* Number watermark */}
              <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-muted/20 select-none leading-none">
                {feature.number}
              </span>

              {/* Icon */}
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg} ring-1 ${feature.ring}`}>
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>

              <h3 className="font-display text-base font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
