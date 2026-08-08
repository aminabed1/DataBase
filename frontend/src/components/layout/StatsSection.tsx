"use client";

import { useEffect, useRef } from "react";
import {
    motion,
    useInView,
    useMotionValue,
    useTransform,
    animate,
} from "framer-motion";

function CountUp({
    to,
    suffix = "",
    duration = 2,
}: {
    to: number;
    suffix?: string;
    duration?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) =>
        Math.round(v).toLocaleString("en-US")
    );

    useEffect(() => {
        if (!inView) return;
        const controls = animate(count, to, {
            duration,
            ease: [0.16, 1, 0.3, 1],
        });
        return controls.stop;
    }, [inView, to, duration, count]);

    return (
        <span ref={ref} className="tabular-nums">
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    );
}

const STATS = [
    { value: 3, suffix: "", label: "Sports", note: "Football · Basketball · Volleyball" },
    { value: 7, suffix: "", label: "Countries", note: "Across Europe & the US" },
    { value: 10, suffix: "+", label: "Top Leagues", note: "From Premier League to NBA" },
    { value: 4000, suffix: "+", label: "Matches / Season", note: "One tap to any seat" },
];

export default function StatsSection() {
    return (
        <section className="px-4 py-28 md:py-36">
            <div className="mx-auto w-full max-w-6xl">
                {/* عنوان */}
                <div className="mb-16 flex flex-col items-center text-center">
                    <span className="text-xs font-medium uppercase tracking-[0.25em] text-black/40">
                        Tickora in numbers
                    </span>
                    <h2 className="mt-4 text-4xl text-black md:text-5xl">
                        Every game,{" "}
                        <span className="font-[family-name:var(--font-serif)] italic">
                            within reach
                        </span>
                    </h2>
                </div>

                {/* گرید آمار */}
                <div className="grid grid-cols-2 divide-x divide-y divide-black/[0.08] border border-black/[0.08] rounded-3xl overflow-hidden bg-white/30 backdrop-blur-[2px] md:grid-cols-4 md:divide-y-0">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="flex flex-col items-center justify-center gap-2 px-6 py-12 md:py-16"
                        >
                            <span className="text-5xl font-medium text-black md:text-6xl">
                                <CountUp to={stat.value} suffix={stat.suffix} />
                            </span>
                            <span className="text-sm font-medium uppercase tracking-widest text-black/60">
                                {stat.label}
                            </span>
                            <span className="text-xs text-black/40">{stat.note}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
