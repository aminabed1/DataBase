// components/FeaturesSection.tsx
"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
    Search,
    Clock,
    Crown,
    RefreshCw,
    ShieldCheck,
    Headphones,
    type LucideIcon
} from "lucide-react";

/* ---------------- Constants ---------------- */

const TAGS = ["Football", "Volleyball", "Basketball"] as const;
const VIP_FEATURES = ["Lounge", "Parking", "Catering"] as const;

const TIMER_TOTAL = 600;
const R = 52;
const C = 2 * Math.PI * R;

const CONIC =
    "conic-gradient(from 0deg," +
    " transparent 0%," +
    " rgb(96, 165, 250) 10%," +
    " rgb(125, 211, 252) 22%," +
    " transparent 34%," +
    " rgb(249, 115, 22) 48%," +
    " rgb(251, 146, 60) 60%," +
    " transparent 72%," +
    " rgb(74, 222, 128) 84%," +
    " rgb(96, 165, 250) 96%," +
    " transparent 100%)";

/* ---------------- Animation presets ---------------- */

const container: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.09, delayChildren: 0.1 },
    },
};

const cardIn: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

/* ---------------- Shared card shell ---------------- */

const BentoCard = memo(function BentoCard({
                                              children,
                                              className = "",
                                          }: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={cardIn}
            className={`group relative rounded-3xl transition-transform duration-300 hover:scale-[1.03] transform-gpu will-change-transform ${className}`}
        >
            {/* outer glow — desktop only */}
            <div className="pointer-events-none absolute -inset-3 -z-10 hidden overflow-hidden rounded-[2rem] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 md:block transform-gpu">
                <div
                    className="absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 animate-[spin_12s_linear_infinite] [animation-play-state:paused] group-hover:will-change-transform group-hover:[animation-play-state:running]"
                    style={{ background: CONIC }}
                />
            </div>

            {/* crisp rotating border — desktop only */}
            <div
                className="pointer-events-none absolute -inset-[1.5px] hidden overflow-hidden rounded-[calc(1.5rem+1.5px)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block transform-gpu"
                style={{
                    padding: "1.5px",
                    WebkitMask:
                        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    maskComposite: "exclude",
                }}
            >
                <div
                    className="absolute left-1/2 top-1/2 h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite] [animation-play-state:paused] group-hover:will-change-transform group-hover:[animation-play-state:running]"
                    style={{ background: CONIC }}
                />
            </div>

            {/* card surface */}
            <div
                className="relative flex h-full flex-col overflow-hidden rounded-3xl
        border border-black/[0.08] bg-white/55 p-6 backdrop-blur-sm
        shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_30px_-12px_rgba(0,0,0,0.15)]
        transition-shadow duration-500
        group-hover:shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_24px_50px_-18px_rgba(0,0,0,0.28)]"
            >
                {/* ۳. اضافه کردن transform-gpu برای بک‌گراند نوری */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 transform-gpu"
                    style={{
                        background:
                            "radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.5), transparent 40%)",
                    }}
                />

                <div className="relative z-10 flex h-full flex-col">{children}</div>
            </div>
        </motion.div>
    );
});

/* ---------------- Live Seat-Hold timer ---------------- */

function SeatHoldTimer({ activeMotion }: { activeMotion: boolean }) {
    const [seconds, setSeconds] = useState(TIMER_TOTAL);

    useEffect(() => {
        if (!activeMotion) return;

        const id = setInterval(() => {
            setSeconds((s) => (s <= 0 ? TIMER_TOTAL : s - 1));
        }, 1000);

        return () => clearInterval(id);
    }, [activeMotion]);

    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    const progress = seconds / TIMER_TOTAL;

    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="relative mb-4 grid place-items-center">
                <motion.span
                    className="absolute h-32 w-32 rounded-full bg-black/[0.05]"
                    animate={
                        activeMotion
                            ? { scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }
                            : { scale: 1, opacity: 0.4 }
                    }
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r={R}
                        fill="none"
                        stroke="rgba(0,0,0,0.08)"
                        strokeWidth="6"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r={R}
                        fill="none"
                        stroke="rgba(0,0,0,0.7)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={C}
                        strokeDashoffset={C * (1 - progress)}
                        style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                </svg>

                <div className="absolute flex flex-col items-center">
                    <Clock className="mb-1 h-4 w-4 text-black/50" strokeWidth={1.75} />
                    <span className="font-mono text-2xl font-semibold tabular-nums text-black/85">
            {mm}:{ss}
          </span>
                </div>
            </div>

            <h3 className="text-base font-semibold text-black/85">Seat locked for you</h3>
            <p className="mt-1 text-sm leading-relaxed text-black/50">
                Your seats stay reserved for 10 minutes while you check out.
            </p>
        </div>
    );
}

