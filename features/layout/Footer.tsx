import Link from "next/link"
import { Scissors } from "lucide-react"

const links = {
  Product: [
    { label: "Calculator", href: "/calculator" },
    { label: "Features", href: "/#features" },
  ],
  Support: [
    { label: "Documentation", href: "/docs" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                <Scissors className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-display font-bold text-foreground">
                Opti<span className="text-primary">Cut</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Precision cutting stock optimization for 1D, 2D & 3D materials. Free, fast, and private.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{section}</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} OptiCut. All rights reserved.</p>
          {/* <p className="text-xs text-muted-foreground">All computation runs locally in your browser.</p> */}
          <p className="text-xs text-muted-foreground">
            Made by{" "}
            <Link
              href="https://yousufmohammad.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Yousuf Mohammad
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
