"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CalendarDays, Clock, Users, Coffee, Ticket, X, ArrowRight } from "lucide-react";
import { MOCK_MATCHES, LEAGUES, SportType, Match } from "../services/match.service";

export default function MatchesBrowser() {
    const [selectedSport, setSelectedSport] = useState<SportType>("football");
    const [selectedLeague, setSelectedLeague] = useState<string>("All");
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    // فیلتر کردن مسابقات بر اساس ورزش و لیگ
    const filteredMatches = MOCK_MATCHES.filter(match => {
        if (match.sport !== selectedSport) return false;
        if (selectedLeague !== "All" && match.league !== selectedLeague) return false;
        return true;
    });

    const handleSportChange = (sport: SportType) => {
        setSelectedSport(sport);
        setSelectedLeague("All"); // ریست کردن لیگ با تغییر ورزش
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">

            {/* 1. Header & Sport Selector */}
            <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-zinc-950 uppercase italic">Upcoming Matches</h1>
                    <p className="mt-2 text-zinc-500 font-medium">Find and book tickets for the best games around the world.</p>
                </div>

                <div className="flex rounded-2xl bg-white p-1.5 shadow-sm border border-gray-100">
                    {(["football", "basketball", "volleyball"] as SportType[]).map((sport) => (
                        <button
                            key={sport}
                            onClick={() => handleSportChange(sport)}
                            className="relative px-6 py-2.5 text-sm font-bold capitalize cursor-none transition-colors"
                        >
                            {selectedSport === sport && (
                                <motion.div
                                    layoutId="sport-pill"
                                    className="absolute inset-0 rounded-xl bg-zinc-950 shadow-md"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className={`relative z-10 ${selectedSport === sport ? "text-white" : "text-zinc-500 hover:text-zinc-900"}`}>
                                {sport}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. League Filters */}
            <div className="mb-10 flex flex-wrap gap-3">
                {LEAGUES[selectedSport].map((league) => (
                    <button
                        key={league}
                        onClick={() => setSelectedLeague(league)}
                        className={`cursor-none rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
                            selectedLeague === league
                                ? "border-zinc-950 bg-zinc-950 text-white shadow-md"
                                : "border-gray-200 bg-white/50 text-zinc-600 hover:border-gray-300 hover:bg-white"
                        }`}
                    >
                        {league}
                    </button>
                ))}
            </div>

            {/* 3. Matches Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMatches.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-zinc-500">
                        <p>No matches found for this league at the moment.</p>
                    </div>
                ) : (
                    filteredMatches.map((match) => (
                        <motion.div
                            layoutId={`card-${match.id}`}
                            key={match.id}
                            onClick={() => setSelectedMatch(match)}
                            className="group relative cursor-none overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl"
                        >
                            {/* League Badge */}
                            <div className="mb-6 flex justify-between items-center">
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    {match.league}
                                </span>
                            </div>

                            {/* Teams */}
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex flex-col items-center gap-2">
                                    <img src={match.teamHome.logo} alt={match.teamHome.name} className="h-16 w-16 object-contain" />
                                    <span className="text-sm font-bold text-zinc-900">{match.teamHome.name}</span>
                                </div>
                                <div className="text-2xl font-black italic text-gray-300">VS</div>
                                <div className="flex flex-col items-center gap-2">
                                    <img src={match.teamAway.logo} alt={match.teamAway.name} className="h-16 w-16 object-contain" />
                                    <span className="text-sm font-bold text-zinc-900">{match.teamAway.name}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-3 rounded-2xl bg-gray-50 p-4">
                                <div className="flex items-center gap-3 text-sm text-zinc-600 font-medium">
                                    <CalendarDays size={16} className="text-zinc-400" />
                                    {match.date} <span className="mx-1">•</span> {match.time}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-600 font-medium">
                                    <MapPin size={16} className="text-zinc-400" />
                                    <span className="truncate">{match.location.stadium}, {match.location.city}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* 4. Expanded Match Modal (AnimatePresence for layout transition) */}
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
                                layoutId={`card-${selectedMatch.id}`}
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
                                            <p className="text-xs font-semibold text-emerald-600">{selectedMatch.details?.remainingSeats.toLocaleString()} Remaining</p>
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
                                                <span key={amenity} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button className="group flex w-full cursor-none items-center justify-center gap-2 rounded-2xl bg-zinc-950 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800">
                                        Select Seats
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