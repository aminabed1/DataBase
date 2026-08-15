"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    CalendarDays, MapPin, Ticket, ShieldCheck, Armchair, Clock,
    Crown, Star, Leaf, Users, Accessibility, GraduationCap, Bird, Flame, ArrowLeft, Info
} from "lucide-react";

// ==========================================
// Mock Data
// ==========================================
const MOCK_MATCH = {
    id: 1,
    teamHome: { name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png" },
    teamAway: { name: "Chelsea", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png" },
    date: "2026-08-15",
    time: "20:00",
    stadium: "Emirates",
    city: "London",
    league: "Premier League",
};

const STADIUM_SECTIONS = [
    {
        id: "n-lower", name: "North Stand - Lower Tier", total: 10, available: 4, price: 250,
        categories: [
            { name: "VVIP", count: 4, amenities: "Parking, Food, Lounge" },
            { name: "Premium", count: 6, amenities: "Parking" }
        ],
        path: "M 290 195 L 510 195 L 585 120 L 215 120 Z"
    },
    {
        id: "s-lower", name: "South Stand - Lower Tier", total: 10, available: 0, price: 250,
        categories: [
            { name: "VIP", count: 5, amenities: "Parking, Food" },
            { name: "Family", count: 5, amenities: "Kid Zone" }
        ],
        path: "M 290 325 L 510 325 L 585 400 L 215 400 Z"
    },
    {
        id: "w-lower", name: "West Stand - Lower Tier", total: 10, available: 8, price: 150,
        categories: [
            { name: "Disabled", count: 2, amenities: "Wheelchair Access" },
            { name: "Regular", count: 8, amenities: "Standard Seating" }
        ],
        path: "M 285 205 L 285 315 L 205 395 L 205 125 Z"
    },
    {
        id: "e-lower", name: "East Stand - Lower Tier", total: 10, available: 2, price: 150,
        categories: [
            { name: "Premium", count: 5, amenities: "Parking" },
            { name: "Early Bird", count: 5, amenities: "Discounted" }
        ],
        path: "M 515 205 L 515 315 L 595 395 L 595 125 Z"
    },
    {
        id: "n-upper", name: "North Stand - Upper Tier", total: 10, available: 10, price: 80,
        categories: [
            { name: "Economy", count: 6, amenities: "Basic Seating" },
            { name: "Student", count: 4, amenities: "ID Required" }
        ],
        path: "M 205 105 L 595 105 L 685 15 Q 400 -25 115 15 Z"
    },
    {
        id: "s-upper", name: "South Stand - Upper Tier", total: 10, available: 5, price: 80,
        categories: [
            { name: "Economy", count: 10, amenities: "Basic Seating" }
        ],
        path: "M 205 415 L 595 415 L 685 505 Q 400 545 115 505 Z"
    },
    {
        id: "w-upper", name: "West Stand - Upper Tier", total: 10, available: 1, price: 60,
        categories: [
            { name: "Last Minute", count: 3, amenities: "Dynamic Pricing" },
            { name: "Regular", count: 7, amenities: "Standard Seating" }
        ],
        path: "M 190 120 L 190 400 L 100 490 Q 60 260 100 30 Z"
    },
    {
        id: "e-upper", name: "East Stand - Upper Tier", total: 10, available: 7, price: 60,
        categories: [
            { name: "Economy", count: 10, amenities: "Basic Seating" }
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
            return { icon: Crown, color: "text-amber-600", bgClass: "bg-amber-500", fontClass: "font-[cursive] italic text-xl tracking-wider font-bold" };
        case "VIP":
            return { icon: Crown, color: "text-amber-500", bgClass: "bg-amber-400", fontClass: "font-serif italic text-lg font-bold" };
        case "Premium":
            return { icon: Star, color: "text-indigo-600", bgClass: "bg-indigo-500", fontClass: "font-[cursive] italic text-lg font-bold" };
        case "Economy":
            return { icon: Leaf, color: "text-emerald-600", bgClass: "bg-emerald-500", fontClass: "font-sans font-bold text-base" };
        case "Family":
            return { icon: Users, color: "text-sky-500", bgClass: "bg-sky-400", fontClass: "font-sans font-bold text-base" };
        case "Disabled":
            return { icon: Accessibility, color: "text-blue-600", bgClass: "bg-blue-500", fontClass: "font-sans font-bold text-base" };
        case "Student":
            return { icon: GraduationCap, color: "text-orange-500", bgClass: "bg-orange-400", fontClass: "font-sans font-bold text-base" };
        case "Early Bird":
            return { icon: Bird, color: "text-teal-600", bgClass: "bg-teal-500", fontClass: "font-sans font-bold text-base" };
        case "Last Minute":
            return { icon: Flame, color: "text-red-500", bgClass: "bg-red-500", fontClass: "font-sans font-bold uppercase tracking-widest text-sm" };
        default:
            return { icon: ShieldCheck, color: "text-zinc-600", bgClass: "bg-zinc-500", fontClass: "font-sans font-bold text-base" };
    }
};

// ==========================================
// Seat Generator Logic
// ==========================================
type SeatStatus = "AVAILABLE" | "SOLD" | "LOCKED";
interface Seat {
    id: number;
    row: number;
    number: number;
    category: string;
    status: SeatStatus;
    amenities: string;
}

const generateSeatsForSection = (section: typeof STADIUM_SECTIONS[0]) => {
    let seats: Seat[] = [];
    let seatCounter = 1;
    let availableBudget = section.available;

    const lockedCount = Math.floor((section.total - section.available) * 0.3);

    section.categories.forEach(cat => {
        for (let i = 0; i < cat.count; i++) {
            let status: SeatStatus = "SOLD";

            if (availableBudget > 0) {
                status = "AVAILABLE";
                availableBudget--;
            } else if (seatCounter % 2 === 0 && lockedCount > 0) {
                status = "LOCKED";
            }

            seats.push({
                id: seatCounter,
                row: Math.ceil(seatCounter / 5),
                number: seatCounter,
                category: cat.name,
                status: status,
                amenities: cat.amenities
            });
            seatCounter++;
        }
    });

    return seats.sort(() => Math.random() - 0.5);
};

// ==========================================
// Animation Variants
// ==========================================
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const breathAnimation = {
    scale: [1, 1.08, 1],
    opacity: [0.7, 1, 0.7],
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
};

export default function StadiumView() {
    const router = useRouter();
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

    const activeSectionData = STADIUM_SECTIONS.find(s => s.id === (selectedSection || hoveredSection));

    const sectionSeats = useMemo(() => {
        if (!selectedSection) return [];
        const section = STADIUM_SECTIONS.find(s => s.id === selectedSection);
        return section ? generateSeatsForSection(section) : [];
    }, [selectedSection]);

    const handleBackToStadium = () => {
        setSelectedSection(null);
        setSelectedSeat(null);
    };

    return (
        <div className="h-screen overflow-hidden bg-[#E8E9E9] px-4 py-3 md:px-8 md:py-4 font-sans text-zinc-900 relative">

            {/* ========================================== */}
            {/* BACK TO MATCHES BUTTON                     */}
            {/* ========================================== */}
            <button
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-2 bg-white/60 backdrop-blur-md border border-zinc-200/50 px-5 py-2.5 rounded-full text-sm font-bold text-zinc-600 hover:text-zinc-950 hover:bg-white hover:shadow-md transition-all"
                onClick={() => router.push('/matches')}
            >
                <ArrowLeft size={16} /> Back to Matches
            </button>

            <div className="mx-auto h-full max-w-7xl flex flex-col-reverse lg:flex-row gap-6 lg:gap-8">

                {/* ========================================== */}
                {/* LEFT COLUMN: Info Panel                    */}
                {/* ========================================== */}
                <div className="w-full lg:w-[30%] flex flex-col gap-6 pr-2 min-h-0 overflow-y-auto pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-3 border-l-4 border-zinc-900 pl-4 mt-4 shrink-0"
                    >
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-950">
                            {MOCK_MATCH.league}
                        </h1>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-base font-semibold text-zinc-600">
                                <CalendarDays size={18} className="text-zinc-900" />
                                <span>{MOCK_MATCH.date}</span>
                                <span className="text-zinc-300">|</span>
                                <Clock size={18} className="text-zinc-900" />
                                <span>{MOCK_MATCH.time} Local</span>
                            </div>
                            <div className="flex items-center gap-2 text-base font-semibold text-zinc-600">
                                <MapPin size={18} className="text-zinc-900" />
                                <span>{MOCK_MATCH.stadium} Stadium, {MOCK_MATCH.city}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Section Details */}
                    <div className="mt-4 flex-1">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-5 flex items-center gap-2">
                            <Armchair size={16} /> Section Details
                        </h2>

                        <AnimatePresence mode="wait">
                            {activeSectionData ? (
                                <motion.div
                                    key={activeSectionData.id}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="flex flex-col gap-6"
                                >
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-3xl font-black text-zinc-900 mb-1">{activeSectionData.name}</h3>
                                        <p className="text-base text-zinc-500 font-medium">Starting from: <span className="text-zinc-900 font-bold">${activeSectionData.price}</span></p>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="flex flex-col gap-4">
                                        <div className="flex justify-between items-end border-b border-zinc-300/50 pb-2">
                                            <span className="text-base text-zinc-500 font-medium">Total Capacity</span>
                                            <span className="text-lg font-black text-zinc-900">{activeSectionData.total} Seats</span>
                                        </div>

                                        <div className="flex justify-between items-end pb-1">
                                            <span className="text-base text-zinc-500 font-medium">Available Seats</span>
                                            <span className={`text-lg font-black ${activeSectionData.available === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {activeSectionData.available === 0 ? 'Sold Out' : activeSectionData.available}
                                            </span>
                                        </div>

                                        <div className="h-1.5 w-full bg-zinc-300/60 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${((activeSectionData.total - activeSectionData.available) / activeSectionData.total) * 100}%` }}
                                                transition={{ duration: 0.8, ease: "circOut" }}
                                                className={`h-full rounded-full ${activeSectionData.available === 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* استفاده از mode="wait" برای جابجایی نرم بین کارت و لیست و جلوگیری از پرش ارتفاع */}
                                    <div className="min-h-[200px]">
                                        <AnimatePresence mode="wait">
                                            {selectedSeat ? (
                                                <motion.div
                                                    key="selected-seat"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm mt-2"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Selected Seat</span>
                                                        <div className="flex items-center gap-1.5 bg-zinc-100 px-2 py-1 rounded-md">
                                                            <Armchair size={14} className="text-zinc-600" />
                                                            <span className="text-sm font-black text-zinc-800">R{selectedSeat.row} - S{selectedSeat.number}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`w-3 h-3 rounded-full ${getCategoryStyle(selectedSeat.category).bgClass}`} />
                                                        <span className={`text-lg ${getCategoryStyle(selectedSeat.category).fontClass} ${getCategoryStyle(selectedSeat.category).color}`}>
                                                            {selectedSeat.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-6">{selectedSeat.amenities}</p>

                                                    <button className="w-full mt-6 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl transition-colors">
                                                        Add to Cart - ${activeSectionData.price}
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="categories"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="pt-2 flex flex-col gap-5"
                                                >
                                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Available Ticket Types</span>
                                                    {activeSectionData.categories.map((cat, idx) => {
                                                        const { icon: CatIcon, color, fontClass } = getCategoryStyle(cat.name);

                                                        return (
                                                            <div key={idx} className="flex items-center justify-between group">
                                                                <div className="flex items-center gap-3">
                                                                    <CatIcon size={22} className={color} />
                                                                    <div className="flex flex-col leading-tight">
                                                                        <span className={`${fontClass} ${color}`}>{cat.name}</span>
                                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{cat.amenities}</span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-sm font-black text-zinc-700 bg-zinc-200/50 px-3 py-1 rounded-full">
                                                                    {cat.count}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col gap-3 opacity-40 mt-4"
                                >
                                    <Ticket size={36} className="text-zinc-400" />
                                    <p className="text-xl font-black text-zinc-900">Select a Block</p>
                                    <p className="text-sm text-zinc-600 font-medium">Hover over the stadium map on the right<br/>to view live capacity.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ========================================== */}
                {/* RIGHT COLUMN: Interactive Area             */}
                {/* ========================================== */}
                <div className="w-full lg:w-[70%] flex flex-col items-center justify-start gap-4 min-h-0 pt-4">

                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-4 w-full shrink-0"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <img src={MOCK_MATCH.teamHome.logo} alt="Home" className="h-12 w-12 md:h-16 md:w-16 object-contain drop-shadow-lg" />
                            <span className="text-sm md:text-base font-black text-zinc-900 tracking-tight">{MOCK_MATCH.teamHome.name}</span>
                        </div>

                        <div className="flex flex-col items-center px-2">
                            <span className="text-2xl md:text-3xl font-black italic text-zinc-300/80 tracking-tighter">VS</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <img src={MOCK_MATCH.teamAway.logo} alt="Away" className="h-12 w-12 md:h-16 md:w-16 object-contain drop-shadow-lg" />
                            <span className="text-sm md:text-base font-black text-zinc-900 tracking-tight">{MOCK_MATCH.teamAway.name}</span>
                        </div>
                    </motion.div>

                    {/* Switch between Stadium Map and Seat Grid */}
                    <div className="w-full flex-1 min-h-0 flex items-center justify-center px-2 relative mt-4">
                        <AnimatePresence mode="wait">

                            {!selectedSection ? (
                                /* ---------------- STADIUM MAP ---------------- */
                                <motion.div
                                    key="stadium"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <svg
                                        viewBox="0 -20 800 560"
                                        className="w-full h-full max-h-[65vh] object-contain"
                                        style={{ filter: "drop-shadow(0 20px 20px rgb(0 0 0 / 0.1))" }}
                                    >
                                        <g className="pitch">
                                            <rect x="300" y="210" width="200" height="100" rx="4" fill="#a7f3d0" stroke="#10b981" strokeWidth="2" opacity="0.5" />
                                            <circle cx="400" cy="260" r="20" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5" />
                                            <line x1="400" y1="210" x2="400" y2="310" stroke="#10b981" strokeWidth="2" opacity="0.5" />
                                        </g>

                                        {STADIUM_SECTIONS.map((section) => {
                                            const isHovered = hoveredSection === section.id;
                                            const isSoldOut = section.available === 0;

                                            let fillColor = "#d4d4d8";
                                            let strokeColor = "#ffffff";

                                            if (isSoldOut) {
                                                fillColor = "#fca5a5";
                                                strokeColor = "#fef2f2";
                                            } else if (isHovered) {
                                                fillColor = "#10b981";
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
                                                        if (!isSoldOut) {
                                                            setSelectedSection(section.id);
                                                            setHoveredSection(null);
                                                        }
                                                    }}
                                                    className="transition-colors duration-300 cursor-none"
                                                    whileHover={!isSoldOut ? { scale: 1.02 } : {}}
                                                    style={{ transformOrigin: "center" }}
                                                />
                                            );
                                        })}
                                    </svg>
                                </motion.div>
                            ) : (
                                /* ---------------- SEAT GRID ---------------- */
                                <motion.div
                                    key="seatgrid"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 flex flex-col relative"
                                >
                                    <button
                                        onClick={handleBackToStadium}
                                        className="absolute top-6 left-6 p-2 rounded-full hover:bg-zinc-100 transition-colors flex items-center gap-2 text-sm font-bold text-zinc-500"
                                    >
                                        <ArrowLeft size={18} /> Back to Map
                                    </button>

                                    <div className="text-center mb-10 mt-2">
                                        <h3 className="text-2xl font-black text-zinc-900">Select Your Seat</h3>
                                        <p className="text-zinc-500 text-sm font-medium mt-1">Row 1 (Bottom) to Row 2 (Top)</p>
                                    </div>

                                    {/* Pitch Indicator (To show orientation) */}
                                    <div className="w-full h-8 bg-emerald-50 rounded-t-2xl border-t-4 border-emerald-400 flex items-center justify-center mb-8">
                                        <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Pitch Direction</span>
                                    </div>

                                    {/* 10 Seats Grid (5 columns, 2 rows) */}
                                    <div className="grid grid-cols-5 gap-4 place-items-center mb-8 px-4">
                                        {sectionSeats.map((seat) => {
                                            const isSelected = selectedSeat?.id === seat.id;
                                            const isAvailable = seat.status === "AVAILABLE";
                                            const isSold = seat.status === "SOLD";
                                            const isLocked = seat.status === "LOCKED";
                                            const bgClass = getCategoryStyle(seat.category).bgClass;

                                            return (
                                                <motion.button
                                                    key={seat.id}
                                                    disabled={!isAvailable}
                                                    onClick={() => setSelectedSeat(seat)}
                                                    animate={isLocked ? breathAnimation : {}}
                                                    whileHover={isAvailable ? { scale: 1.1, y: -2 } : {}}
                                                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                                                    className={`
                                                        relative flex flex-col items-center justify-center w-14 h-16 rounded-t-xl rounded-b-md transition-all
                                                        ${isSold ? "opacity-30 cursor-not-allowed bg-zinc-200" : bgClass}
                                                        ${isSelected ? "ring-4 ring-offset-2 ring-zinc-900 shadow-lg" : "shadow-sm"}
                                                        ${isLocked ? "cursor-wait" : ""}
                                                    `}
                                                >
                                                    {/* صندلی داخلی */}
                                                    <div className={`w-10 h-8 mt-auto mb-1 rounded-sm ${isSold ? 'bg-zinc-300' : 'bg-white/20'}`} />

                                                    {isLocked && (
                                                        <div className="absolute -top-2 -right-2 bg-zinc-900 text-white p-1 rounded-full shadow-md">
                                                            <Clock size={10} />
                                                        </div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex items-center justify-center gap-6 pt-6 border-t border-zinc-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-sm bg-zinc-200 opacity-50" />
                                            <span className="text-xs font-bold text-zinc-500">Sold</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-sm bg-emerald-500" />
                                            <span className="text-xs font-bold text-zinc-500">Available</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <motion.div animate={breathAnimation} className="w-4 h-4 rounded-sm bg-indigo-500 relative flex items-center justify-center">
                                                <Clock size={10} className="text-white absolute" />
                                            </motion.div>
                                            <span className="text-xs font-bold text-zinc-500">Locked (10m)</span>
                                        </div>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}