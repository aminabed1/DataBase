import HeroSection from "@/components/layout/HeroSection";
import StatsSection from "@/components/layout/StatsSection";
import FeaturesSection from "@/components/layout/FeaturesSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
    return (
        <main>
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <Footer /> {/*  */}
        </main>
    );
}