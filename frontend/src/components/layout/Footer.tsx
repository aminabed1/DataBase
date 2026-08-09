"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SUPPORT = ["Help Center", "Contact", "Refund Policy", "FAQ"];
const LEGAL = ["Privacy", "Terms", "Cookies"];
const SOCIALS = ["X", "Instagram", "YouTube"];

export default function Footer() {
    const wrapRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(wrapRef.current, {
                paddingLeft: 0,
                paddingRight: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: wrapRef.current,
                    start: "top 85%",
                    end: "top 35%",
                    scrub: 0.5,
                },
            });
        }, wrapRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={wrapRef}
            // افزایش فاصله از لبه‌ها با استفاده از کلاس‌های استاندارد برای جلوگیری از پرش GSAP
            className="bg-[var(--page-bg)] px-6 md:px-24 lg:px-32"
        >
            <footer className="overflow-hidden rounded-t-[3rem] bg-zinc-950 text-zinc-400 sm:rounded-t-[4rem]">
                <div className="mx-auto max-w-7xl px-6 pb-8 pt-12 sm:px-10 sm:pt-16">

                    {/* تقسیم فضا به دو ستون مساوی بعد از حذف بخش برند */}
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

                        {/* Support */}
                        <div className="flex flex-col gap-4">
                            <span className="text-xs uppercase tracking-widest text-zinc-600">
                                Support
                            </span>
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                                {SUPPORT.map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="text-sm transition-colors hover:text-white"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                Stay updated
                            </h4>
                            <p className="mt-4 text-sm leading-relaxed sm:text-base">
                                Match alerts and early-bird ticket drops, straight to your inbox.
                            </p>
                            <form
                                className="mt-6 flex w-full gap-2"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <input
                                    type="email"
                                    placeholder="you@email.com"
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-85"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/70 pt-6 text-xs sm:flex-row">
                        <span>© 2026 PitchSide. All rights reserved.</span>
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                            {LEGAL.map((item) => (
                                <a key={item} href="#" className="transition-colors hover:text-white">
                                    {item}
                                </a>
                            ))}
                            <span className="h-3 w-px bg-zinc-700" />
                            {SOCIALS.map((s) => (
                                <a
                                    key={s}
                                    href="#"
                                    className="uppercase tracking-wider transition-colors hover:text-white"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Giant wordmark */}
                <div
                    aria-hidden
                    className="pointer-events-none relative select-none overflow-hidden"
                >
                    <h2 className="translate-y-[22%] whitespace-nowrap text-center text-[18vw] font-bold leading-none tracking-tighter text-white">
                        PitchSide
                    </h2>
                </div>
            </footer>
        </div>
    );
}
