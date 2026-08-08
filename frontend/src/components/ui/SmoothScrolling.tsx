"use client";

import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

export default function SmoothScrolling({ children }: { children: ReactNode }) {
    return (
        <ReactLenis root options={{
            lerp: 0.08, // هرچی کمتر باشه، اسکرول نرم‌تر و طولانی‌تر میشه (دیفالت 0.1)
            duration: 1.5, // مدت زمان انیمیشن اسکرول
            smoothWheel: true,
        }}>
            {children}
        </ReactLenis>
    );
}