// src/app/matches/page.tsx
import MatchesBrowser from "@/features/matches/components/MatchesBrowser";
import Navbar from "@/components/layout/Navbar"; // آدرس نوبار خودت رو چک کن

export default function MatchesPage() {
    return (
        <main className="sport-theme min-h-screen bg-gray-50 antialiased pt-24">
            {/* اضافه کردن نوبار برای اینکه کاربر بتونه برگرده به هوم */}
            <Navbar />

            <MatchesBrowser />
        </main>
    );
}