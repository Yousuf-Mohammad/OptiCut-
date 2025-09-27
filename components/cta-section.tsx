import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground">
              Ready to Optimize Your Production?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Start reducing waste and increasing efficiency today. No credit card required for your free trial.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href="/calculator">
                <Calculator className="mr-2 h-5 w-5" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 pt-8 text-primary-foreground/60">
            <span className="text-sm">✓ 14-day free trial</span>
            <span className="text-sm">✓ No setup fees</span>
            <span className="text-sm">✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
