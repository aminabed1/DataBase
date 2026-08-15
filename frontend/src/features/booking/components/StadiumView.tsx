"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarDays, MapPin, Ticket, ShieldCheck, Armchair, Clock,
    Crown, Star, Leaf, Users, Accessibility, GraduationCap, Bird, Flame
} from "lucide-react";

// ==========================================
// Mock Data (Mapped from Phase 2 Queries)
// ==========================================
const MOCK_MATCH = {
    id: 1,
    teamHome: { name: "Esteghlal", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Esteghlal_FC_logo.svg/1200px-Esteghlal_FC_logo.svg.png" },
    teamAway: { name: "Persepolis", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/Persepolis_F.C._logo.svg/1200px-Persepolis_F.C._logo.svg.png" },
    date: "2026-08-01",
    time: "18:00",
    stadium: "Azadi",
    city: "Tehran",
    league: "Premier League",
};

// Stadium Sections equipped with new Ticket Categories
const STADIUM_SECTIONS = [
    {
        id: "n-lower", name: "North Stand - Lower Tier", total: 8000, available: 1200, price: 200000,
        categories: [
            { name: "VVIP", count: 50, amenities: "Parking, Food, Lounge" },
            { name: "Premium", count: 1150, amenities: "Parking" }
        ],
        path: "M 290 195 L 510 195 L 585 120 L 215 120 Z"
    },
    {
        id: "s-lower", name: "South Stand - Lower Tier", total: 8000, available: 450, price: 200000,
        categories: [
            { name: "VIP", count: 50, amenities: "Parking, Food" },
            { name: "Family", count: 400, amenities: "Kid Zone" }
        ],
        path: "M 290 325 L 510 325 L 585 400 L 215 400 Z"
    },
    {
        id: "w-lower", name: "West Stand - Lower Tier", total: 6000, available: 3000, price: 150000,
        categories: [
            { name: "Disabled", count: 100, amenities: "Wheelchair Access" },
            { name: "Regular", count: 2900, amenities: "Standard Seating" }
        ],
        path: "M 285 205 L 285 315 L 205 395 L 205 125 Z"
    },
    {
        id: "e-lower", name: "East Stand - Lower Tier", total: 6000, available: 800, price: 150000,
        categories: [
            { name: "Premium", count: 100, amenities: "Parking" },
            { name: "Early Bird", count: 700, amenities: "Discounted" }
        ],
        path: "M 515 205 L 515 315 L 595 395 L 595 125 Z"
    },

    {
        id: "n-upper", name: "North Stand - Upper Tier", total: 12000, available: 5000, price: 100000,
        categories: [
            { name: "Economy", count: 4000, amenities: "Basic Seating" },
            { name: "Student", count: 1000, amenities: "ID Required" }
        ],
        path: "M 205 105 L 595 105 L 685 15 Q 400 -25 115 15 Z"
    },
    {
        id: "s-upper", name: "South Stand - Upper Tier", total: 12000, available: 0, price: 100000,
        categories: [
            { name: "Economy", count: 0, amenities: "Basic Seating" }
        ],
        path: "M 205 415 L 595 415 L 685 505 Q 400 545 115 505 Z"
    },
    {
        id: "w-upper", name: "West Stand - Upper Tier", total: 10000, available: 2100, price: 80000,
        categories: [
            { name: "Last Minute", count: 500, amenities: "Dynamic Pricing" },
            { name: "Regular", count: 1600, amenities: "Standard Seating" }
        ],
        path: "M 190 120 L 190 400 L 100 490 Q 60 260 100 30 Z"
    },
    {
        id: "e-upper", name: "East Stand - Upper Tier", total: 10000, available: 4300, price: 80000,
        categories: [
            { name: "Economy", count: 4300, amenities: "Basic Seating" }
        ],
        path: "M 610 120 L 610 400 L 700 490 Q 740 260 700 30 Z"
    },
];

// ==========================================
// Category Styles Dictionary
// ==========================================
const getCategoryStyle = (categoryName: string) => {
    switch (categoryName) {
        case "VVIP":
            return { icon: Crown, color: "text-amber-600", fontClass: "font-[cursive] italic text-xl tracking-wider font-bold" };
        case "VIP":
            return { icon: Crown, color: "text-amber-500", fontClass: "font-serif italic text-lg font-bold" };
        case "Premium":
            return { icon: Star, color: "text-indigo-600", fontClass: "font-[cursive] italic text-lg font-bold" };
        case "Economy":
            return { icon: Leaf, color: "text-emerald-600", fontClass: "font-sans font-bold" };
        case "Family":
            return { icon: Users, color: "text-sky-500", fontClass: "font-sans font-bold" };
        case "Disabled":
            return { icon: Accessibility, color: "text-blue-600", fontClass: "font-sans font-bold" };
        case "Student":
            return { icon: GraduationCap, color: "text-orange-500", fontClass: "font-sans font-bold" };
        case "Early Bird":
            return { icon: Bird, color: "text-teal-600", fontClass: "font-sans font-bold" };
        case "Last Minute":
            return { icon: Flame, color: "text-red-500", fontClass: "font-sans font-bold uppercase tracking-widest text-xs" };
        default:
            return { icon: ShieldCheck, color: "text-zinc-600", fontClass: "font-sans font-bold" };
    }
};

export default function StadiumView() {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);

    const activeSectionData = STADIUM_SECTIONS.find(s => s.id === hoveredSection);

    return (
        // Lighter gray background without boxes
        <div className="min-h-screen bg-[#E8E9E9] p-4 md:p-8 font-sans text-zinc-900">
            <div className="mx-auto max-w-7xl flex flex-col-reverse lg:flex-row gap-16 lg:gap-8 pt-8">

                {/* ========================================== */}
                {/* LEFT COLUMN: Pure Typography Info Panel    */}
                {/* ========================================== */}
                <div className="w-full lg:w-1/3 flex flex-col gap-12 pr-4">

                    {/* General Match Info (Moved to left col, unboxed) */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 border-l-4 border-zinc-900 pl-6">
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-950">
                            {MOCK_MATCH.league}
                        </h1>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 text-sm font-semibold text-zinc-600">
                                <CalendarDays size={18} className="text-zinc-900" />
                                <span>{MOCK_MATCH.date}</span>
                                <span className="text-zinc-300">|</span>
                                <Clock size={18} className="text-zinc-900" />
                                <span>{MOCK_MATCH.time} Local</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-semibold text-zinc-600">
                                <MapPin size={18} className="text-zinc-900" />
                                <span>{MOCK_MATCH.stadium} Stadium, {MOCK_MATCH.city}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Section Details (Unboxed, typographic) */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2">
                            <Armchair size={16} /> Section Details
                        </h2>

                        <AnimatePresence mode="wait">
                            {activeSectionData ? (
                                <motion.div
                                    key={activeSectionData.id}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col gap-8"
                                >
                                    <div>
                                        <h3 className="text-3xl font-black text-zinc-900 mb-2">{activeSectionData.name}</h3>
                                        <p className="text-zinc-500 font-medium">Starting from: <span className="text-zinc-900 font-bold">{activeSectionData.price.toLocaleString()} Toman</span></p>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="flex justify-between items-end border-b border-zinc-300/50 pb-2">
                                            <span className="text-zinc-500 font-medium">Total Capacity</span>
                                            <span className="text-lg font-black text-zinc-900">{activeSectionData.total.toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-between items-end border-b border-zinc-300/50 pb-2">
                                            <span className="text-zinc-500 font-medium">Available Seats</span>
                                            <span className={`text-xl font-black ${activeSectionData.available === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {activeSectionData.available === 0 ? 'Sold Out' : activeSectionData.available.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Breakdown by DB Categories */}
                                    <div className="pt-4 flex flex-col gap-5">
                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Available Ticket Types</span>
                                        {activeSectionData.categories.map((cat, idx) => {
                                            const { icon: CatIcon, color, fontClass } = getCategoryStyle(cat.name);

                                            return (
                                                <div key={idx} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <CatIcon size={20} className={color} />
                                                        <div className="flex flex-col">
                                                            <span className={`${fontClass} ${color}`}>{cat.name}</span>
                                                            {/* Showing Amenities from SQL */}
                                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{cat.amenities}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-black text-zinc-700 bg-zinc-200/50 px-3 py-1 rounded-full">
                                                        {cat.count.toLocaleString()}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col gap-4 opacity-40 mt-10"
                                >
                                    <Ticket size={40} className="text-zinc-400" />
                                    <p className="text-xl font-black text-zinc-900">Select a Block</p>
                                    <p className="text-sm text-zinc-600 font-medium">Hover over the stadium map on the right<br/>to view live capacity and ticket categories.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ========================================== */}
                {/* RIGHT COLUMN: Teams & Stadium SVG          */}
                {/* ========================================== */}
                <div className="w-full lg:w-2/3 flex flex-col items-center justify-start gap-12">

                    {/* Teams Header (Unboxed, floating) */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-6 w-full mt-4"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <img src={MOCK_MATCH.teamHome.logo} alt="Home" className="h-20 w-20 md:h-24 md:w-24 object-contain drop-shadow-xl" />
                            <span className="text-lg md:text-xl font-black text-zinc-900 tracking-tight">{MOCK_MATCH.teamHome.name}</span>
                        </div>

                        <div className="flex flex-col items-center px-4 md:px-8">
                            <span className="text-4xl md:text-6xl font-black italic text-zinc-300/80 tracking-tighter">VS</span>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <img src={MOCK_MATCH.teamAway.logo} alt="Away" className="h-20 w-20 md:h-24 md:w-24 object-contain drop-shadow-xl" />
                            <span className="text-lg md:text-xl font-black text-zinc-900 tracking-tight">{MOCK_MATCH.teamAway.name}</span>
                        </div>
                    </motion.div>

                    {/* Interactive Stadium Map (No box, floating directly on bg) */}
                    <div className="w-full flex items-center justify-center px-4">
                        <svg
                            viewBox="0 0 800 520"
                            className="w-full h-auto max-h-[600px]"
                            style={{ filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.1))" }}
                        >
                            {/* Pitch / Field */}
                            <g className="pitch">
                                <rect x="300" y="210" width="200" height="100" rx="4" fill="#a7f3d0" stroke="#10b981" strokeWidth="2" opacity="0.5" />
                                <circle cx="400" cy="260" r="20" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5" />
                                <line x1="400" y1="210" x2="400" y2="310" stroke="#10b981" strokeWidth="2" opacity="0.5" />
                            </g>

                            {/* Render 8 Stadium Sections */}
                            {STADIUM_SECTIONS.map((section) => {
                                const isHovered = hoveredSection === section.id;
                                const isSoldOut = section.available === 0;

                                // Colors adapted for the new lighter gray background
                                let fillColor = "#d4d4d8"; // Slightly darker gray so it stands out from #E8E9E9
                                let strokeColor = "#ffffff";

                                if (isSoldOut) {
                                    fillColor = "#fca5a5";
                                    strokeColor = "#fef2f2";
                                } else if (isHovered) {
                                    fillColor = "#10b981"; // Strong green on hover
                                    strokeColor = "#047857";
                                }

                                return (
                                    <motion.path
                                        key={section.id}
                                        d={section.path}
                                        fill={fillColor}
                                        stroke={strokeColor}
                                        strokeWidth={isHovered ? "4" : "2"}
                                        strokeLinejoin="round"
                                        onMouseEnter={() => setHoveredSection(section.id)}
                                        onMouseLeave={() => setHoveredSection(null)}
                                        onClick={() => {
                                            if (!isSoldOut) alert(`Navigating to grid view for: ${section.name}`);
                                        }}
                                        className={`transition-colors duration-300 ${isSoldOut ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        whileHover={!isSoldOut ? { scale: 1.02, zIndex: 10 } : {}}
                                        style={{ transformOrigin: "center" }}
                                    />
                                );
                            })}
                        </svg>
                    </div>

                </div>
            </div>
        </div>
    );
}