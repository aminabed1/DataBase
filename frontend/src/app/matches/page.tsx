"use client";

import MatchesBrowser from "@/features/matches/components/MatchesBrowser";
import Link from "next/link";
import { Home } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionLink = motion.create(Link);
const ease = [0.22, 1, 0.36, 1] as const;

export default function MatchesPage() {
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [signup, setSignup] = useState(false);
    const [hoverProfile, setHoverProfile] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    return (
        <main className="sport-theme relative min-h-screen bg-[rgb(211,212,212)] antialiased overflow-x-hidden pb-8">

            {/* بافت نقطه‌ای پس‌زمینه */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(0,0,0,0.25)_1px,transparent_1px)] [background-size:28px_28px]" />

            {/* بخش بالا سمت چپ: دکمه پروفایل (بالا) و دکمه Home (پایین) */}
            <div className="absolute left-4 sm:left-6 top-4 sm:top-6 z-50 flex flex-col items-start gap-2 sm:gap-2.5">
                {mounted && (
                    <MotionLink
                        href={isLoggedIn ? "/dashboard" : "#"}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            if (!isLoggedIn) e.preventDefault();
                        }}
                        onMouseEnter={() => setHoverProfile(true)}
                        onMouseLeave={() => setHoverProfile(false)}
                        layout
                        className={`relative z-10 flex cursor-none items-center gap-2 rounded-full border border-black/10 bg-white/40 px-2 py-1.5 backdrop-blur-md transition-colors shadow-sm ${
                            isLoggedIn
                                ? "cursor-pointer hover:bg-white/70"
                                : "cursor-not-allowed hover:bg-white/50 opacity-90"
                        }`}
                    >
                        <motion.div
                            layout
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
                                isLoggedIn
                                    ? "bg-gradient-to-br from-zinc-800 to-zinc-950 text-white"
                                    : "bg-zinc-300 text-zinc-600"
                            }`}
                        >
                            M
                        </motion.div>
                        <motion.div layout className="hidden sm:block overflow-hidden">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={!isLoggedIn && hoverProfile ? "msg" : "profile"}
                                    initial={{ y: 18, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -18, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`block pr-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                                        isLoggedIn ? "text-zinc-900 hover:text-black" : "text-zinc-500"
                                    }`}
                                >
                                    {!isLoggedIn && hoverProfile ? "please sign up/login first" : "Profile"}
                                </motion.span>
                            </AnimatePresence>
                        </motion.div>
                    </MotionLink>
                )}

                <Link
                    href="/"
                    className="flex cursor-none items-center gap-2 rounded-full border border-black/10 bg-white/40 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-zinc-900 backdrop-blur-md transition-all hover:bg-white/70 shadow-sm"
                >
                    <Home size={18} />
                    <span>Home</span>
                </Link>
            </div>

            {/* بخش بالا سمت راست: دکمه Dive in (تبدیل شونده به Sign up / Login) */}
            {mounted && !isLoggedIn && (
                <div className="absolute right-4 sm:right-6 top-4 sm:top-6 z-50">
                    <motion.div
                        className="relative z-10 flex items-center"
                        onMouseEnter={() => setSignup(true)}
                        onMouseLeave={() => setSignup(false)}
                    >
                        <MotionLink
                            href="/auth?mode=login"
                            initial={false}
                            animate={{
                                x: signup ? "-92%" : "0%",
                                clipPath: signup
                                    ? "inset(0px 0px 0px 0px round 9999px)"
                                    : "inset(0px 0px 0px 100% round 9999px)",
                            }}
                            transition={{ duration: 0.4, ease }}
                            className="absolute right-0 z-0 block cursor-none whitespace-nowrap rounded-l-full border border-black/10 bg-white/50 py-2.5 pl-5 pr-9 text-sm font-semibold text-zinc-900 backdrop-blur-md transition-colors hover:bg-white/80 shadow-sm"
                        >
                            Login
                        </MotionLink>

                        <Link
                            href="/auth?mode=signup"
                            className="relative z-10 flex h-[42px] w-[118px] cursor-none items-center justify-center overflow-hidden rounded-full bg-zinc-950 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-zinc-800"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={signup ? "signup" : "dive"}
                                    initial={{ y: 18, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -18, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {signup ? "Sign up" : "Dive in"}
                                </motion.span>
                            </AnimatePresence>
                        </Link>
                    </motion.div>
                </div>
            )}

            {/* کامپوننت اصلی مرور مسابقات */}
            <MatchesBrowser />

        </main>
    );
}