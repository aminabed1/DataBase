import HeroSection from "@/components/layout/HeroSection";

export default function Home() {
    return (
        <main className="bg-[#0a0a0a]">
            <HeroSection />

            {/* Temporary scrollable section to test animations */}
            <section className="flex min-h-[150vh] flex-col items-center justify-start pt-32 bg-[#0a0a0a] text-white/30 px-4">
                <div className="w-full max-w-4xl rounded-2xl border border-white/10 border-dashed p-16 text-center text-sm font-medium tracking-widest uppercase">
                    Scroll down to explore matches
                </div>
            </section>
        </main>
    );
}