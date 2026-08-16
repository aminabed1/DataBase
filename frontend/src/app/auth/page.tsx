// app/auth/page.tsx
import AuthPanel from "@/features/auth/components/AuthPanel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";

export default function AuthPage() {
    return (
        <main className="sport-theme relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[rgb(211,212,212)] antialiased">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full blur-3xl will-change-transform [animation:blob-float_22s_ease-in-out_infinite] bg-[var(--theme-blob-a)]" />
                <div className="absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full blur-3xl will-change-transform [animation:blob-float-alt_26s_ease-in-out_infinite] bg-[var(--theme-blob-b)]" />
                <div className="absolute left-1/2 top-1/3 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-white/40 blur-3xl will-change-transform [animation:blob-float_30s_ease-in-out_infinite_-8s]" />
            </div>

            <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(0,0,0,0.25)_1px,transparent_1px)] [background-size:28px_28px]" />

            <div className="absolute left-6 top-6 z-50 sm:left-10 sm:top-8">
                <Link
                    href="/"
                    className="flex cursor-none items-center gap-2 rounded-full border border-black/10 bg-white/40 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur-md transition-colors hover:bg-white/70"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </div>

            <div className="absolute right-6 top-6 z-50 sm:right-10 sm:top-8">
                <h1 className="cursor-none select-none text-2xl font-black tracking-tight text-zinc-950">
                    Pitch<span className="text-[var(--theme-accent)]">Side</span>
                </h1>
            </div>

            <div className="relative z-10 h-[90vh] max-h-[850px] w-full max-w-6xl px-4 md:px-8">
                <Suspense fallback={<div className="flex h-full items-center justify-center font-bold text-gray-500">Loading auth...</div>}>
                    <AuthPanel />
                </Suspense>
            </div>
        </main>
    );
}