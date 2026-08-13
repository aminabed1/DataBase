import AuthPanel from "@/features/auth/components/AuthPanel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthPage() {
    return (
        // با h-screen و overflow-hidden اسکرول کل صفحه کاملاً قفل می‌شود
        <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[rgb(211,212,212)] antialiased">

            {/* بافت نقطه‌ای پس‌زمینه */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(0,0,0,0.25)_1px,transparent_1px)] [background-size:28px_28px]" />

            {/* دکمه بازگشت */}
            <div className="absolute left-6 top-6 z-50 sm:left-10 sm:top-8">
                <Link
                    href="/"
                    className="flex cursor-none items-center gap-2 rounded-full border border-black/10 bg-white/40 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur-md transition-colors hover:bg-white/70"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </div>

            {/* لوگو */}
            <div className="absolute right-6 top-6 z-50 sm:right-10 sm:top-8">
                <h1 className="cursor-none select-none text-2xl font-black tracking-tight text-zinc-950">
                    Pitch<span className="text-zinc-500">Side</span>
                </h1>
            </div>

            {/*
              کانتینر اصلی:
              بزرگتر از قبل (max-w-6xl) اما به لبه‌ها نمی‌چسبد.
              ارتفاع (h-[90vh] و max-h-[850px]) به اندازه کافی فضا می‌دهد.
            */}
            <div className="relative z-10 w-full h-[90vh] max-h-[850px] max-w-6xl px-4 md:px-8">
                <AuthPanel />
            </div>

        </main>
    );
}