/* ---------------- Smart Search hero card ---------------- */

function SmartSearchCard({ activeMotion }: { activeMotion: boolean }) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (!activeMotion) return;

        const id = setInterval(() => {
            setActive((i) => (i + 1) % TAGS.length);
        }, 2200);

        return () => clearInterval(id);
    }, [activeMotion]);

    return (
        <div className="flex h-full flex-col justify-between">
            <div>
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/[0.06]">
                    <Search className="h-5 w-5 text-black/70" strokeWidth={1.75} />
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-black/90">
                    Smart Search
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-black/55">
                    Filter by sport, league, city or date and jump straight to the match
                    you care about. No noise, just the game.
                </p>
            </div>

            <div className="mt-6">
                <div className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white/60 px-4 py-3">
                    <Search className="h-4 w-4 shrink-0 text-black/40" />

                    <div className="relative h-5 flex-1 overflow-hidden">
                        {TAGS.map((t, i) => (
                            <motion.span
                                key={t}
                                className="absolute inset-0 text-sm text-black/60"
                                initial={false}
                                animate={{
                                    y: active === i ? 0 : active === (i + 1) % TAGS.length ? -20 : 20,
                                    opacity: active === i ? 1 : 0,
                                }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                {t} matches this weekend…
                            </motion.span>
                        ))}
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {TAGS.map((t, i) => (
                        <button
                            key={t}
                            onClick={() => setActive(i)}
                            className={`rounded-full border px-3 py-1 text-xs transition active:scale-95 ${
                                active === i
                                    ? "border-black/70 bg-black/85 text-white"
                                    : "border-black/[0.12] bg-white/50 text-black/55"
                            }`}
                            type="button"
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ---------------- Small feature card ---------------- */

const FeatureCard = memo(function FeatureCard({
                                                  icon: Icon,
                                                  title,
                                                  desc,
                                                  extra,
                                                  className = "",
                                              }: {
    icon: LucideIcon;
    title: string;
    desc: string;
    extra?: React.ReactNode;
    className?: string;
}) {
    return (
        <BentoCard className={className}>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.06] transition-transform duration-500 group-hover:scale-110">
                <Icon className="h-5 w-5 text-black/70" strokeWidth={1.75} />
            </div>

            <h3 className="text-base font-semibold text-black/85">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-black/50">{desc}</p>

            {extra}
        </BentoCard>
    );
});

/* ---------------- Section ---------------- */

export default function FeaturesSection() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section
            ref={ref}
            className="relative w-full overflow-hidden px-6 py-24 md:px-10"
        >
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-14 max-w-2xl"
                >
          <span className="text-sm font-medium uppercase tracking-widest text-black/40">
            Why PitchSide
          </span>

                    <h2 className="mt-3 text-4xl font-semibold tracking-tight text-black/90 md:text-5xl">
                        Everything you need to reach the stands.
                    </h2>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <BentoCard className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
                        <SmartSearchCard activeMotion={inView} />
                    </BentoCard>

                    <FeatureCard
                        icon={Crown}
                        title="VIP & Exclusive"
                        desc="Premium seating, private entrances and hospitality access."
                        extra={
                            <div className="mt-4 flex gap-1.5">
                                {VIP_FEATURES.map((f) => (
                                    <span
                                        key={f}
                                        className="rounded-full bg-black/[0.06] px-2.5 py-1 text-[11px] text-black/55"
                                    >
                    {f}
                  </span>
                                ))}
                            </div>
                        }
                    />

                    <BentoCard className="lg:row-span-2">
                        <SeatHoldTimer activeMotion={inView} />
                    </BentoCard>

                    <FeatureCard
                        icon={ShieldCheck}
                        title="Direct & Secure"
                        desc="Buy straight from the source with protected payments."
                    />

                    <FeatureCard
                        icon={RefreshCw}
                        title="Total Flexibility"
                        desc="Review your booking history, change seats or cancel in a few taps."
                        className="sm:col-span-2 lg:col-span-2"
                    />

                    <FeatureCard
                        icon={Headphones}
                        title="24/7 Support"
                        desc="Real people, ready whenever match day questions come up."
                        className="sm:col-span-2 lg:col-span-2"
                    />
                </motion.div>
            </div>
        </section>
    );
}
