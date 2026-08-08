// components/FeaturesSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Search,
  Clock,
  Crown,
  RefreshCw,
  ShieldCheck,
  Headphones,
} from "lucide-react";

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

function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={cardIn}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`group relative overflow-hidden rounded-3xl border border-black/[0.08]
        bg-white/40 p-6 backdrop-blur-sm
        shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_30px_-12px_rgba(0,0,0,0.15)]
        transition-colors duration-500 hover:border-black/[0.16] ${className}`}
    >
      {/* subtle hover sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.5), transparent 40%)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </motion.div>
  );
}

/* ---------------- Live Seat-Hold timer ---------------- */

function SeatHoldTimer() {
  const [seconds, setSeconds] = useState(600); // 10:00

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 0 ? 600 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = seconds / 600; // 1 -> 0

  // SVG ring geometry
  const R = 52;
  const C = 2 * Math.PI * R;

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="relative mb-4 grid place-items-center">
        {/* pulsing halo */}
        <motion.span
          className="absolute h-32 w-32 rounded-full bg-black/[0.05]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
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

function SmartSearchCard() {
  const tags = ["Football", "Volleyball", "Basketball"];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % tags.length), 2200);
    return () => clearInterval(id);
  }, []);

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

      {/* mock search bar */}
      <div className="mt-6">
        <div className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white/60 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-black/40" />
          <div className="relative h-5 flex-1 overflow-hidden">
            {tags.map((t, i) => (
              <motion.span
                key={t}
                className="absolute inset-0 text-sm text-black/60"
                initial={false}
                animate={{
                  y: active === i ? 0 : active === (i + 1) % tags.length ? -20 : 20,
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
          {tags.map((t, i) => (
            <motion.button
              key={t}
              onClick={() => setActive(i)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                active === i
                  ? "border-black/70 bg-black/85 text-white"
                  : "border-black/[0.12] bg-white/50 text-black/55"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {t}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Small feature card ---------------- */

function FeatureCard({
  icon: Icon,
  title,
  desc,
  extra,
  className = "",
}: {
  icon: React.ElementType;
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
}

/* ---------------- Section ---------------- */

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative w-full px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-2xl"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-black/40">
            Why Tickora
          </span>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-black/90 md:text-5xl">
            Everything you need to reach the stands.
          </h2>
        </motion.div>

        {/* bento grid */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Smart Search — 2x2 */}
          <BentoCard className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <SmartSearchCard />
          </BentoCard>

          {/* VIP — 1x1 */}
          <FeatureCard
            icon={Crown}
            title="VIP & Exclusive"
            desc="Premium seating, private entrances and hospitality access."
            extra={
              <div className="mt-4 flex gap-1.5">
                {["Lounge", "Parking", "Catering"].map((f) => (
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

          {/* Seat Hold — 1x2 (tall) */}
          <BentoCard className="lg:row-span-2">
            <SeatHoldTimer />
          </BentoCard>

          {/* Direct & Secure — 1x1 */}
          <FeatureCard
            icon={ShieldCheck}
            title="Direct & Secure"
            desc="Buy straight from the source with protected payments."
          />

          {/* Flexibility — 2x1 */}
          <FeatureCard
            icon={RefreshCw}
            title="Total Flexibility"
            desc="Review your booking history, change seats or cancel in a few taps."
            className="sm:col-span-2 lg:col-span-2"
          />

          {/* Support — 2x1 */}
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
