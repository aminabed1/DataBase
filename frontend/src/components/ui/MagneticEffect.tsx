"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";

interface MagneticEffectProps {
    children: ReactNode;
    className?: string;
    pullStrength?: number; // میزان کشش رو میشه شخصی‌سازی کرد
}

export default function MagneticEffect({ children, className = "", pullStrength = 0.3 }: MagneticEffectProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // تنظیمات فنری برای بازگشت نرم دکمه به سر جاش
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();

        // محاسبه فاصله موس از مرکز دکمه
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        // حرکت دادن دکمه به نسبت فاصله
        x.set(middleX * pullStrength);
        y.set(middleY * pullStrength);
    };

    const handleMouseLeave = () => {
        // بازگشت به نقطه صفر وقتی موس خارج میشه
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
}