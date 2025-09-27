"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Calculator, Scissors } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">OptiCut</span>
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#solutions" className="text-foreground hover:text-primary transition-colors">
              Solutions
            </Link>
            <Link href="#pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav> */}

          <div className="hidden md:flex items-center space-x-4">
            {/* <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button> */}
            <Button asChild>
              <Link href="/calculator">
                <Calculator className="mr-2 h-4 w-4" />
                Start Optimizing
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {/* <Link
                href="#features"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#solutions"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link> */}
              <div className="flex flex-col space-y-2 px-3 pt-4">
                {/* <Button variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button> */}
                <Button asChild>
                  <Link href="/calculator">
                    <Calculator className="mr-2 h-4 w-4" />
                    Start Optimizing
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
