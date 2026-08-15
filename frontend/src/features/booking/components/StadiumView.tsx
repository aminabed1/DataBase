"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Ticket, ShieldCheck, Armchair, Clock } from "lucide-react";

// ==========================================
// Mock Data (Based on your database structure)
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

// 8 Stadium Sections Data
const STADIUM_SECTIONS = [
    { id: "n-lower", name: "North Stand - Lower Tier", total: 8000, available: 1200, price: 200000, categories: [{ name: "VIP", count: 200 }, { name: "Regular", count: 1000 }], path: "M 290 195 L 510 195 L 585 120 L 215 120 Z" },
    { id: "s-lower", name: "South Stand - Lower Tier", total: 8000, available: 450, price: 200000, categories: [{ name: "VIP", count: 50 }, { name: "Regular", count: 400 }], path: "M 290 325 L 510 325 L 585 400 L 215 400 Z" },
    { id: "w-lower", name: "West Stand - Lower Tier", total: 6000, available: 3000, price: 150000, categories: [{ name: "Premium", count: 500 }, { name: "Regular", count: 2500 }], path: "M 285 205 L 285 315 L 205 395 L 205 125 Z" },
    { id: "e-lower", name: "East Stand - Lower Tier", total: 6000, available: 800, price: 150000, categories: [{ name: "Premium", count: 100 }, { name: "Regular", count: 700 }], path: "M 515 205 L 515 315 L 595 395 L 595 125 Z" },

    { id: "n-upper", name: "North Stand - Upper Tier", total: 12000, available: 5000, price: 100000, categories: [{ name: "Regular", count: 5000 }], path: "M 205 105 L 595 105 L 685 15 Q 400 -25 115 15 Z" },
    { id: "s-upper", name: "South Stand - Upper Tier", total: 12000, available: 0, price: 100000, categories: [{ name: "Regular", count: 0 }], path: "M 205 415 L 595 415 L 685 505 Q 400 545 115 505 Z" },
    { id: "w-upper", name: "West Stand - Upper Tier", total: 10000, available: 2100, price: 80000, categories: [{ name: "Regular", count: 2100 }], path: "M 190 120 L 190 400 L 100 490 Q 60 260 100 30 Z" },
    { id: "e-upper", name: "East Stand - Upper Tier", total: 10000, available: 4300, price: 80000, categories: [{ name: "Regular", count: 4300 }], path: "M 610 120 L 610 400 L 700 490 Q 740 260 700 30 Z" },
];

