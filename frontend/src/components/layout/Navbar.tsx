"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const MotionLink = motion.create(Link);
const ease = [0.22, 1, 0.36, 1] as const;

const container = {
    hidden: {},
    visible: { transition: { delayChildren: 0.15 } },
};

const itemVariants = {
    hidden: { y: -80, opacity: 0 },
    visible: (delay: number) => ({
        y: 0,
        opacity: 1,
        transition: { delay, duration: 0.6, ease },
    }),
};

function NavItem({
                     href,
                     label,
                     hovered,
                     setHovered,
                 }: {
    href: string;
    label: string;
    hovered: string | null;
    setHovered: (v: string | null) => void;
}) {
    const active = hovered === label;
    return (
        <Link
            href={href}
            onMouseEnter={() => setHovered(label)}
            onFocus={() => setHovered(label)}
            className="relative rounded-full px-4 py-1.5 text-sm outline-none"
        >
            <AnimatePresence>
                {active && (
                    <motion.span
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-white/15 bg-white/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            layout: { type: "spring", stiffness: 420, damping: 34 },
                            opacity: { duration: 0.18 },
                        }}
                    />
                )}
            </AnimatePresence>

            <motion.span
                animate={{ y: active ? -1 : 0 }}
                transition={{ duration: 0.25, ease }}
                className={`relative block transition-colors duration-200 ${
                    active ? "text-white" : "text-white/60"
                }`}
            >
                {label}
            </motion.span>
        </Link>
    );
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [signup, setSignup] = useState(false);
    const [hoverProfile, setHoverProfile] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        setIsLoggedIn(!!localStorage.getItem("token"));
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/auth") || pathname?.startsWith("/matches")) {
        return null;
    }

    const groupPill = `rounded-full border transition-[background-color,border-color] duration-500 ${
        scrolled
            ? "border-transparent bg-transparent"
            : "border-white/10 bg-white/5 backdrop-blur-md"
    }`;

    return (
        <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:px-8 pointer-events-none">
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="relative flex w-full items-center justify-between p-1.5 transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto"
                style={{ maxWidth: scrolled ? 780 : 1440 }}
            >
                {/* Background pill */}
                <div
                    className={`pointer-events-none absolute inset-0 rounded-full border transition-[opacity,background-color,border-color,box-shadow] duration-500 ${
                        scrolled
                            ? "border-white/15 bg-black/40 opacity-100 shadow-lg shadow-black/20 backdrop-blur-xl"
                            : "opacity-0"
                    }`}
                />

                {/* LEFT */}
                <div className="flex items-center min-w-[120px]">
                    {mounted && (
                        <MotionLink
                            href={isLoggedIn ? "/dashboard" : "#"}
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                if (!isLoggedIn) e.preventDefault();
                            }}
                            onMouseEnter={() => setHoverProfile(true)}
                            onMouseLeave={() => setHoverProfile(false)}
                            variants={itemVariants}
                            custom={0.9}
                            layout
                            className={`${groupPill} relative z-10 flex items-center gap-2 px-2 py-1.5 transition-colors ${isLoggedIn ? "cursor-pointer hover:bg-white/10" : "cursor-not-allowed"}`}
                        >
                            <motion.div layout className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/30 to-white/10 text-xs font-bold ${isLoggedIn ? "text-white" : "text-white/50"}`}>
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
                                        className={`block pr-3 text-sm transition-colors whitespace-nowrap ${isLoggedIn ? "text-white/80 hover:text-white" : "text-white/40"}`}
                                    >
                                        {!isLoggedIn && hoverProfile ? "please sign up/login first" : "Profile"}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.div>
                        </MotionLink>
                    )}
                </div>

                {/* CENTER */}
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        variants={itemVariants}
                        custom={0.5}
                        onMouseLeave={() => setHovered(null)}
                        className={`${groupPill} flex items-center justify-center gap-1 px-3 py-1.5`}
                    >
                        <NavItem href="/matches" label="Matches" hovered={hovered} setHovered={setHovered} />

                        <Link href="/" className="group relative px-4 text-lg font-black tracking-tight text-white">
                            <span className="relative z-10">PitchSide</span>
                            <span className="pointer-events-none absolute -inset-2 -z-0 rounded-full bg-white/10 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
                        </Link>

                        <NavItem href="/#support" label="Support" hovered={hovered} setHovered={setHovered} />
                    </motion.div>
                </div>


                {/* RIGHT */}
                <div className="flex items-center justify-end min-w-[120px]">
                    {mounted && !isLoggedIn && (
                        <motion.div
                            variants={itemVariants}
                            custom={0.9}
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
                                className="absolute right-0 z-0 block whitespace-nowrap rounded-l-full border border-white/15 bg-white/10 py-2.5 pl-5 pr-9 text-sm font-medium text-white backdrop-blur-md"
                            >
                                Login
                            </MotionLink>

                            <Link
                                href="/auth?mode=signup"
                                className="relative z-10 flex h-[42px] w-[118px] items-center justify-center overflow-hidden rounded-full bg-white text-sm font-bold text-black transition-transform active:scale-95"
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
                    )}
                </div>
            </motion.div>
        </header>
    );
}