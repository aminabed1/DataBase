"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
    MapPin, CalendarDays, Clock, SlidersHorizontal, X, ArrowRight,
    Users, Coffee, Search, ChevronDown, Map, Ticket
} from "lucide-react";
import { matchService, SportType, Match } from "../services/match.service";

// ==========================================
// Custom Select Dropdown Component
// ==========================================
interface SelectOption {
    id: string;
    name: string;
}

function CustomSelect({
    icon: Icon,
    placeholder,
    value,
    options,
    onChange,
    disabled = false
}: {
    icon: React.ElementType;
    placeholder: string;
    value: string;
    options: SelectOption[];
    onChange: (val: string) => void;
    disabled?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find(o => String(o.id) === String(value));

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className={`relative group w-full ${isOpen ? 'z-50' : 'z-10'}`}>
            <Icon size={18} className={`pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 transition-colors ${isOpen || value ? 'text-zinc-950' : 'text-gray-400 group-hover:text-zinc-950'}`} />

            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`block w-full cursor-none rounded-2xl border-2 p-4 pl-12 pr-10 text-left text-sm font-medium outline-none transition-all 
                ${disabled ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50/30 text-gray-400' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white'} 
                ${isOpen ? 'border-zinc-950 bg-white shadow-xl shadow-black/5' : ''} 
                ${value ? 'text-zinc-900' : 'text-gray-400'}`}
            >
                <span className="block truncate">{selected ? selected.name : placeholder}</span>
            </button>

            <div className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 text-gray-400">
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-zinc-950' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        data-lenis-prevent="true"
                        className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-48 overflow-y-auto hide-scrollbar rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {options.length === 0 ? (
                            <div className="p-3 text-center text-sm text-gray-400 select-none cursor-none">No options</div>
                        ) : (
                            options.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => { onChange(String(opt.id)); setIsOpen(false); }}
                                    className={`w-full cursor-none rounded-xl px-4 py-3 text-left text-sm transition-colors ${String(value) === String(opt.id) ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-700 hover:bg-gray-50 font-medium'}`}
                                >
                                    {opt.name}
                                </button>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ==========================================
// تم رنگی و تنظیمات
// ==========================================
const SPORT_THEME: Record<
    SportType,
    { button: string; text: string; badge: string; logoAccent: string }
> = {
    football: {
        button: "bg-emerald-600 hover:bg-emerald-700",
        text: "text-emerald-600",
        badge: "bg-emerald-600",
        logoAccent: "text-emerald-600",
    },
    basketball: {
        button: "bg-orange-500 hover:bg-orange-600",
        text: "text-orange-500",
        badge: "bg-orange-500",
        logoAccent: "text-orange-500",
    },
    volleyball: {
        button: "bg-blue-500 hover:bg-blue-600",
        text: "text-blue-500",
        badge: "bg-blue-500",
        logoAccent: "text-blue-500",
    },
};

const hoverSpring = { type: "spring", stiffness: 400, damping: 30 } as const;
const FALLBACK_LOGO =
    "data:image/svg+xml," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><rect width="56" height="56" rx="14" fill="#f4f4f5"/><circle cx="28" cy="28" r="11" fill="none" stroke="#a1a1aa" stroke-width="2.5"/><path d="M28 17v22M17 28h22" stroke="#a1a1aa" stroke-width="2.5"/></svg>`
    );

const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_LOGO;
};

const filterPanelVariants = {
    collapsed: {
        height: 0,
        opacity: 0,
        transition: { height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.25 } },
    },
    expanded: {
        height: "auto",
        opacity: 1,
        transition: { height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.25 } },
    },
};

const filterListVariants = {
    collapsed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
    expanded: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const filterItemVariants = {
    collapsed: { opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
    expanded: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

export default function MatchesBrowser() {
    const [selectedSport, setSelectedSport] = useState<SportType>("football");
    const [selectedLeague, setSelectedLeague] = useState<string>("All");
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const [hoveredSport, setHoveredSport] = useState<SportType | null>(null);
    const [hoveredLeague, setHoveredLeague] = useState<string | null>(null);

    const [panelClip, setPanelClip] = useState(true);

    const [filters, setFilters] = useState({
        query: "",
        city: "All",
        stadium: "All",
        dateRange: "any",
        tier: "All",
        availability: "All",
        minPrice: "",
        maxPrice: "",
        ticketCount: 1,
    });

    const setF = (patch: Partial<typeof filters>) =>
        setFilters((f) => ({ ...f, ...patch }));

    const theme = SPORT_THEME[selectedSport];

    // ============================================================
    // واکشی داده‌ها از بک‌اند
    // ============================================================
    // ============================================================
    // واکشی داده‌ها از بک‌اند
    // ============================================================
    const { data: responseData, isLoading } = useQuery({
        queryKey: ['available-matches'],
        queryFn: matchService.getAvailableMatches
    });
    
    const dbMatches: Match[] = responseData?.data || [];
    
    // موقتاً این لاگ را گذاشتم تا توی کنسول (F12) دیتای دریافتی رو ببینی
    console.log("🔥 Matches from API:", dbMatches);

    const uniqueCities = ["All", ...Array.from(new Set(dbMatches.map(m => m.location?.city)))].filter(Boolean);
    const uniqueStadiums = ["All", ...Array.from(new Set(dbMatches.map(m => m.location?.stadium)))].filter(Boolean);

    // ============================================================
    // استخراج داینامیک تورنمنت‌ها (ایمن شده)
    // ============================================================
    const dynamicLeagues = ["All", ...Array.from(new Set(
        dbMatches
            .filter(m => {
                const matchSport = m.sport ? String(m.sport).toLowerCase().trim() : "";
                return matchSport === selectedSport.toLowerCase();
            })
            // اگر بک‌اند به جای league اسمش رو گذاشته tournament، اینجا هندل میشه
            .map(m => m.league || (m as any).tournament) 
    ))].filter(Boolean);

    // ============================================================
    // هندلر رزرو + بستن با Esc
    // ============================================================
    const useRouter = require("next/navigation").useRouter; 
    const router = useRouter();
    const handleBook = (match: Match) => {
        router.push(`/booking?matchId=${match.id}`);
    };

    useEffect(() => {
        if (!selectedMatch) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedMatch(null);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [selectedMatch]);

    // ============================================================
    // فیلتر و مرتب‌سازی مسابقات
    // ============================================================
    const filteredMatches = dbMatches
        .filter(match => {
            // رفع باگ ALL با کنترل حروف کوچک و اسپیس‌های اضافی
            const matchSport = (match.sport || "").toLowerCase().trim();
            if (matchSport !== selectedSport.toLowerCase()) return false;

            if (selectedLeague !== "All" && match.league !== selectedLeague) return false;

            if (filters.query.trim() !== "") {
                const q = filters.query.toLowerCase().trim();
                const inTeam = match.teamHome.name.toLowerCase().includes(q) ||
                    match.teamAway.name.toLowerCase().includes(q);
                const inStadium = match.location.stadium.toLowerCase().includes(q);
                const inCity = match.location.city.toLowerCase().includes(q);
                if (!(inTeam || inStadium || inCity)) return false;
            }

            if (filters.city !== "All" && match.location.city !== filters.city) return false;
            if (filters.stadium !== "All" && match.location.stadium !== filters.stadium) return false;

            if (filters.dateRange !== "any") {
                const matchDate = new Date(`${match.date} ${match.time}`);
                const now = new Date();
                if (filters.dateRange === "today") {
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    if (matchDate < today) return false;
                } else if (filters.dateRange === "week") {
                    const weekLater = new Date(now);
                    weekLater.setDate(now.getDate() + 7);
                    if (matchDate < now || matchDate > weekLater) return false;
                } else if (filters.dateRange === "month") {
                    const monthLater = new Date(now);
                    monthLater.setMonth(now.getMonth() + 1);
                    if (matchDate < now || matchDate > monthLater) return false;
                }
            }

            if (filters.minPrice !== "") {
                const min = parseInt(filters.minPrice);
                if (!isNaN(min) && (match.details?.estimatedPrice.min ?? 0) < min) return false;
            }
            if (filters.maxPrice !== "") {
                const max = parseInt(filters.maxPrice);
                if (!isNaN(max) && (match.details?.estimatedPrice.max ?? Infinity) > max) return false;
            }

            if (filters.availability === "Available") {
                if ((match.details?.remainingSeats ?? 0) === 0) return false;
            } else if (filters.availability === "SoldOut") {
                if ((match.details?.remainingSeats ?? 0) > 0) return false;
            }

            return true;
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`).getTime();
            const dateB = new Date(`${b.date} ${b.time}`).getTime();
            return dateA - dateB;
        });

    const handleSportChange = (sport: SportType) => {
        setSelectedSport(sport);
        setSelectedLeague("All");
        setSelectedMatch(null);
    };

    const stadiumPath = "M0,300 L0,0 C400,220 800,220 1200,0 L1200,300 Z";
    const layoutTransition = { type: "spring", stiffness: 260, damping: 30 } as const;

    const textInputClass = "block w-full cursor-none rounded-2xl border-2 border-gray-100 bg-gray-50/50 p-4 pl-12 text-sm font-medium text-zinc-900 outline-none transition-all focus:border-zinc-950 focus:bg-white focus:shadow-xl hover:border-gray-200 hover:bg-white";

    const toggleFilters = () => {
        setPanelClip(true);
        setIsFiltersOpen((v) => !v);
    };

    return (
        <div className="relative z-10 w-full pt-4">

            {/* ========================================== */}
            {/* DYNAMIC ISLAND COMMAND CENTER              */}
            {/* ========================================== */}
            <div className="sticky top-0 z-40 mx-auto w-full max-w-4xl drop-shadow-xl">

                <div className="mx-auto w-[180px] sm:w-[220px] h-8 sm:h-9 bg-white relative z-10 flex items-center justify-center">
                    <svg className="absolute top-0 -left-10 sm:-left-12 w-10 sm:w-12 h-full text-white pointer-events-none" viewBox="0 0 100 100" fill="currentColor" preserveAspectRatio="none">
                        <path d="M100,0 A100,100 0 0 0 0,100 L100,100 Z" />
                    </svg>
                    <svg className="absolute top-0 -right-10 sm:-right-12 w-10 sm:w-12 h-full text-white pointer-events-none" viewBox="0 0 100 100" fill="currentColor" preserveAspectRatio="none">
                        <path d="M0,0 A100,100 0 0 1 100,100 L0,100 Z" />
                    </svg>
                    <h1 className="text-[11px] sm:text-xs font-black tracking-widest uppercase mt-0.5">
                        <span className="text-zinc-950">Upcoming</span>{" "}
                        <span className="text-gray-400 ml-1">Matches</span>
                    </h1>
                </div>

                <motion.div
                    layout
                    transition={{ layout: layoutTransition }}
                    style={{ willChange: "transform, height" }}
                    className="relative z-30 -mt-2 mx-auto w-full rounded-[2rem] bg-white p-4 md:p-6 shadow-sm"
                >
                    <motion.div layout="position" className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="hidden font-black italic tracking-tight text-zinc-950 sm:block text-xl">
                                Pitch<span className={theme.logoAccent}>Side</span>
                            </div>

                            <div className="flex flex-1 justify-center">
                                <div className="flex rounded-2xl bg-gray-100 p-1" onMouseLeave={() => setHoveredSport(null)}>
                                    {(["football", "basketball", "volleyball"] as SportType[]).map((sport) => (
                                        <button
                                            key={sport}
                                            onClick={() => handleSportChange(sport)}
                                            onMouseEnter={() => setHoveredSport(sport)}
                                            className="relative cursor-none px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold capitalize"
                                        >
                                            {hoveredSport === sport && <motion.div layoutId="sport-hover-matches" className="absolute inset-0 rounded-xl bg-white/60" transition={hoverSpring} />}
                                            {selectedSport === sport && <motion.div layoutId="sport-pill-matches" className="absolute inset-0 rounded-xl bg-white shadow-sm" transition={hoverSpring} />}
                                            <span className={`relative z-10 transition-colors ${selectedSport === sport ? "text-zinc-950" : hoveredSport === sport ? "text-zinc-900" : "text-zinc-500"}`}>{sport}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={toggleFilters}
                                className={`hidden sm:flex h-[44px] cursor-none items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 ${isFiltersOpen ? theme.button : "bg-zinc-950"}`}
                            >
                                {isFiltersOpen ? <X size={15} /> : <SlidersHorizontal size={15} />}
                                {isFiltersOpen ? "Close" : "Filters"}
                            </button>

                            <button onClick={toggleFilters} className="flex cursor-none items-center justify-center rounded-2xl bg-zinc-100 p-3 text-zinc-700 transition-colors hover:bg-zinc-200 sm:hidden">
                                {isFiltersOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
                            </button>
                        </div>

                        {/* استفاده از لیستی داینامیک به جای هاردکد برای تورنمنت‌ها */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-gray-100/50" onMouseLeave={() => setHoveredLeague(null)}>
                            {dynamicLeagues.map((league) => {
                                const isActive = selectedLeague === league;
                                return (
                                    <button
                                        key={league}
                                        onClick={() => setSelectedLeague(league)}
                                        onMouseEnter={() => setHoveredLeague(league)}
                                        className={`relative cursor-none rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${isActive ? "text-white" : hoveredLeague === league ? "text-zinc-900" : "text-zinc-500"}`}
                                    >
                                        {hoveredLeague === league && !isActive && <motion.div layoutId="league-hover-matches" className="absolute inset-0 rounded-full bg-gray-100" transition={hoverSpring} />}
                                        {isActive && <motion.div layoutId="league-pill-matches" className="absolute inset-0 rounded-full bg-zinc-950 shadow-md" transition={hoverSpring} />}
                                        <span className="relative z-10">{league}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    <AnimatePresence initial={false}>
                        {isFiltersOpen && (
                            <motion.div
                                key="filter-panel"
                                variants={filterPanelVariants}
                                initial="collapsed"
                                animate="expanded"
                                exit="collapsed"
                                onAnimationStart={() => setPanelClip(true)}
                                onAnimationComplete={(def) => setPanelClip(def !== "expanded")}
                                style={{ overflow: panelClip ? "hidden" : "visible" }}
                                className="flex flex-col gap-6"
                            >
                                <motion.div variants={filterListVariants} initial="collapsed" animate="expanded" exit="collapsed" className="flex flex-col gap-5 pt-5 mt-5 border-t border-gray-100">
                                    <motion.div variants={filterItemVariants} className="flex items-center justify-between">
                                        <h3 className="text-lg font-black text-zinc-950">Advanced Filters</h3>
                                        <button onClick={toggleFilters} className="flex h-8 w-8 cursor-none items-center justify-center rounded-full bg-gray-100 text-zinc-500 hover:bg-gray-200 hover:text-zinc-900">
                                            <X size={18} />
                                        </button>
                                    </motion.div>

                                    <motion.div variants={filterItemVariants} className="relative group">
                                        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-zinc-950" />
                                        <input
                                            value={filters.query}
                                            onChange={(e) => setF({ query: e.target.value })}
                                            placeholder="Search team, city, stadium..."
                                            className={textInputClass}
                                        />
                                    </motion.div>

                                    <motion.div variants={filterItemVariants} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">City</label>
                                            <CustomSelect
                                                icon={MapPin}
                                                placeholder="All Cities"
                                                value={filters.city}
                                                options={uniqueCities.map(v => ({ id: v, name: v }))}
                                                onChange={(val) => setF({ city: val })}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stadium</label>
                                            <CustomSelect
                                                icon={Map}
                                                placeholder="All Stadiums"
                                                value={filters.stadium}
                                                options={uniqueStadiums.map(v => ({ id: v, name: v }))}
                                                onChange={(val) => setF({ stadium: val })}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Date</label>
                                            <CustomSelect
                                                icon={CalendarDays}
                                                placeholder="Anytime"
                                                value={filters.dateRange}
                                                options={[
                                                    { id: 'any', name: 'Anytime' },
                                                    { id: 'today', name: 'Today' },
                                                    { id: 'week', name: 'This Week' },
                                                    { id: 'month', name: 'This Month' }
                                                ]}
                                                onChange={(val) => setF({ dateRange: val })}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Availability</label>
                                            <CustomSelect
                                                icon={Users}
                                                placeholder="All Matches"
                                                value={filters.availability}
                                                options={[
                                                    { id: 'All', name: 'All Matches' },
                                                    { id: 'Available', name: 'Tickets Available' },
                                                    { id: 'SoldOut', name: 'Almost Sold Out' }
                                                ]}
                                                onChange={(val) => setF({ availability: val })}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Price Min</label>
                                            <div className="relative group">
                                                <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                                <input
                                                    placeholder="Min"
                                                    value={filters.minPrice}
                                                    onChange={(e) => setF({ minPrice: e.target.value })}
                                                    className={textInputClass}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Price Max</label>
                                            <div className="relative group">
                                                <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                                <input
                                                    placeholder="Max"
                                                    value={filters.maxPrice}
                                                    onChange={(e) => setF({ maxPrice: e.target.value })}
                                                    className={textInputClass}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Quantity</label>
                                            <div className="relative group">
                                                <Ticket size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-zinc-950" />
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={filters.ticketCount}
                                                    onChange={(e) => setF({ ticketCount: +e.target.value })}
                                                    className={textInputClass}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-end gap-2">
                                            <button
                                                onClick={() => setF({ city: "All", stadium: "All", query: "", dateRange: "any", tier: "All", availability: "All", minPrice: "", maxPrice: "", ticketCount: 1 })}
                                                className="flex w-full cursor-none items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold text-zinc-500 hover:bg-gray-100 transition-colors"
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* ========================================== */}
            {/* ACCORDION‑STYLE MATCH CARDS                */}
            {/* ========================================== */}
            <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-4 px-4 pb-40 min-h-[250vh]">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center font-semibold text-zinc-500"
                    >
                        Loading matches from server...
                    </motion.div>
                ) : filteredMatches.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="py-20 text-center font-semibold text-zinc-500"
                    >
                        No matches found based on your filters.
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout" initial={false}>
                        {filteredMatches.map((match) => {
                            const isSelected = selectedMatch?.id === match.id;
                            
                            // دریافت ظرفیت و صندلی‌های باقیمانده از دیتابیس
                            const capacity = match.details?.capacity || 0;
                            const remaining = match.details?.remainingSeats || 0;
                            
                            // محاسبه صندلی‌های فروخته شده و درصد پر شدن استادیوم
                            const filledSeats = Math.max(0, capacity - remaining);
                            const fillPercent = capacity > 0 ? Math.round((filledSeats / capacity) * 100) : 0;

                            return (
                                <motion.div
                                    key={match.id}
                                    layout
                                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -12, scale: 0.97 }}
                                    transition={{
                                        layout: layoutTransition,
                                        opacity: { duration: 0.22 },
                                        y: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
                                        scale: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
                                    }}
                                    className={`relative z-20 w-full overflow-hidden rounded-[2rem] border border-gray-100 bg-white
                                        ring-1 transition-[box-shadow,ring-color] duration-300
                                        ${isSelected ? "ring-gray-200 shadow-2xl" : "ring-transparent shadow-sm hover:shadow-xl group"}`}
                                >
                                    {/* هدر کارت: تغییر متد onClick برای باز و بسته شدن (Toggle) */}
                                    <div
                                        onClick={() => setSelectedMatch(isSelected ? null : match)}
                                        className="relative z-10 flex cursor-none flex-col items-center justify-between gap-6 p-5 sm:flex-row sm:p-6"
                                    >
                                        <div className="flex flex-1 min-w-0 items-center justify-between gap-4 sm:justify-start sm:gap-8 w-full sm:w-auto">
                                            <div className="flex flex-1 min-w-0 flex-col items-center gap-2 sm:flex-row sm:text-left">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-2">
                                                    <img src={match.teamHome.logo} alt={match.teamHome.name} onError={handleLogoError} className="h-full w-full object-contain drop-shadow-sm" />
                                                </div>
                                                <span className="text-sm font-black text-zinc-950 truncate w-full sm:w-auto">{match.teamHome.name}</span>
                                            </div>

                                            <div className="flex shrink-0 flex-col items-center px-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{match.league}</span>
                                                <span className="text-lg font-black italic text-gray-300">VS</span>
                                            </div>

                                            <div className="flex flex-1 min-w-0 flex-col items-center gap-2 sm:flex-row-reverse sm:text-right">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-2">
                                                    <img src={match.teamAway.logo} alt={match.teamAway.name} onError={handleLogoError} className="h-full w-full object-contain drop-shadow-sm" />
                                                </div>
                                                <span className="text-sm font-black text-zinc-950 truncate w-full sm:w-auto">{match.teamAway.name}</span>
                                            </div>
                                        </div>

                                        <div className="flex w-full shrink-0 flex-col gap-2.5 rounded-2xl bg-gray-50/50 p-4 sm:w-[210px] border border-gray-100">
                                            <div className="flex items-center gap-3 text-xs font-bold text-zinc-600">
                                                <CalendarDays size={14} className="text-zinc-400 shrink-0" />
                                                <span className="whitespace-nowrap">{match.date} <span className="text-gray-300 mx-1">•</span> {match.time}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-bold text-zinc-600">
                                                <MapPin size={14} className="text-zinc-400 shrink-0" />
                                                <span className="truncate">{match.location.stadium}</span>
                                            </div>
                                        </div>

                                        <div className="w-full shrink-0 sm:w-auto">
                                            <motion.button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedMatch(isSelected ? null : match);
                                                }}
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.96 }}
                                                transition={hoverSpring}
                                                className={`flex w-full items-center justify-center gap-2 whitespace-nowrap cursor-none rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-colors ${
                                                    isSelected
                                                        ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                                                        : `text-white ${theme.button}`
                                                }`}
                                            >
                                                {isSelected ? (<><X size={15} /> Close</>) : "Get Tickets"}
                                            </motion.button>
                                        </div>
                                    </div>

                                    <AnimatePresence initial={false}>
                                        {isSelected && (
                                            <motion.div
                                                key="details"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{
                                                    height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                                                    opacity: { duration: 0.3 },
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <div className="relative z-10 flex flex-col gap-4 border-t border-gray-100 p-6 md:p-8">
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                                                            <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                                                <MapPin size={15} /> 
                                                                <span className="text-[10px] font-bold uppercase tracking-wider">Location</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-zinc-900 truncate">{match.location.stadium}</p>
                                                            <p className="text-xs text-zinc-500 font-medium truncate">{match.location.city}, {match.location.province}</p>
                                                        </div>
                                                        <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                                                            <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                                                <Clock size={15} /> 
                                                                <span className="text-[10px] font-bold uppercase tracking-wider">Kickoff</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-zinc-900">{match.date}</p>
                                                            <p className="text-xs text-zinc-500 font-medium">{match.time} Local Time</p>
                                                        </div>
                                                        <div className="flex flex-col gap-2 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 text-zinc-400">
                                                                    <Users size={15} /> 
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Capacity</span>
                                                                </div>
                                                                {/* نمایش درصد فروخته شده */}
                                                                <span className="text-[10px] font-bold text-zinc-400">{fillPercent}% Sold</span>
                                                            </div>
                                                            <div className="flex items-baseline justify-between gap-2">
                                                                <p className="text-sm font-bold text-zinc-900">{capacity.toLocaleString()}</p>
                                                                <p className={`text-xs font-semibold ${theme.text}`}>{remaining.toLocaleString()} Left</p>
                                                            </div>
                                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                                <motion.div
                                                                    className={`h-full rounded-full ${theme.badge}`}
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${fillPercent}%` }}
                                                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 text-zinc-400">
                                                            <Coffee size={15} /> 
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">Stadium Amenities</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {match.details?.amenities.map(amenity => (
                                                                <span key={amenity} className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-bold text-zinc-700">
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <motion.button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); handleBook(match); }}
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        transition={hoverSpring}
                                                        className={`group/book mx-auto mt-2 flex cursor-none items-center justify-center gap-2 rounded-2xl px-16 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-black/5 ${theme.button}`}
                                                    >
                                                        Book Now
                                                        <ArrowRight size={18} className="transition-transform duration-300 group-hover/book:translate-x-1" />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            <div className="pointer-events-none fixed -bottom-20 left-0 w-full z-0 h-48 sm:h-64 md:h-80 overflow-visible flex items-end">
                <svg
                    viewBox="0 0 1200 300"
                    preserveAspectRatio="none"
                    className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[120%] opacity-80 blur-[40px] sm:blur-[60px]"
                >
                    <motion.path
                        d={stadiumPath}
                        fill="rgb(74, 222, 128)"
                        initial={{ opacity: selectedSport === 'football' ? 1 : 0 }}
                        animate={{ opacity: selectedSport === 'football' ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                    />
                    <motion.path
                        d={stadiumPath}
                        fill="rgb(251, 146, 60)"
                        initial={{ opacity: selectedSport === 'basketball' ? 1 : 0 }}
                        animate={{ opacity: selectedSport === 'basketball' ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                    />
                    <motion.path
                        d={stadiumPath}
                        fill="rgb(96, 165, 250)"
                        initial={{ opacity: selectedSport === 'volleyball' ? 1 : 0 }}
                        animate={{ opacity: selectedSport === 'volleyball' ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                    />
                </svg>
            </div>

        </div>
    );
}