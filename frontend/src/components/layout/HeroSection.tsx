"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import MagneticEffect from "@/components/ui/MagneticEffect";
import { useRef, useState, useEffect } from "react";

export default function HeroSection() {
    const containerRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // استیت برای تشخیص اینکه ویدیو به فریم آخر رسیده یا نه
    const [isVideoEnded, setIsVideoEnded] = useState(false);

    // آستانه‌ی پاز: درصدی از ارتفاع هیرو (نه عدد ثابت)
    const pauseAtRef = useRef(0);

    useEffect(() => {
        const calc = () => {
            const h = containerRef.current?.offsetHeight ?? window.innerHeight;
            pauseAtRef.current = h * 0.5; // ۵۰٪ ارتفاع هیرو
        };
        calc();
        window.addEventListener("resize", calc);
        window.addEventListener("orientationchange", calc);
        return () => {
            window.removeEventListener("resize", calc);
            window.removeEventListener("orientationchange", calc);
        };
    }, []);

    const { scrollY } = useScroll();

    const scale = useTransform(scrollY, [0, 400], [1, 0.92]);
    const borderRadius = useTransform(scrollY, [0, 400], ["0px", "40px"]);
    const opacity = useTransform(scrollY, [0, 600], [1, 0.3]);

    // پرفورمنس: هنگام اسکرول عمیق ویدیو پاز می‌شود تا GPU فقط درگیر انیمیشن باشد
    useMotionValueEvent(scrollY, "change", (latest) => {
        const video = videoRef.current;
        if (!video || isVideoEnded) return;

        const pauseAt = pauseAtRef.current;
        const resumeAt = pauseAt * 0.8; // بازه hysteresis برای جلوگیری از toggle پیاپی

        if (latest > pauseAt && !video.paused) {
            video.pause();
        } else if (latest < resumeAt && video.paused) {
            video.play().catch(() => {});
        }
    });

    return (
        <section
            ref={containerRef}
            className="relative h-svh w-full bg-[#0a0a0a] overflow-hidden"
        >
            <motion.div
                style={{
                    scale,
                    borderRadius,
                    opacity,
                    transformOrigin: "top center",
                    willChange: "transform, border-radius, opacity",
                }}
                className="relative h-full w-full overflow-hidden transform-gpu"
            >
                {/* Layer 1: video */}
                <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/videos/hero-stadium.mp4"
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    poster="/images/hero-poster.jpg"
                    // حذف صفت loop برای ایستادن روی فریم آخر
                    onEnded={() => setIsVideoEnded(true)}
                />

                {/* Layer 2: overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />

                {/* Layer 3: content */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-white/60"
                    >
                        <span className="h-px w-8 bg-white/40" />
                        Live sports · Instant tickets
                    </motion.div>

                    <h1 className="flex flex-col items-center leading-[0.92] tracking-tight text-white">
                        {[
                            <span key="l1">
                                Every{" "}
                                <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-normal text-white/90">
                                    match
                                </span>
                                ,
                            </span>,
                            <span className="font-black uppercase" key="l2">
                                every seat,
                            </span>,
                            <span
                                key="l3"
                                className="font-black uppercase text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.85)]"
                            >
                                one tap away
                            </span>,
                        ].map((line, i) => (
                            <motion.span
                                key={i}
                                initial={{ y: 60, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    delay: 0.35 + i * 0.15,
                                    duration: 0.8,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="text-[clamp(2rem,6.5vw,5.25rem)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
                            >
                                {line}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="mt-6 max-w-md text-base text-white/70 md:text-lg"
                    >
                        Football, basketball, and volleyball tickets — just one click away
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="mt-10"
                    >
                        <MagneticEffect>
                            <a
                                href="/matches"
                                className="block rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
                            >
                                Browse Matches
                            </a>
                        </MagneticEffect>
                    </motion.div>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </motion.div>
        </section>
    );
}
