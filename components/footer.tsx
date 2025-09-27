import Link from "next/link"
import { Scissors } from "lucide-react"

export function Footer() {
  return (
    <footer className=" border-t border-border max-w-7xl mx-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2  grid-cols-1 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">OptiCut</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced cutting stock optimization for modern manufacturing. Reduce waste, increase efficiency.
            </p>
          </div>

         <div className="grid md:grid-cols-4 gap-8">
         <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <div className="space-y-2">
              <Link
                href="/features"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/calculator"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Calculator
              </Link>
              <Link href="/api" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                API
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/careers"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Careers
              </Link>
              <Link href="/blog" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link href="/docs" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </Link>
              <Link
                href="/privacy"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
         </div>
        </div>

        <div className="border-t border-border py-4 mt-4 text-center">
          <p className="text-xs text-muted-foreground">© 2024 OptiCut. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
