import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/4 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm px-8 py-16 text-center shadow-2xl">
          {/* Glow */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-xs font-medium text-primary uppercase tracking-widest">
              Free to Use
            </div>

            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Ready to optimize<br />
              <span className="text-primary">your first cut?</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              No account needed. Open the calculator, enter your stock dimensions and required pieces, and get a cutting plan in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button size="lg" asChild className="group gap-2 px-8">
                <Link href="/calculator">
                  Open Calculator
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