export default function StadiumView() {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);

    // Find the data for the currently hovered section
    const activeSectionData = STADIUM_SECTIONS.find(s => s.id === hoveredSection);

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
            <div className="mx-auto max-w-6xl">

                {/* ========================================== */}
                {/* HEADER: Match Information                  */}
                {/* ========================================== */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-[2rem] bg-white p-6 shadow-sm border border-gray-100"
                >
                    {/* Teams */}
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 p-2 border border-gray-100">
                                <img src={MOCK_MATCH.teamHome.logo} alt="Home" className="h-full w-full object-contain drop-shadow-md" />
                            </div>
                            <span className="text-sm font-black text-zinc-900">{MOCK_MATCH.teamHome.name}</span>
                        </div>

                        <div className="flex flex-col items-center px-4">
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 mb-2 whitespace-nowrap">{MOCK_MATCH.league}</span>
                            <span className="text-2xl font-black italic text-gray-300">VS</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 p-2 border border-gray-100">
                                <img src={MOCK_MATCH.teamAway.logo} alt="Away" className="h-full w-full object-contain drop-shadow-md" />
                            </div>
                            <span className="text-sm font-black text-zinc-900">{MOCK_MATCH.teamAway.name}</span>
                        </div>
                    </div>

                    {/* Time & Location */}
                    <div className="flex flex-col gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100 min-w-[250px]">
                        <div className="flex items-center gap-3 text-sm font-bold text-zinc-700">
                            <CalendarDays size={16} className="text-emerald-500" />
                            <span>{MOCK_MATCH.date}</span>
                            <span className="text-gray-300">|</span>
                            <Clock size={16} className="text-emerald-500" />
                            <span>{MOCK_MATCH.time} Local</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-zinc-700">
                            <MapPin size={16} className="text-emerald-500" />
                            <span>{MOCK_MATCH.stadium} Stadium, {MOCK_MATCH.city}</span>
                        </div>
                    </div>
                </motion.div>

                {/* ========================================== */}
                {/* MAIN CONTENT: Info Panel & Stadium Map     */}
                {/* ========================================== */}
                <div className="flex flex-col-reverse lg:flex-row gap-8">

                    {/* Information Sidebar */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                        <div className="rounded-[2rem] bg-zinc-950 p-6 shadow-xl text-white min-h-[400px] flex flex-col relative overflow-hidden">

                            {/* Faded Background Pattern */}
                            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                                <svg width="200" height="200" viewBox="0 0 100 100"><path d="M0,0 L100,100 M100,0 L0,100" stroke="white" strokeWidth="2" fill="none"/></svg>
                            </div>

                            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                                <Armchair className="text-emerald-400" /> Stadium View
                            </h2>

                            <AnimatePresence mode="wait">
                                {activeSectionData ? (
                                    <motion.div
                                        key={activeSectionData.id}
                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                        className="flex flex-col gap-6 flex-1"
                                    >
                                        <div className="border-b border-zinc-800 pb-4">
                                            <h3 className="text-2xl font-bold text-emerald-400 mb-1">{activeSectionData.name}</h3>
                                            <p className="text-zinc-400 text-sm">Starting from: {activeSectionData.price.toLocaleString()} Toman</p>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-zinc-400 text-sm">Total Capacity</span>
                                                <span className="text-xl font-black">{activeSectionData.total.toLocaleString()}</span>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <span className="text-zinc-400 text-sm">Available Seats</span>
                                                <span className={`text-2xl font-black ${activeSectionData.available === 0 ? 'text-red-400' : 'text-white'}`}>
                                                    {activeSectionData.available === 0 ? 'Sold Out' : activeSectionData.available.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mt-1">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(activeSectionData.available / activeSectionData.total) * 100}%` }}
                                                    className={`h-full rounded-full ${activeSectionData.available === 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                />
                                            </div>
                                        </div>

                                        {/* Category Breakdown */}
                                        <div className="mt-auto pt-4 flex flex-col gap-3">
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Availability by Category</span>
                                            {activeSectionData.categories.map((cat, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                                                    <div className="flex items-center gap-2">
                                                        <ShieldCheck size={16} className={cat.name === 'VIP' ? 'text-amber-400' : 'text-emerald-400'} />
                                                        <span className="text-sm font-semibold">{cat.name}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-zinc-300">{cat.count.toLocaleString()} Seats</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center flex-1 text-center opacity-50"
                                    >
                                        <Ticket size={48} className="mb-4 text-zinc-600" />
                                        <p className="text-lg font-bold">Select a Section</p>
                                        <p className="text-sm text-zinc-500 mt-2">Hover over the stadium map<br/>to view capacity and details.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Interactive Stadium Map */}
                    <div className="w-full lg:w-2/3 flex items-center justify-center bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                        <svg
                            viewBox="0 0 800 520"
                            className="w-full h-auto max-h-[500px] drop-shadow-xl"
                            style={{ filter: "drop-shadow(0 20px 13px rgb(0 0 0 / 0.05))" }}
                        >
                            {/* Pitch / Field */}
                            <g className="pitch">
                                <rect x="300" y="210" width="200" height="100" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
                                <circle cx="400" cy="260" r="20" fill="none" stroke="#bbf7d0" strokeWidth="2" />
                                <line x1="400" y1="210" x2="400" y2="310" stroke="#bbf7d0" strokeWidth="2" />
                            </g>

                            {/* Render 8 Stadium Sections */}
                            {STADIUM_SECTIONS.map((section) => {
                                const isHovered = hoveredSection === section.id;
                                const isSoldOut = section.available === 0;

                                // Coloring based on status
                                let fillColor = "#f4f4f5"; // Default (Light Gray)
                                let strokeColor = "#e4e4e7";

                                if (isSoldOut) {
                                    fillColor = "#fee2e2"; // Light Red
                                    strokeColor = "#fca5a5";
                                } else if (isHovered) {
                                    fillColor = "#a7f3d0"; // Light Green (Hover)
                                    strokeColor = "#10b981"; // Dark Green border
                                }

                                return (
                                    <motion.path
                                        key={section.id}
                                        d={section.path}
                                        fill={fillColor}
                                        stroke={strokeColor}
                                        strokeWidth={isHovered ? "3" : "1.5"}
                                        strokeLinejoin="round"
                                        onMouseEnter={() => setHoveredSection(section.id)}
                                        onMouseLeave={() => setHoveredSection(null)}
                                        onClick={() => {
                                            if (!isSoldOut) alert(`Navigating to grid view for: ${section.name}`);
                                        }}
                                        className={`transition-colors duration-300 ${isSoldOut ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        // Slight scale effect on hover
                                        whileHover={!isSoldOut ? { scale: 1.01, zIndex: 10 } : {}}
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