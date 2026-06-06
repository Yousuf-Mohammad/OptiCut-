import { Header } from "@/features/layout/Header"
import { HeroSection } from "@/features/marketing/HeroSection"
import { FeaturesSection } from "@/features/marketing/FeaturesSection"
import { StatsSection } from "@/features/marketing/StatsSection"
import { CTASection } from "@/features/marketing/CTASection"
import { Footer } from "@/features/layout/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background ">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        {/* <StatsSection /> */}
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
