"use client";

import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CalendarDays, Clock, SlidersHorizontal, Check, X, ArrowRight, Users, Coffee, Search } from "lucide-react";
import { MOCK_MATCHES, LEAGUES, SportType, Match } from "../services/match.service";

// تم رنگی هر ورزش (کلاس‌ها باید کامل نوشته بشن تا Tailwind اون‌ها رو تولید کنه)
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

export default function MatchesBrowser() {
    const [selectedSport, setSelectedSport] = useState<SportType>("football");
    const [selectedLeague, setSelectedLeague] = useState<string>("All");
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const [hoveredSport, setHoveredSport] = useState<SportType | null>(null);
    const [hoveredLeague, setHoveredLeague] = useState<string | null>(null);

    // State فیلترها
    const [filters, setFilters] = useState({
        query: "",          // جستجوی متنی: تیم، شهر، ورزشگاه
        city: "All",
        stadium: "All",
        dateRange: "any",   // any | today | week | month
        tier: "All",        // All | Normal | Special | VIP
        minPrice: "",
        maxPrice: "",
        ticketCount: 1,     // تعداد بلیط درخواستی
        onlyAvailable: false,
    });

    const setF = (patch: Partial<typeof filters>) =>
        setFilters((f) => ({ ...f, ...patch }));

    const theme = SPORT_THEME[selectedSport];

    // فیلتر و مرتب‌سازی مسابقات
    const filteredMatches = MOCK_MATCHES
        .filter(match => {
            if (match.sport !== selectedSport) return false;
            if (selectedLeague !== "All" && match.league !== selectedLeague) return false;

            // فیلتر جستجوی متنی
            if (filters.query.trim() !== "") {
                const q = filters.query.toLowerCase().trim();
                const inTeam = match.teamHome.name.toLowerCase().includes(q) ||
                    match.teamAway.name.toLowerCase().includes(q);
                const inStadium = match.location.stadium.toLowerCase().includes(q);
                const inCity = match.location.city.toLowerCase().includes(q);
                if (!(inTeam || inStadium || inCity)) return false;
            }

            // فیلتر شهر
            if (filters.city !== "All" && match.location.city !== filters.city) return false;

            // فیلتر استادیوم
            if (filters.stadium !== "All" && match.location.stadium !== filters.stadium) return false;

            // فیلتر بازه تاریخ (ساده برای نمونه)
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

            // فیلتر تیر بلیط (در حال حاضر فقط نمونه، چون داده mock ممکن است این فیلد را نداشته باشد)
            // می‌توانید بعداً به mock data اضافه کنید

            // فیلتر قیمت (نمونه)
            if (filters.minPrice !== "") {
                const min = parseInt(filters.minPrice);
                if (!isNaN(min) && (match.details?.estimatedPrice.min ?? 0) < min) return false;
            }
            if (filters.maxPrice !== "") {
                const max = parseInt(filters.maxPrice);
                if (!isNaN(max) && (match.details?.estimatedPrice.max ?? Infinity) > max) return false;
            }

            return true;
        })
        .sort((a, b) => {
            // مرتب‌سازی بر اساس نزدیک‌ترین زمان
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

    return (
        <div className="relative z-10 w-full pt-0">

            {/* ========================================== */}
            {/* DYNAMIC ISLAND COMMAND CENTER              */}
            {/* ========================================== */}
            <div className="sticky top-0 z-40 mx-auto w-full max-w-4xl drop-shadow-xl">

                {/* بخش تب بالا */}
                <div className="mx-auto w-[180px] sm:w-[220px] h-8 sm:h-9 bg-white relative z-10 flex items-center justify-center">
                    <svg
                        className="absolute top-0 -left-10 sm:-left-12 w-10 sm:w-12 h-full text-white pointer-events-none"
                        viewBox="0 0 100 100"
                        fill="currentColor"
                        preserveAspectRatio="none"
                    >
                        <path d="M100,0 A100,100 0 0 0 0,100 L100,100 Z" />
                    </svg>
                    <svg
                        className="absolute top-0 -right-10 sm:-right-12 w-10 sm:w-12 h-full text-white pointer-events-none"
                        viewBox="0 0 100 100"
                        fill="currentColor"
                        preserveAspectRatio="none"
                    >
                        <path d="M0,0 A100,100 0 0 1 100,100 L0,100 Z" />
                    </svg>
                    <h1 className="text-[11px] sm:text-xs font-black tracking-widest uppercase mt-0.5">
                        <span className="text-zinc-950">Upcoming</span>{" "}
                        <span className="text-gray-400 ml-1">Matches</span>
                    </h1>
                </div>

                {/* باکس اصلی هدر */}
                <motion.div
                    layout
                    className="relative z-0 -mt-2 mx-auto w-full overflow-hidden rounded-[2rem] bg-white p-4 md:p-6 shadow-sm"
                >
                    <AnimatePresence mode="wait">
                        {!isFiltersOpen ? (
                            <motion.div
                                key="default-view"
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="hidden font-black italic tracking-tight text-zinc-950 sm:block text-xl">
                                        Pitch<span className={theme.logoAccent}>Side</span>
                                    </div>

                                    <div className="flex flex-1 justify-center">
                                        <div
                                            className="flex rounded-2xl bg-gray-100 p-1"
                                            onMouseLeave={() => setHoveredSport(null)}
                                        >
                                            {(["football", "basketball", "volleyball"] as SportType[]).map((sport) => (
                                                <button
                                                    key={sport}
                                                    onClick={() => handleSportChange(sport)}
                                                    onMouseEnter={() => setHoveredSport(sport)}
                                                    className="relative cursor-none px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold capitalize"
                                                >
                                                    {hoveredSport === sport && (
                                                        <motion.div
                                                            layoutId="sport-hover-matches"
                                                            className="absolute inset-0 rounded-xl bg-white/60"
                                                            transition={hoverSpring}
                                                        />
                                                    )}
                                                    {selectedSport === sport && (
                                                        <motion.div layoutId="sport-pill-matches" className="absolute inset-0 rounded-xl bg-white shadow-sm" transition={hoverSpring} />
                                                    )}
                                                    <span className={`relative z-10 transition-colors ${selectedSport === sport ? "text-zinc-950" : hoveredSport === sport ? "text-zinc-900" : "text-zinc-500"}`}>{sport}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* دکمه فیلتر ساده */}
                                    <button
                                        onClick={() => setIsFiltersOpen(true)}
                                        className="hidden sm:flex h-[44px] cursor-none items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                                    >
                                        <SlidersHorizontal size={15} />
                                        Filters
                                    </button>

                                    {/* دکمه موبایل */}
                                    <button
                                        onClick={() => setIsFiltersOpen(true)}
                                        className="flex cursor-none items-center justify-center rounded-2xl bg-zinc-100 p-3 text-zinc-700 transition-colors hover:bg-zinc-200 sm:hidden"
                                    >
                                        <SlidersHorizontal size={18} />
                                    </button>
                                </div>

                                <div
                                    className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-gray-100/50"
                                    onMouseLeave={() => setHoveredLeague(null)}
                                >
                                    {LEAGUES[selectedSport].map((league) => {
                                        const isActive = selectedLeague === league;
                                        return (
                                            <button
                                                key={league}
                                                onClick={() => setSelectedLeague(league)}
                                                onMouseEnter={() => setHoveredLeague(league)}
                                                className={`relative cursor-none rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                                                    isActive ? "text-white" : hoveredLeague === league ? "text-zinc-900" : "text-zinc-500"
                                                }`}
                                            >
                                                {hoveredLeague === league && !isActive && (
                                                    <motion.div
                                                        layoutId="league-hover-matches"
                                                        className="absolute inset-0 rounded-full bg-gray-100"
                                                        transition={hoverSpring}
                                                    />
                                                )}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="league-pill-matches"
                                                        className="absolute inset-0 rounded-full bg-zinc-950 shadow-md"
                                                        transition={hoverSpring}
                                                    />
                                                )}
                                                <span className="relative z-10">{league}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="filter-view"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                                className="flex flex-col gap-5"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black text-zinc-950">Advanced Filters</h3>
                                    <button onClick={() => setIsFiltersOpen(false)} className="flex h-8 w-8 cursor-none items-center justify-center rounded-full bg-gray-100 text-zinc-500 hover:bg-gray-200 hover:text-zinc-900">
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* جستجوی متنی */}
                                <div className="relative">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        value={filters.query}
                                        onChange={(e) => setF({ query: e.target.value })}
                                        placeholder="Search team, city, stadium..."
                                        className="w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-950 focus:bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">City</label>
                                        <select
                                            value={filters.city}
                                            onChange={(e) => setF({ city: e.target.value })}
                                            className="w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-semibold text-zinc-800 outline-none focus:border-zinc-950 focus:bg-white"
                                        >
                                            <option>All</option>
                                            <option>Tehran</option>
                                            <option>Isfahan</option>
                                            <option>Tabriz</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stadium</label>
                                        <select
                                            value={filters.stadium}
                                            onChange={(e) => setF({ stadium: e.target.value })}
                                            className="w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-semibold text-zinc-800 outline-none focus:border-zinc-950 focus:bg-white"
                                        >
                                            <option>All</option>
                                            <option>Azadi Stadium</option>
                                            <option>Naghsh-e Jahan</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Date</label>
                                        <select
                                            value={filters.dateRange}
                                            onChange={(e) => setF({ dateRange: e.target.value })}
                                            className="w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-semibold text-zinc-800 outline-none focus:border-zinc-950 focus:bg-white"
                                        >
                                            <option value="any">Anytime</option>
                                            <option value="today">Today</option>
                                            <option value="week">This Week</option>
                                            <option value="month">This Month</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Ticket Tier</label>
                                        <select
                                            value={filters.tier}
                                            onChange={(e) => setF({ tier: e.target.value })}
                                            className="w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-semibold text-zinc-800 outline-none focus:border-zinc-950 focus:bg-white"
                                        >
                                            <option>All</option>
                                            <option>Normal</option>
                                            <option>Special</option>
                                            <option>VIP</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Price Range (Toman)</label>
                                        <div className="flex gap-2">
                                            <input
                                                placeholder="Min"
                                                value={filters.minPrice}
                                                onChange={(e) => setF({ minPrice: e.target.value })}
                                                className="w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-semibold text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-950 focus:bg-white"
                                            />
                                            <input
                                                placeholder="Max"
                                                value={filters.maxPrice}
                                                onChange={(e) => setF({ maxPrice: e.target.value })}
                                                className="w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-semibold text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-950 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Quantity</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={filters.ticketCount}
                                            onChange={(e) => setF({ ticketCount: +e.target.value })}
                                            className="w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-semibold text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-950 focus:bg-white"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-end">
                                        <button
                                            onClick={() => setF({ city: "All", stadium: "All", query: "", dateRange: "any", tier: "All", minPrice: "", maxPrice: "", ticketCount: 1 })}
                                            className="flex w-full cursor-none items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold text-zinc-500 hover:bg-gray-100 transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </div>

                                    <div className="flex flex-col justify-end">
                                        <button
                                            onClick={() => setIsFiltersOpen(false)}
                                            className={`flex w-full cursor-none items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold text-white transition-colors ${theme.button}`}
                                        >
                                            <Check size={18} /> Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* ========================================== */}
            {/* ACCORDION‑STYLE MATCH CARDS                */}
            {/* ========================================== */}
            <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-4 px-4 pb-40 relative z-10">
                {filteredMatches.length === 0 ? (
                    <div className="py-20 text-center font-semibold text-zinc-500">
                        No matches found based on your filters.
                    </div>
                ) : (
                    filteredMatches.map((match) => {
                        const isSelected = selectedMatch?.id === match.id;
                        const capacity = match.details?.capacity ?? 0;
                        const remaining = match.details?.remainingSeats ?? 0;
                        const fillPercent = capacity > 0 ? Math.round(((capacity - remaining) / capacity) * 100) : 0;

                        return (
                            <Fragment key={match.id}>

                                {/* لایه نامرئی برای کلیک خارج از کارت باز */}
                                {isSelected && (
                                    <div
                                        className="fixed inset-0 z-30 cursor-none"
                                        onClick={() => setSelectedMatch(null)}
                                    />
                                )}

                                {/* کانتینر اصلی کارت — بدون layout تا جنگ انیمیشن نداشته باشیم */}
                                <div
                                    className={`relative w-full overflow-hidden rounded-[2rem] border border-gray-100 bg-white/90 shadow-sm backdrop-blur-md transition-shadow duration-300 ${
                                        isSelected ? "z-40 ring-1 ring-gray-200 shadow-2xl" : "z-20 hover:bg-white hover:shadow-xl group"
                                    }`}
                                >
                                    {/* ---------- ردیف اصلی (همیشه نمایش داده می‌شه) ---------- */}
                                    <div
                                        onClick={() => setSelectedMatch(isSelected ? null : match)}
                                        className="flex cursor-none flex-col items-center justify-between gap-6 p-5 sm:flex-row sm:p-6"
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
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedMatch(isSelected ? null : match);
                                                }}
                                                className={`w-full whitespace-nowrap cursor-none rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition-all ${
                                                    isSelected
                                                        ? "bg-zinc-200 !text-zinc-500 hover:bg-zinc-300"
                                                        : `group-hover:scale-105 ${theme.button}`
                                                }`}
                                            >
                                                {isSelected ? "Close" : "Get Tickets"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* ---------- جزئیات (آکاردئون) ---------- */}
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
                                                <div className="flex flex-col gap-4 border-t border-gray-100 p-6 md:p-8">
                                                    {/* گرید جزئیات */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                                                            <div className="flex items-center gap-2 text-zinc-400 mb-1"><MapPin size={15}/> <span className="text-[10px] font-bold uppercase tracking-wider">Location</span></div>
                                                            <p className="text-sm font-bold text-zinc-900 truncate">{match.location.stadium}</p>
                                                            <p className="text-xs text-zinc-500 font-medium truncate">{match.location.city}, {match.location.province}</p>
                                                        </div>
                                                        <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                                                            <div className="flex items-center gap-2 text-zinc-400 mb-1"><Clock size={15}/> <span className="text-[10px] font-bold uppercase tracking-wider">Kickoff</span></div>
                                                            <p className="text-sm font-bold text-zinc-900">{match.date}</p>
                                                            <p className="text-xs text-zinc-500 font-medium">{match.time} Local Time</p>
                                                        </div>
                                                        <div className="flex flex-col gap-2 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 text-zinc-400"><Users size={15}/> <span className="text-[10px] font-bold uppercase tracking-wider">Capacity</span></div>
                                                                <span className="text-[10px] font-bold text-zinc-400">{fillPercent}%</span>
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

                                                    {/* امکانات استادیوم */}
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 text-zinc-400"><Coffee size={15}/> <span className="text-[10px] font-bold uppercase tracking-wider">Stadium Amenities</span></div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {match.details?.amenities.map(amenity => (
                                                                <span key={amenity} className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-bold text-zinc-700">
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* دکمه Book Now */}
                                                    <button className={`group mx-auto mt-2 flex cursor-none items-center justify-center gap-2 rounded-2xl px-16 py-4 text-sm font-black uppercase tracking-widest text-white transition-all ${theme.button}`}>
                                                        Book Now
                                                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Fragment>
                        );
                    })
                )}
            </div>

            {/* ========================================== */}
            {/* DYNAMIC STADIUM BOTTOM CURVE               */}
            {/* ========================================== */}
            <div className="pointer-events-none fixed bottom-0 left-0 w-full z-0 h-48 sm:h-64 md:h-80 overflow-visible flex items-end">
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