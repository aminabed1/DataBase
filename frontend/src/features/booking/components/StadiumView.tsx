// E:\Saeed\KNTU\Term 4\DataBase\project\DataBase\frontend\src\features\booking\components\StadiumView.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/client";
import {
    CalendarDays, MapPin, Ticket, ShieldCheck, Armchair, Clock,
    Crown, Star, Leaf, Users, Accessibility, Bird, Flame, ArrowLeft, Loader2, X, CheckCircle2, AlertCircle, User
} from "lucide-react";

const BASE_STADIUM_SECTIONS = [
    { id: "n-lower", name: "North Stand - Lower Tier", path: "M 290 195 L 510 195 L 585 120 L 215 120 Z", defaultCategory: "VVIP" },
    { id: "s-lower", name: "South Stand - Lower Tier", path: "M 290 325 L 510 325 L 585 400 L 215 400 Z", defaultCategory: "VIP" },
    { id: "w-lower", name: "West Stand - Lower Tier", path: "M 285 205 L 285 315 L 205 395 L 205 125 Z", defaultCategory: "Disabled" },
    { id: "e-lower", name: "East Stand - Lower Tier", path: "M 515 205 L 515 315 L 595 395 L 595 125 Z", defaultCategory: "Premium" },
    { id: "n-upper", name: "North Stand - Upper Tier", path: "M 205 105 L 595 105 L 685 15 Q 400 -25 115 15 Z", defaultCategory: "Economy" },
    { id: "s-upper", name: "South Stand - Upper Tier", path: "M 205 415 L 595 415 L 685 505 Q 400 545 115 505 Z", defaultCategory: "Family" },
    { id: "w-upper", name: "West Stand - Upper Tier", path: "M 190 120 L 190 400 L 100 490 Q 60 260 100 30 Z", defaultCategory: "Last Minute" },
    { id: "e-upper", name: "East Stand - Upper Tier", path: "M 610 120 L 610 400 L 700 490 Q 740 260 700 30 Z", defaultCategory: "Early Bird" },
];

const getCategoryStyle = (categoryName: string) => {
    switch (categoryName?.toUpperCase()) {
        case "VVIP": return { icon: Crown, color: "text-amber-600", bgClass: "bg-amber-500", fontClass: "font-[cursive] italic tracking-wider" };
        case "VIP": return { icon: Crown, color: "text-amber-500", bgClass: "bg-amber-400", fontClass: "font-serif italic" };
        case "PREMIUM": return { icon: Star, color: "text-indigo-600", bgClass: "bg-indigo-500", fontClass: "font-[cursive] italic" };
        case "ECONOMY": return { icon: Leaf, color: "text-emerald-600", bgClass: "bg-emerald-500", fontClass: "font-sans" };
        case "FAMILY": return { icon: Users, color: "text-sky-500", bgClass: "bg-sky-400", fontClass: "font-sans" };
        case "DISABLED": return { icon: Accessibility, color: "text-blue-600", bgClass: "bg-blue-500", fontClass: "font-sans" };
        case "EARLY BIRD": return { icon: Bird, color: "text-teal-600", bgClass: "bg-teal-500", fontClass: "font-sans" };
        case "LAST MINUTE": return { icon: Flame, color: "text-red-500", bgClass: "bg-red-500", fontClass: "font-sans uppercase tracking-widest text-sm" };
        default: return { icon: ShieldCheck, color: "text-zinc-600", bgClass: "bg-zinc-500", fontClass: "font-sans" };
    }
};

const breathAnimation = { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } };

