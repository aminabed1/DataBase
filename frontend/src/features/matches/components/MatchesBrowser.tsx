"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CalendarDays, Clock, SlidersHorizontal, ChevronDown, Check, X, ArrowRight, Users, Coffee, Ticket } from "lucide-react";
import { MOCK_MATCHES, LEAGUES, SportType, Match } from "../services/match.service";

export default function MatchesBrowser() {
    const [selectedSport, setSelectedSport] = useState<SportType>("football");
    const [selectedLeague, setSelectedLeague] = useState<string>("All");
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // فیلتر کردن مسابقات
    const filteredMatches = MOCK_MATCHES.filter(match => {
        if (match.sport !== selectedSport) return false;
        if (selectedLeague !== "All" && match.league !== selectedLeague) return false;
        return true;
    });

    const handleSportChange = (sport: SportType) => {
        setSelectedSport(sport);
        setSelectedLeague("All");
    };

    // مسیر استادیوم (مقعر به سمت داخل با شکمِ پایین)
    const stadiumPath = "M0,300 L0,0 C400,220 800,220 1200,0 L1200,300 Z";

    return (
        <div className="relative z-10 w-full pt-0">

            {/* ========================================== */}
            {/* DYNAMIC ISLAND COMMAND CENTER              */}
            {/* ========================================== */}
            <div className="sticky top-0 z-40 mx-auto w-full max-w-4xl drop-shadow-xl">

                {/* بخش تب بالا (کد اصلاح شده توسط کاربر) */}
                <div className="mx-auto w-[180px] sm:w-[220px] h-8 sm:h-9 bg-white relative z-10 flex items-center justify-center">
                    {/* فیلت چپ - قوس مماس */}
                    <svg
                        className="absolute top-0 -left-10 sm:-left-12 w-10 sm:w-12 h-full text-white pointer-events-none"
                        viewBox="0 0 100 100"
                        fill="currentColor"
                        preserveAspectRatio="none"
                    >
                        <path d="M100,0 A100,100 0 0 0 0,100 L100,100 Z" />
                    </svg>

                    {/* فیلت راست - قوس مماس */}
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
                                {/* ردیف اول: PitchSide، تب‌های ورزش، دکمه فیلتر */}
                                <div className="flex items-center justify-between gap-4">
                                    <div className="hidden font-black italic tracking-tight text-zinc-950 sm:block text-xl">
                                        Pitch<span className="text-[var(--theme-accent,emerald-700)]">Side</span>
                                    </div>

                                    {/* Sport Tabs */}
                                    <div className="flex flex-1 justify-center">
                                        <div className="flex rounded-2xl bg-gray-100 p-1">
                                            {(["football", "basketball", "volleyball"] as SportType[]).map((sport) => (
                                                <button
                                                    key={sport}
                                                    onClick={() => handleSportChange(sport)}
                                                    className="relative cursor-none px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold capitalize transition-colors"
                                                >
                                                    {selectedSport === sport && (
                                                        <motion.div layoutId="sport-pill-matches" className="absolute inset-0 rounded-xl bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                                    )}
                                                    <span className={`relative z-10 ${selectedSport === sport ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-900"}`}>{sport}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsFiltersOpen(true)}
                                        className="flex cursor-none items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200"
                                    >
                                        <SlidersHorizontal size={18} />
                                        <span className="hidden sm:block">Filters</span>
                                    </button>
                                </div>

                                {/* ردیف دوم: لیگ‌ها */}
                                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-gray-100/50">
                                    {LEAGUES[selectedSport].map((league) => (
                                        <button
                                            key={league}
                                            onClick={() => setSelectedLeague(league)}
                                            className={`cursor-none rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                                                selectedLeague === league
                                                    ? "bg-zinc-950 text-white shadow-md"
                                                    : "bg-transparent text-zinc-500 hover:bg-gray-100 hover:text-zinc-900"
                                            }`}
                                        >
                                            {league}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="filter-view"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black text-zinc-950">Advanced Filters</h3>
                                    <button onClick={() => setIsFiltersOpen(false)} className="flex h-8 w-8 cursor-none items-center justify-center rounded-full bg-gray-100 text-zinc-500 hover:bg-gray-200 hover:text-zinc-900">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Date</label>
                                        <select className="w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-semibold outline-none focus:border-zinc-950 focus:bg-white">
                                            <option>Anytime</option>
                                            <option>This Week</option>
                                            <option>This Month</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Availability</label>
                                        <select className="w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-semibold outline-none focus:border-zinc-950 focus:bg-white">
                                            <option>All Matches</option>
                                            <option>Tickets Available</option>
                                            <option>Almost Sold Out</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <button onClick={() => setIsFiltersOpen(false)} className="flex w-full cursor-none items-center justify-center gap-2 rounded-xl bg-zinc-950 p-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800">
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
            {/* HORIZONTAL MATCH CARDS LIST                */}
            {/* ========================================== */}
            <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-4 px-4 pb-40 relative z-10">
                {filteredMatches.length === 0 ? (
                    <div className="py-20 text-center font-semibold text-zinc-500">
                        No matches found based on your filters.
                    </div>
                ) : (
                    filteredMatches.map((match) => (
                        <motion.div
                            layoutId={`match-card-${match.id}`}
                            key={match.id}
                            className="group flex cursor-none flex-col items-center justify-between gap-6 overflow-hidden rounded-[2rem] border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-xl sm:flex-row sm:p-6"
                        >

                            {/* Teams & Score Section */}
                            <div className="flex flex-1 items-center justify-between gap-4 sm:justify-start sm:gap-8 w-full sm:w-auto">
                                <div className="flex flex-col items-center gap-2 sm:flex-row sm:text-left">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 p-2">
                                        <img src={match.teamHome.logo} alt={match.teamHome.name} className="h-full w-full object-contain drop-shadow-sm" />
                                    </div>
                                    <span className="text-sm font-black text-zinc-950 sm:w-24 sm:truncate">{match.teamHome.name}</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{match.league}</span>
                                    <span className="text-xl font-black italic text-gray-300">VS</span>
                                </div>

                                <div className="flex flex-col items-center gap-2 sm:flex-row-reverse sm:text-right">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 p-2">
                                        <img src={match.teamAway.logo} alt={match.teamAway.name} className="h-full w-full object-contain drop-shadow-sm" />
                                    </div>
                                    <span className="text-sm font-black text-zinc-950 sm:w-24 sm:truncate">{match.teamAway.name}</span>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="flex w-full flex-col gap-3 rounded-2xl bg-gray-50/50 p-4 sm:w-auto sm:min-w-[200px] border border-gray-100">
                                <div className="flex items-center gap-3 text-xs font-bold text-zinc-600">
                                    <CalendarDays size={14} className="text-zinc-400" />
                                    {match.date} <span className="text-gray-300">•</span> {match.time}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-zinc-600">
                                    <MapPin size={14} className="text-zinc-400" />
                                    <span className="truncate">{match.location.stadium}</span>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="w-full sm:w-auto">
                                <button
                                    onClick={() => setSelectedMatch(match)}
                                    className="w-full whitespace-nowrap cursor-none rounded-2xl bg-zinc-950 px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition-transform group-hover:scale-105"
                                >
                                    Get Tickets
                                </button>
                            </div>

                        </motion.div>
                    ))
                )}
            </div>

            {/* ========================================== */}
            {/* DYNAMIC STADIUM BOTTOM CURVE (Gaussian Blur Fade) */}
            {/* ========================================== */}
            <div className="pointer-events-none fixed bottom-0 left-0 w-full z-0 h-48 sm:h-64 md:h-80 overflow-visible flex items-end">
                {/*
                    مقیاس w-[120%] و left-[-10%] برای این است که بلر در لبه‌های کناری صفحه بریده نشود.
                    blur-[50px] باعث می‌شود لبه‌های منحنی (که تیز هستند) کاملاً مه‌آلود شوند و خط مرزی محو شود.
                */}
                <svg
                    viewBox="0 0 1200 300"
                    preserveAspectRatio="none"
                    className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[120%] opacity-80 blur-[40px] sm:blur-[60px]"
                >
                    {/* Football Pastel Green */}
                    <motion.path
                        d={stadiumPath}
                        fill="rgb(74, 222, 128)"
                        initial={{ opacity: selectedSport === 'football' ? 1 : 0 }}
                        animate={{ opacity: selectedSport === 'football' ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                    />
                    {/* Basketball Pastel Orange */}
                    <motion.path
                        d={stadiumPath}
                        fill="rgb(251, 146, 60)"
                        initial={{ opacity: selectedSport === 'basketball' ? 1 : 0 }}
                        animate={{ opacity: selectedSport === 'basketball' ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                    />
                    {/* Volleyball Pastel Blue */}
                    <motion.path
                        d={stadiumPath}
                        fill="rgb(96, 165, 250)"
                        initial={{ opacity: selectedSport === 'volleyball' ? 1 : 0 }}
                        animate={{ opacity: selectedSport === 'volleyball' ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                    />
                </svg>
            </div>

            {/* ========================================== */}
            {/* Expanded Match Modal                       */}
            {/* ========================================== */}
            <AnimatePresence>
                {selectedMatch && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-sm"
                            onClick={() => setSelectedMatch(null)}
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                layoutId={`match-card-${selectedMatch.id}`}
                                className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl pointer-events-auto"
                            >
                                <button
                                    onClick={() => setSelectedMatch(null)}
                                    className="absolute right-6 top-6 z-10 flex h-10 w-10 cursor-none items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-zinc-950"
                                >
                                    <X size={20} />
                                </button>

                                <div className="p-8 md:p-12">
                                    <div className="mb-8 flex justify-center">
                                        <span className="rounded-full bg-zinc-950 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-widest">
                                            {selectedMatch.league}
                                        </span>
                                    </div>

                                    {/* Teams Big */}
                                    <div className="mb-10 flex items-center justify-center gap-8 md:gap-16">
                                        <div className="flex flex-col items-center gap-4">
                                            <img src={selectedMatch.teamHome.logo} alt={selectedMatch.teamHome.name} className="h-24 w-24 object-contain md:h-32 md:w-32 drop-shadow-xl" />
                                            <span className="text-xl font-black text-zinc-900">{selectedMatch.teamHome.name}</span>
                                        </div>
                                        <div className="text-4xl font-black italic text-gray-200">VS</div>
                                        <div className="flex flex-col items-center gap-4">
                                            <img src={selectedMatch.teamAway.logo} alt={selectedMatch.teamAway.name} className="h-24 w-24 object-contain md:h-32 md:w-32 drop-shadow-xl" />
                                            <span className="text-xl font-black text-zinc-900">{selectedMatch.teamAway.name}</span>
                                        </div>
                                    </div>

                                    {/* Detailed Info Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-5 border border-gray-100">
                                            <div className="flex items-center gap-2 text-zinc-400 mb-1"><MapPin size={16}/> <span className="text-xs font-bold uppercase tracking-wider">Location</span></div>
                                            <p className="text-sm font-bold text-zinc-900">{selectedMatch.location.stadium}</p>
                                            <p className="text-xs text-zinc-500 font-medium">{selectedMatch.location.city}, {selectedMatch.location.province}</p>
                                        </div>
                                        <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-5 border border-gray-100">
                                            <div className="flex items-center gap-2 text-zinc-400 mb-1"><Clock size={16}/> <span className="text-xs font-bold uppercase tracking-wider">Kickoff</span></div>
                                            <p className="text-sm font-bold text-zinc-900">{selectedMatch.date}</p>
                                            <p className="text-xs text-zinc-500 font-medium">{selectedMatch.time} Local Time</p>
                                        </div>
                                        <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-5 border border-gray-100">
                                            <div className="flex items-center gap-2 text-zinc-400 mb-1"><Users size={16}/> <span className="text-xs font-bold uppercase tracking-wider">Capacity</span></div>
                                            <p className="text-sm font-bold text-zinc-900">{selectedMatch.details?.capacity.toLocaleString()} Seats</p>
                                            <p className="text-xs font-semibold text-[var(--theme-accent,emerald-600)]">{selectedMatch.details?.remainingSeats.toLocaleString()} Remaining</p>
                                        </div>
                                        <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-5 border border-gray-100">
                                            <div className="flex items-center gap-2 text-zinc-400 mb-1"><Ticket size={16}/> <span className="text-xs font-bold uppercase tracking-wider">Est. Price</span></div>
                                            <p className="text-sm font-bold text-zinc-900">${selectedMatch.details?.estimatedPrice.min} - ${selectedMatch.details?.estimatedPrice.max}</p>
                                            <p className="text-xs text-zinc-500 font-medium">Varies by section</p>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="mb-10">
                                        <div className="flex items-center gap-2 text-zinc-400 mb-3"><Coffee size={16}/> <span className="text-xs font-bold uppercase tracking-wider">Stadium Amenities</span></div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedMatch.details?.amenities.map(amenity => (
                                                <span key={amenity} className="rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-bold text-zinc-700">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button className="group flex w-full cursor-none items-center justify-center gap-2 rounded-2xl bg-zinc-950 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800">
                                        Book Now
                                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}