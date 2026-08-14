import MatchesBrowser from "@/features/matches/components/MatchesBrowser";
import Link from "next/link";
import { User, LogIn } from "lucide-react";

export default function MatchesPage() {
    return (
        <main className="sport-theme relative min-h-screen bg-[rgb(211,212,212)] antialiased overflow-x-hidden pb-8">

            {/* بافت نقطه‌ای پس‌زمینه */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(0,0,0,0.25)_1px,transparent_1px)] [background-size:28px_28px]" />

            {/* دکمه پروفایل (بالا سمت چپ) */}
            <div className="absolute left-6 top-6 z-50">
                <Link
                    href="/dashboard"
                    className="flex cursor-none items-center justify-center h-12 w-12 rounded-full border border-black/10 bg-white/50 text-zinc-900 backdrop-blur-md transition-all hover:bg-white hover:shadow-md"
                >
                    <User size={20} />
                </Link>
            </div>

            {/* دکمه ثبت‌نام / ورود (بالا سمت راست) */}
            <div className="absolute right-6 top-6 z-50">
                <Link
                    href="/auth?mode=signup"
                    className="flex cursor-none items-center gap-2 rounded-full border border-black/10 bg-white/50 px-5 py-3 text-sm font-bold text-zinc-900 backdrop-blur-md transition-all hover:bg-white hover:shadow-md"
                >
                    <LogIn size={18} />
                    <span>Sign In</span>
                </Link>
            </div>

            {/* کامپوننت اصلی مرور مسابقات */}
            <MatchesBrowser />

        </main>
    );
}