export default function StadiumView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const matchId = searchParams.get("matchId");

    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const [actionType, setActionType] = useState<'RESERVE' | 'PAY'>('RESERVE');

    useEffect(() => {
        setSelectedSeats([]);
        setSelectedSection(null);
        setHoveredSection(null);
    }, [matchId]);

    const { data: matchDetails, isLoading, isError } = useQuery({
        queryKey: ['match-details', matchId],
        queryFn: async () => {
            const res = await apiClient.get(`/tickets/${matchId}/details`);
            return res.data.data;
        },
        enabled: !!matchId
    });

    const { data: realMatchSeats = [] } = useQuery({
        queryKey: ['match-seats', matchId],
        queryFn: async () => {
            const res = await apiClient.get(`/matches/${matchId}/seats`);
            return res.data.data;
        },
        enabled: !!matchId,
        refetchInterval: 5000
    });

    const reserveMutation = useMutation({
        mutationFn: async (seatIds: number[]) => {
            const res = await apiClient.post(`/reservations`, { matchSeatIds: seatIds });
            if (res.data && res.data.success === false) throw new Error(res.data.message || "Reservation failed.");
            return res.data; 
        },
        onSuccess: (responseData) => {
            const reservationId = responseData.data.reservationId;
            if (actionType === 'PAY') {
                sessionStorage.setItem("checkout_details", JSON.stringify({
                    match: matchDetails,
                    selectedSeats: selectedSeats
                }));
                router.push(`/booking/payment?reservationId=${reservationId}`);
            } else {
                setToast({ message: "Seats locked successfully! You have 10 minutes to complete payment.", type: 'success' });
                setSelectedSeats([]);
                queryClient.invalidateQueries({ queryKey: ['match-seats', matchId] });
            }
        },
        onError: (err: any) => setToast({ message: err.message || err.response?.data?.message || "Failed to reserve seats.", type: 'error' })
    });

    if (toast) setTimeout(() => setToast(null), 5000);

    const toggleSeatSelection = (seat: any) => {
        if (selectedSeats.find(s => s.id === seat.id)) setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        else setSelectedSeats([...selectedSeats, seat]);
    };

    // اینجا منطق محاسبه ظرفیت و صندلی‌ها رو مستقیماً به realMatchSeats متصل کردیم تا با صفحه matches یکی بشه
    const stadiumSections = useMemo(() => {
        if (realMatchSeats.length === 0) 
            return BASE_STADIUM_SECTIONS.map(s => ({ ...s, available: 0, price: 0, categories: [] }));

        return BASE_STADIUM_SECTIONS.map((section) => {
            // صندلی‌های مربوط به این سکشن را فیلتر می‌کنیم
            const seatsForSection = realMatchSeats.filter((s: any) => s.section === section.id);
            const availableCount = seatsForSection.filter((s: any) => s.status === 'AVAILABLE').length;
            const sampleSeat = seatsForSection.length > 0 ? seatsForSection[0] : null;

            return {
                ...section,
                total: seatsForSection.length || 10,
                available: availableCount,
                price: sampleSeat?.price || 0,
                categories: [{
                    name: sampleSeat?.category || section.defaultCategory, 
                    count: availableCount, 
                    amenities: "Standard"
                }]
            };
        });
    }, [realMatchSeats]);

    const activeSectionData = stadiumSections.find(s => s.id === (selectedSection || hoveredSection));

    const sectionSeats = useMemo(() => {
        if (!selectedSection || !activeSectionData || realMatchSeats.length === 0) return [];
        const filteredSeats = realMatchSeats.filter((s: any) => s.section === selectedSection);
        
        const sorted = filteredSeats.sort((a: any, b: any) => {
            const rowA = parseInt(String(a.row).replace(/\D/g, '')) || 0; 
            const rowB = parseInt(String(b.row).replace(/\D/g, '')) || 0;
            if (rowA !== rowB) return rowA - rowB;
            return (parseInt(a.number) || 0) - (parseInt(b.number) || 0);
        });
        
        return sorted.slice(0, 10);
    }, [selectedSection, activeSectionData, realMatchSeats]);

    const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#E8E9E9]"><Loader2 className="animate-spin" size={48} /></div>;
    if (isError || !matchDetails) return <div className="h-screen flex items-center justify-center bg-[#E8E9E9] flex-col gap-4"><h1 className="text-2xl font-bold">Match not found</h1><button onClick={() => router.push('/matches')} className="px-6 py-2 bg-black text-white rounded-full">Go Back</button></div>;

    return (
        <div className="h-screen overflow-hidden bg-[#E8E9E9] px-4 py-3 md:px-8 md:py-4 font-sans text-zinc-900 relative">
            
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{opacity:0, y:-50}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-50}} 
                        className={`fixed top-10 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-zinc-950 text-white' : 'bg-red-500 text-white'}`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                        {toast.message}
                        <button onClick={() => setToast(null)} className="ml-4 opacity-70 hover:opacity-100"><X size={16}/></button>
                    </motion.div>
                )}
            </AnimatePresence>
                
            <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="absolute top-4 left-4 md:top-8 md:left-8 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/60 backdrop-blur-md border border-zinc-200/50 text-zinc-600 hover:text-zinc-950 hover:bg-white hover:shadow-md transition-all"
                title="Go to Dashboard"
            >
                <User size={18} />
            </button>

            <button 
                type="button"
                onClick={() => router.push('/matches')} 
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-2 bg-white/60 backdrop-blur-md border border-zinc-200/50 px-5 py-2.5 rounded-full text-sm font-bold text-zinc-600 hover:text-zinc-950 hover:bg-white hover:shadow-md transition-all"
            >
                <ArrowLeft size={16} /> Back to Matches
            </button>

            <div className="mx-auto h-full max-w-7xl flex flex-col-reverse lg:flex-row gap-6 lg:gap-8">
                <div className="w-full lg:w-[30%] flex flex-col gap-6 pr-2 min-h-0 overflow-y-auto pb-8 [&::-webkit-scrollbar]:hidden">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-3 border-l-4 border-zinc-900 pl-4 mt-4 shrink-0">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-950">{matchDetails.sport} Match</h1>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-base font-semibold text-zinc-600"><CalendarDays size={18} className="text-zinc-900" /><span>{new Date(matchDetails.datetime).toLocaleDateString()}</span><span className="text-zinc-300">|</span><Clock size={18} className="text-zinc-900" /><span>{new Date(matchDetails.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                            <div className="flex items-center gap-2 text-base font-semibold text-zinc-600"><MapPin size={18} className="text-zinc-900" /><span>{matchDetails.venue}, {matchDetails.venueAddress}</span></div>
                        </div>
                    </motion.div>

                    <div className="mt-4 flex-1 flex flex-col min-h-0">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-5 shrink-0 flex items-center gap-2"><Armchair size={16} /> Section Details</h2>
                        <AnimatePresence mode="wait">
                            {activeSectionData ? (
                                <motion.div key={activeSectionData.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col flex-1 min-h-0 gap-6">
                                    <div className="shrink-0">
                                        <h3 className="text-3xl font-black text-zinc-900 mb-1">{activeSectionData.name}</h3>
                                        <p className="text-base text-zinc-500 font-medium">Starting from: <span className="text-zinc-900 font-bold">${activeSectionData.price}</span></p>
                                    </div>
                                    <div className="flex justify-between items-end pb-1 border-b border-zinc-300/50 shrink-0">
                                        <span className="text-base text-zinc-500 font-medium">Available Seats</span>
                                        <span className={`text-lg font-black ${activeSectionData.available === 0 ? 'text-red-500' : 'text-emerald-600'}`}>{activeSectionData.available === 0 ? 'Sold Out' : activeSectionData.available}</span>
                                    </div>

                                    <div className="flex-1 min-h-0">
                                        <AnimatePresence mode="wait">
                                            {selectedSeats.length > 0 ? (
                                                <motion.div key="selected-seats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm mt-2 flex flex-col h-[calc(100%-1rem)]">
                                                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 shrink-0">
                                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Selected Seats ({selectedSeats.length})</span>
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 mb-4 hide-scrollbar">
                                                        {selectedSeats.map(seat => (
                                                            <div key={seat.id} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 shrink-0">
                                                                <span className="font-bold text-gray-700 flex items-center gap-2"><Armchair size={14}/> {seat.row} - S{seat.number}</span>
                                                                <span className="font-black">${seat.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="shrink-0 mt-auto border-t border-gray-100 pt-3">
                                                        <div className="flex justify-between items-center text-lg font-black mb-4">
                                                            <span>Total Price:</span>
                                                            <span>${totalPrice}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                disabled={reserveMutation.isPending}
                                                                onClick={() => { setActionType('RESERVE'); reserveMutation.mutate(selectedSeats.map(s => s.id)); }} 
                                                                className="w-1/2 border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-50 font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
                                                            >
                                                                {reserveMutation.isPending && actionType === 'RESERVE' ? "Locking..." : "Reserve Only"}
                                                            </button>
                                                            <button 
                                                                disabled={reserveMutation.isPending}
                                                                onClick={() => { setActionType('PAY'); reserveMutation.mutate(selectedSeats.map(s => s.id)); }} 
                                                                className="w-1/2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
                                                            >
                                                                {reserveMutation.isPending && actionType === 'PAY' ? "Redirecting..." : "Reserve & Pay"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-2 flex flex-col gap-5">
                                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Available Ticket Types</span>
                                                    {activeSectionData.categories.map((cat: any, idx: number) => {
                                                        const { icon: CatIcon, color, fontClass } = getCategoryStyle(cat.name);
                                                        return (
                                                            <div key={idx} className="flex items-center justify-between group">
                                                                <div className="flex items-center gap-3"><CatIcon size={22} className={color} /><div className="flex flex-col leading-tight"><span className={`${fontClass} font-bold ${color}`}>{cat.name}</span><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{cat.amenities}</span></div></div>
                                                                <span className="text-sm font-black text-zinc-700 bg-zinc-200/50 px-3 py-1 rounded-full">{cat.count}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col gap-3 opacity-40 mt-4"><Ticket size={36} className="text-zinc-400" /><p className="text-xl font-black text-zinc-900">Select a Block</p><p className="text-sm text-zinc-600 font-medium">Hover over the stadium map to view capacity.</p></div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="w-full lg:w-[70%] flex flex-col items-center justify-start gap-4 min-h-0 pt-4">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-4 w-full shrink-0">
                        <div className="flex flex-col items-center gap-2"><span className="text-sm md:text-xl font-black text-zinc-900 tracking-tight">{matchDetails.hostTeam}</span></div>
                        <span className="text-2xl md:text-3xl font-black italic text-zinc-300/80 tracking-tighter">VS</span>
                        <div className="flex flex-col items-center gap-2"><span className="text-sm md:text-xl font-black text-zinc-900 tracking-tight">{matchDetails.guestTeam}</span></div>
                    </motion.div>

                    <div className="w-full flex-1 min-h-0 flex items-center justify-center px-2 relative mt-4">
                        <AnimatePresence mode="wait">
                            {!selectedSection ? (
                                <motion.div key="stadium" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full h-full flex items-center justify-center">
                                    <svg viewBox="0 -20 800 560" className="w-full h-full max-h-[65vh] object-contain" style={{ filter: "drop-shadow(0 20px 20px rgb(0 0 0 / 0.1))" }}>
                                        <g className="pitch"><rect x="300" y="210" width="200" height="100" rx="4" fill="#a7f3d0" stroke="#10b981" strokeWidth="2" opacity="0.5" /><circle cx="400" cy="260" r="20" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5" /></g>
                                        {stadiumSections.map((section) => {
                                            const isHovered = hoveredSection === section.id;
                                            const isSoldOut = section.available === 0;
                                            let fillColor = isSoldOut ? "#fca5a5" : (isHovered ? "#10b981" : "#d4d4d8");
                                            let strokeColor = isSoldOut ? "#fef2f2" : (isHovered ? "#047857" : "#ffffff");
                                            return (
                                                <motion.path key={section.id} d={section.path} fill={fillColor} stroke={strokeColor} strokeWidth={isHovered ? "4" : "2"} onMouseEnter={() => setHoveredSection(section.id)} onMouseLeave={() => setHoveredSection(null)} onClick={() => { if (!isSoldOut) { setSelectedSection(section.id); setHoveredSection(null); } }} className="transition-colors duration-300 cursor-pointer" whileHover={!isSoldOut ? { scale: 1.02 } : {}} style={{ transformOrigin: "center" }} />
                                            );
                                        })}
                                    </svg>
                                </motion.div>
                            ) : (
                                <motion.div key="seatgrid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 flex flex-col relative max-h-full overflow-y-auto hide-scrollbar">
                                    <button onClick={() => {setSelectedSection(null); setSelectedSeats([]);}} className="absolute top-6 left-6 p-2 rounded-full hover:bg-zinc-100 flex items-center gap-2 text-sm font-bold text-zinc-500"><ArrowLeft size={18} /> Back</button>
                                    <div className="text-center mb-10 mt-2"><h3 className="text-2xl font-black text-zinc-900">Select Your Seats</h3></div>
                                    <div className="w-full h-8 bg-emerald-50 rounded-t-2xl border-t-4 border-emerald-400 flex items-center justify-center mb-8 shrink-0"><span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Pitch Direction</span></div>
                                    
                                    <div className="grid grid-cols-5 gap-4 place-items-center mb-8 px-4">
                                        {sectionSeats.map((seat: any) => {
                                            const isSelected = selectedSeats.some(s => s.id === seat.id);
                                            const isAvailable = seat.status === "AVAILABLE";
                                            const isLocked = seat.status === "RESERVED"; 
                                            
                                            const bgClass = getCategoryStyle(seat.category).bgClass;
                                            
                                            let seatAppearance = "opacity-30 cursor-not-allowed bg-zinc-200"; 
                                            if (isAvailable) seatAppearance = bgClass;
                                            else if (isLocked) seatAppearance = "bg-indigo-500 cursor-not-allowed opacity-90"; 

                                            return (
                                                <motion.button
                                                    key={seat.id} disabled={!isAvailable} onClick={() => toggleSeatSelection(seat)}
                                                    animate={isLocked ? breathAnimation : {}}
                                                    whileHover={isAvailable ? { scale: 1.1, y: -2 } : {}} 
                                                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                                                    className={`relative flex flex-col items-center justify-center w-14 h-16 rounded-t-xl rounded-b-md transition-all ${seatAppearance} ${isSelected ? "ring-4 ring-offset-2 ring-zinc-900 shadow-lg" : "shadow-sm"}`}
                                                >
                                                    <div className={`w-10 h-8 mt-auto mb-1 rounded-sm ${!isAvailable && !isLocked ? 'bg-zinc-300' : 'bg-white/20'}`} />
                                                    {isLocked && <div className="absolute -top-2 -right-2 bg-zinc-900 text-white p-1 rounded-full shadow-md z-10"><Clock size={10} /></div>}
                                                </motion.button>
                                            );
                                        })}
                                        {sectionSeats.length === 0 && (
                                            <div className="col-span-5 text-gray-400 text-sm font-medium py-10">No seats available in this section.</div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-center gap-6 pt-6 border-t border-zinc-100">
                                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-zinc-200 opacity-50" /><span className="text-xs font-bold text-zinc-500">Sold</span></div>
                                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-emerald-500" /><span className="text-xs font-bold text-zinc-500">Available</span></div>
                                        <div className="flex items-center gap-2">
                                            <motion.div animate={breathAnimation} className="w-4 h-4 rounded-sm bg-indigo-500 relative flex items-center justify-center"><Clock size={10} className="text-white absolute" /></motion.div>
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