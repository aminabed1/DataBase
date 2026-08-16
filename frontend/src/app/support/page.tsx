import SupportDashboard from "@/features/support/SupportDashboard";

export const metadata = {
    title: "Support Console | PitchSide",
    description: "Support and ticketing administration console",
};

export default function SupportPage() {
    return (
        <main className="w-full min-h-screen">
            <SupportDashboard />
        </main>
    );
}