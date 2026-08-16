"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, ShieldCheck, CreditCard, Wallet,
    CheckCircle2, Lock, Building2, ChevronDown,
    Ban, Banknote, Clock, ChevronLeft, ChevronRight, Armchair,
    Crown, Star, Leaf, Users, Accessibility, Bird, Flame, Tag, Check, AlertCircle
} from "lucide-react";

// ==========================================
// Category Styles Dictionary
// ==========================================
const getCategoryStyle = (categoryName: string) => {
    switch (categoryName) {
        case "VVIP":
            return { icon: Crown, color: "text-amber-600", bgClass: "bg-amber-500", fontClass: "font-semibold text-sm" };
        case "VIP":
            return { icon: Crown, color: "text-amber-500", bgClass: "bg-amber-400", fontClass: "font-semibold text-sm" };
        case "Premium":
            return { icon: Star, color: "text-indigo-600", bgClass: "bg-indigo-500", fontClass: "font-semibold text-sm" };
        case "Economy":
            return { icon: Leaf, color: "text-emerald-600", bgClass: "bg-emerald-500", fontClass: "font-semibold text-sm" };
        case "Family":
            return { icon: Users, color: "text-sky-500", bgClass: "bg-sky-400", fontClass: "font-semibold text-sm" };
        case "Disabled":
            return { icon: Accessibility, color: "text-blue-600", bgClass: "bg-blue-500", fontClass: "font-semibold text-sm" };
        case "Early Bird":
            return { icon: Bird, color: "text-teal-600", bgClass: "bg-teal-500", fontClass: "font-semibold text-sm" };
        case "Last Minute":
            return { icon: Flame, color: "text-red-500", bgClass: "bg-red-500", fontClass: "font-semibold text-sm" };
        default:
            return { icon: ShieldCheck, color: "text-zinc-600", bgClass: "bg-zinc-500", fontClass: "font-semibold text-sm" };
    }
};

// ==========================================
// Ticket Swap Animation Variants
// ==========================================
const ticketVariants = {
    enter: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? 70 : -70,
        rotateY: dir > 0 ? -10 : 10,
        rotate: dir > 0 ? 2.5 : -2.5,
        scale: 0.94,
    }),
    center: {
        opacity: 1,
        x: 0,
        rotateY: 0,
        rotate: 0,
        scale: 1,
    },
    exit: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? -70 : 70,
        rotateY: dir > 0 ? 10 : -10,
        rotate: dir > 0 ? -2.5 : 2.5,
        scale: 0.94,
    }),
};

// ==========================================
// Mock Data
// ==========================================
const MOCK_CHECKOUT = {
    match: {
        tournament: "Champions Final",
        homeTeam: { name: "Esteghlal", code: "EST" },
        awayTeam: { name: "Persepolis", code: "PRS" },
        venue: "Azadi Stadium, Tehran",
        date: "2026-08-15",
        time: "18:00",
    },
    selectedSeats: [
        {
            id: 101,
            section: "East Stand - Lower Tier",
            gate: "Gate 08 · E",
            row: 1,
            number: 3,
            category: "Early Bird",
            amenities: "Discounted Special Access",
            price: 150,
            code: "TCK-EST-PRS-R1-S3"
        },
        {
            id: 102,
            section: "North Stand - Lower Tier",
            gate: "Gate 12 · B",
            row: 2,
            number: 4,
            category: "VVIP",
            amenities: "Parking, Food, Lounge Access",
            price: 250,
            code: "TCK-EST-PRS-R2-S4"
        }
    ],
    wallet: { id: "wallet", name: "Wallet Balance", balance: 650.00, status: "ALLOWED" },
    onSite: { id: "cash", name: "Pay at Stadium (Cash / POS)", status: "NOT_ALLOWED" },
    onlineGateways: [
        { id: "saman", name: "Saman Gateway", desc: "Online Banking & Debit Cards", status: "ALLOWED" },
        { id: "pasargad", name: "Pasargad Gateway", desc: "Instant Secure Payment", status: "ALLOWED" },
        { id: "zarinpal", name: "Zarinpal Gateway", desc: "Fast Checkout", status: "ALLOWED" },
        { id: "melli_direct", name: "Melli Bank Direct", desc: "Corporate Gateway", status: "NOT_ALLOWED" },
    ]
};

export default function PaymentView() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState<string>("wallet");
    const [isGatewaysOpen, setIsGatewaysOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    const [activeTicketIdx, setActiveTicketIdx] = useState(0);
    const [direction, setDirection] = useState(0);

    const [couponCode, setCouponCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [couponSuccess, setCouponSuccess] = useState(false);

    const [timeLeft, setTimeLeft] = useState(600);

    useEffect(() => {
        if (timeLeft <= 0) {
            router.push("/booking");
            return;
        }
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft, router]);

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    const allowedGateways = MOCK_CHECKOUT.onlineGateways.filter(g => g.status === "ALLOWED");

    const subtotal = MOCK_CHECKOUT.selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const totalAmount = Math.max(0, subtotal - discountAmount);

    const currentTicket = MOCK_CHECKOUT.selectedSeats[activeTicketIdx];
    const currentCatStyle = getCategoryStyle(currentTicket.category);
    const CatIcon = currentCatStyle.icon;

    const goToTicket = (nextIdx: number) => {
        if (nextIdx === activeTicketIdx) return;
        setDirection(nextIdx > activeTicketIdx ? 1 : -1);
        setActiveTicketIdx(nextIdx);
    };

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        setCouponError(null);

        const earlyBirdSeats = MOCK_CHECKOUT.selectedSeats.filter(s => s.category === "Early Bird");

        if (earlyBirdSeats.length === 0) {
            setCouponError("Discounts are exclusively available for Early Bird seats.");
            return;
        }

        if (couponCode.trim().toUpperCase() === "EARLY20" || couponCode.trim().toUpperCase() === "PITCHSIDE") {
            const calculatedDiscount = earlyBirdSeats.length * 20;
            setDiscountAmount(calculatedDiscount);
            setCouponSuccess(true);
        } else {
            setCouponError("Invalid discount code. Try 'EARLY20'");
        }
    };

    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsPaid(true);
        }, 1800);
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#FCFCFA] text-[#15151A] px-4 md:px-8 py-3.5 font-sans flex flex-col justify-between relative selection:bg-emerald-500 selection:text-white cursor-none select-none">

            {/* Static Pastel Aurora Blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                <div className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full blur-[80px] bg-emerald-200/50" />
                <div className="absolute -bottom-20 -right-20 h-[550px] w-[550px] rounded-full blur-[90px] bg-teal-200/50" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[350px] w-[350px] rounded-full blur-[100px] bg-green-100/60" />
                <div className="absolute inset-0 bg-[radial-gradient(#15151a_1px,transparent_1px)] opacity-[0.03] [background-size:24px_24px]" />
            </div>

            {/* Top Bar Navigation */}
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-20 shrink-0">
                <button
                    onClick={() => router.push("/booking")}
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-all cursor-none shadow-sm border border-zinc-100"
                >
                    <ArrowLeft size={15} /> Back to Seat Selection
                </button>
                <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/80 backdrop-blur-md px-4 py-1.5 rounded-full font-medium shadow-sm border border-emerald-100/60">
                    <Clock size={13} className="text-emerald-600 animate-pulse" />
                    <span>Lock expires in: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                </div>
            </div>

            {/* Main Stage */}
            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center flex-1 min-h-0 py-1 z-10">

                {/* LEFT COLUMN: Payment Panel */}
                <div className="lg:col-span-5 flex flex-col gap-3 relative z-10">
                    <div className="bg-white/90 backdrop-blur-xl rounded-[24px] px-6 lg:px-7 py-5 shadow-[0_10px_35px_rgba(20,20,25,0.03)] border border-zinc-100/80 relative">

                        <div className="mb-4">
                            <span className="text-[11px] text-emerald-700 font-medium">Checkout Details</span>
                            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mt-0.5">Select Payment Method</h2>
                        </div>

                        <div className="flex flex-col gap-2.5 relative">

                            {/* Wallet Card */}
                            <div
                                onClick={() => {
                                    setSelectedMethod("wallet");
                                    setIsGatewaysOpen(false);
                                }}
                                className={`
                                    flex items-center justify-between p-3 rounded-xl transition-all cursor-none
                                    ${selectedMethod === "wallet"
                                    ? "bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600/30"
                                    : "bg-[#F3F3F1]/60 hover:bg-[#F3F3F1]"}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-lg ${selectedMethod === "wallet" ? "bg-emerald-700 text-white" : "bg-white text-zinc-700 shadow-sm"}`}>
                                        <Wallet size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-zinc-900">{MOCK_CHECKOUT.wallet.name}</span>
                                        <span className="text-[11px] text-emerald-700 font-medium">
                                            Available: ${MOCK_CHECKOUT.wallet.balance.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedMethod === "wallet" ? "bg-emerald-700" : "border border-zinc-300"}`}>
                                    {selectedMethod === "wallet" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                            </div>

                            {/* Pay at Stadium (Disabled) */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F3F1]/40 opacity-55 cursor-none">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-lg bg-zinc-200 text-zinc-400">
                                        <Banknote size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-medium text-zinc-500 line-through">{MOCK_CHECKOUT.onSite.name}</span>
                                            <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                                                <Ban size={8} /> Disabled
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-zinc-400 font-normal">Suspended for high-demand matches.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Online Gateways Dropdown */}
                            <div className="relative">
                                <div
                                    onClick={() => setIsGatewaysOpen(!isGatewaysOpen)}
                                    className={`
                                        flex items-center justify-between p-3 rounded-xl transition-all cursor-none
                                        ${selectedMethod !== "wallet" && selectedMethod !== "cash"
                                        ? "bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600/30"
                                        : "bg-[#F3F3F1]/60 hover:bg-[#F3F3F1]"}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-lg ${selectedMethod !== "wallet" && selectedMethod !== "cash" ? "bg-emerald-700 text-white" : "bg-white text-zinc-700 shadow-sm"}`}>
                                            <CreditCard size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-zinc-900">Online Gateways</span>
                                            <span className="text-[11px] text-zinc-500 font-normal">
                                                {selectedMethod !== "wallet" && selectedMethod !== "cash"
                                                    ? `Active: ${allowedGateways.find(g => g.id === selectedMethod)?.name}`
                                                    : "Select Saman, Pasargad, Zarinpal..."}
                                            </span>
                                        </div>
                                    </div>
                                    <motion.div animate={{ rotate: isGatewaysOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                        <ChevronDown size={15} className="text-zinc-500" />
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {isGatewaysOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 4, scale: 1 }}
                                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 right-0 z-50 bg-white/95 backdrop-blur-xl rounded-xl p-1.5 shadow-xl flex flex-col gap-1 ring-1 ring-black/5"
                                        >
                                            {allowedGateways.map((gateway) => {
                                                const isGatewaySelected = selectedMethod === gateway.id;
                                                return (
                                                    <div
                                                        key={gateway.id}
                                                        onClick={() => {
                                                            setSelectedMethod(gateway.id);
                                                            setIsGatewaysOpen(false);
                                                        }}
                                                        className={`
                                                            flex items-center justify-between p-2.5 rounded-lg cursor-none transition-all
                                                            ${isGatewaySelected
                                                            ? "bg-emerald-50/80 text-zinc-900 font-medium"
                                                            : "hover:bg-zinc-50 text-zinc-700"}
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <Building2 size={14} className={isGatewaySelected ? "text-emerald-700" : "text-zinc-400"} />
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium">{gateway.name}</span>
                                                                <span className="text-[10px] text-zinc-400">{gateway.desc}</span>
                                                            </div>
                                                        </div>
                                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isGatewaySelected ? "bg-emerald-700" : "border border-zinc-300"}`}>
                                                            {isGatewaySelected && <div className="w-1 h-1 rounded-full bg-white" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>

                        {/* Early Bird Promo Box */}
                        <div className="mt-3.5">
                            <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                <div className="relative flex-1">
                                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="text"
                                        placeholder="Early Bird Promo (e.g. EARLY20)"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={couponSuccess}
                                        className="w-full bg-[#F3F3F1]/70 rounded-xl pl-8 pr-3 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 uppercase outline-none focus:ring-1 focus:ring-emerald-700 transition-all disabled:opacity-60 cursor-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={couponSuccess || !couponCode}
                                    className="bg-zinc-900 hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-xl transition-all disabled:opacity-40 cursor-none"
                                >
                                    {couponSuccess ? <Check size={13} /> : "Apply"}
                                </button>
                            </form>

                            {couponError && (
                                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-1.5 pl-1">
                                    <AlertCircle size={11} /> {couponError}
                                </p>
                            )}
                            {couponSuccess && (
                                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1.5 pl-1">
                                    <CheckCircle2 size={11} /> Promo code applied (-${discountAmount}.00)
                                </p>
                            )}
                        </div>

                        {/* Order Summary Breakdown */}
                        <div className="mt-3.5 flex flex-col gap-1.5 bg-[#F3F3F1]/40 rounded-xl p-3.5">
                            <div className="flex justify-between text-xs text-zinc-500">
                                <span>Selected Seats ({MOCK_CHECKOUT.selectedSeats.length}x)</span>
                                <span className="font-semibold text-zinc-900">${subtotal}.00</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-xs text-emerald-700 font-medium">
                                    <span>Early Bird Discount</span>
                                    <span>-${discountAmount}.00</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xs text-zinc-500">
                                <span>Platform Fee</span>
                                <span className="font-medium text-emerald-700">Free</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-semibold text-zinc-900 pt-1 border-t border-zinc-200/40">
                                <span>Total Amount</span>
                                <span className="text-lg text-emerald-700 font-bold">${totalAmount}.00</span>
                            </div>
                        </div>

                        {/* Payment CTA */}
                        <button
                            disabled={isProcessing || isPaid}
                            onClick={handlePay}
                            className="w-full mt-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 rounded-xl shadow-[0_4px_16px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center gap-2 cursor-none disabled:opacity-50 text-xs tracking-wide"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : isPaid ? (
                                <>
                                    <CheckCircle2 size={15} className="text-emerald-300" />
                                    <span>Payment Confirmed</span>
                                </>
                            ) : (
                                <>
                                    <Lock size={13} />
                                    <span>Confirm & Pay ${totalAmount}.00</span>
                                </>
                            )}
                        </button>

                        {/* Security Note Inside Card */}
                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 mt-2.5 font-normal">
                            <ShieldCheck size={13} className="text-emerald-700" />
                            <span>256-Bit Encrypted Secure Checkout</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Ticket Card Viewer */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center relative -translate-y-3 translate-x-4">

                    {/* Multi-ticket Switcher Controls */}
                    {MOCK_CHECKOUT.selectedSeats.length > 1 && (
                        <div className="w-full max-w-[530px] flex items-center justify-between mb-3 px-2">
                            <span className="text-xs font-medium text-zinc-600 flex items-center gap-1.5">
                                <Armchair size={14} className="text-emerald-700" />
                                Ticket {activeTicketIdx + 1} of {MOCK_CHECKOUT.selectedSeats.length}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => goToTicket(Math.max(0, activeTicketIdx - 1))}
                                    disabled={activeTicketIdx === 0}
                                    className="p-1.5 rounded-lg bg-white text-zinc-700 hover:bg-zinc-50 active:scale-95 disabled:opacity-30 disabled:cursor-none shadow-sm transition-all cursor-none"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => goToTicket(Math.min(MOCK_CHECKOUT.selectedSeats.length - 1, activeTicketIdx + 1))}
                                    disabled={activeTicketIdx === MOCK_CHECKOUT.selectedSeats.length - 1}
                                    className="p-1.5 rounded-lg bg-white text-zinc-700 hover:bg-zinc-50 active:scale-95 disabled:opacity-30 disabled:cursor-none shadow-sm transition-all cursor-none"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    <motion.div
                        animate={{ y: [-4, 4, -4] }}
                        transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
                        className="w-full max-w-[530px] relative"
                        style={{ perspective: 1400 }}
                    >
                        {/* Layer Stack Behind Card */}
                        {MOCK_CHECKOUT.selectedSeats.length > 1 && (
                            <div className="absolute inset-0 bg-white/70 rounded-[28px] translate-y-2.5 scale-[0.96] shadow-sm -z-10" />
                        )}

                        {/* Top Pill Badge */}
                        <div className="absolute -top-3.5 left-8 z-20 bg-white rounded-full px-3.5 py-1 text-[11px] font-medium flex items-center gap-2 shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-zinc-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-semibold text-zinc-800">Hold Confirmed</span>
                        </div>

                        {/* Ticket Card Body */}
                        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                            <motion.div
                                key={currentTicket.id}
                                custom={direction}
                                variants={ticketVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 320, damping: 30, mass: 0.8 },
                                    rotateY: { type: "spring", stiffness: 320, damping: 30 },
                                    rotate: { type: "spring", stiffness: 320, damping: 30 },
                                    scale: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                                    opacity: { duration: 0.18 },
                                }}
                                className="w-full bg-white/95 backdrop-blur-xl rounded-[28px] p-7 shadow-[0_30px_70px_-25px_rgba(20,20,25,0.08)] border border-zinc-100/80 relative overflow-hidden transform-gpu [transform-style:preserve-3d] [backface-visibility:hidden]"
                            >

                                {/* Header Status */}
                                <div className="flex justify-between items-center mt-1 mb-5">
                                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-md">
                                        {MOCK_CHECKOUT.match.tournament}
                                    </span>

                                    <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1 rounded-xl shadow-sm border border-zinc-100">
                                        <CatIcon size={16} className={currentCatStyle.color} />
                                        <span className={`${currentCatStyle.fontClass} ${currentCatStyle.color}`}>
                                            {currentTicket.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Matchup Teams */}
                                <div className="flex items-center justify-between my-6">
                                    <div className="flex flex-col items-center gap-2.5 w-[38%]">
                                        <div className="w-20 h-20 rounded-2xl bg-[#F3F3F1] flex items-center justify-center text-2xl font-bold text-zinc-900 shadow-inner">
                                            {MOCK_CHECKOUT.match.homeTeam.code}
                                        </div>
                                        <span className="font-semibold text-sm text-center text-zinc-900">{MOCK_CHECKOUT.match.homeTeam.name}</span>
                                    </div>

                                    <div className="text-xl font-bold text-zinc-400">VS</div>

                                    <div className="flex flex-col items-center gap-2.5 w-[38%]">
                                        <div className="w-20 h-20 rounded-2xl bg-[#F3F3F1] flex items-center justify-center text-2xl font-bold text-zinc-900 shadow-inner">
                                            {MOCK_CHECKOUT.match.awayTeam.code}
                                        </div>
                                        <span className="font-semibold text-sm text-center text-zinc-900">{MOCK_CHECKOUT.match.awayTeam.name}</span>
                                    </div>
                                </div>

                                {/* Perforation Divider */}
                                <div className="relative my-6 -mx-7 border-t border-dashed border-zinc-200 flex items-center justify-between">
                                    <div className="w-6 h-6 rounded-full bg-[#FCFCFA] -translate-x-3 -translate-y-3" />
                                    <div className="w-6 h-6 rounded-full bg-[#FCFCFA] translate-x-3 -translate-y-3" />
                                </div>

                                {/* Seat Metadata */}
                                <div className="grid grid-cols-3 gap-4 pt-1">
                                    <div>
                                        <div className="text-[11px] text-zinc-400 font-medium mb-1">Venue</div>
                                        <div className="text-sm font-semibold text-zinc-900 truncate">{MOCK_CHECKOUT.match.venue}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-zinc-400 font-medium mb-1">Seat / Sec</div>
                                        <div className="text-sm font-semibold text-emerald-800">R{currentTicket.row} · S{currentTicket.number}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-zinc-400 font-medium mb-1">Kickoff In</div>
                                        <div className="flex gap-1.5">
                                            <div className="bg-[#F3F3F1] rounded-md px-2 py-1 text-center min-w-[32px]">
                                                <div className="text-sm font-bold text-emerald-800">{String(hours).padStart(2, '0')}</div>
                                                <div className="text-[8px] text-zinc-400 font-medium">HR</div>
                                            </div>
                                            <div className="bg-[#F3F3F1] rounded-md px-2 py-1 text-center min-w-[32px]">
                                                <div className="text-sm font-bold text-emerald-800">{String(minutes).padStart(2, '0')}</div>
                                                <div className="text-[8px] text-zinc-400 font-medium">MIN</div>
                                            </div>
                                            <div className="bg-[#F3F3F1] rounded-md px-2 py-1 text-center min-w-[32px]">
                                                <div className="text-sm font-bold text-emerald-800">{String(seconds).padStart(2, '0')}</div>
                                                <div className="text-[8px] text-zinc-400 font-medium">SEC</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Barcode Strip */}
                                <div className="h-9 mt-5 rounded bg-[repeating-linear-gradient(90deg,#15151A_0_2px,transparent_2px_5px,#15151A_5px_7px,transparent_7px_12px)] opacity-75" />

                                <svg className="absolute -bottom-4 -right-6 w-48 pointer-events-none opacity-10" viewBox="0 0 200 260" fill="none">
                                    <path d="M100 10c22 0 38 18 38 40 0 16-8 28-8 28s26 10 34 46c8 34 6 92 6 92s-4 10-16 10-16-10-16-10-2-58-8-78c0 0-4 60-4 78 0 10-14 16-26 16s-26-6-26-16c0-18-4-78-4-78-6 20-8 78-8 78s-4 10-16 10-16-10-16-10-2-58 6-92c8-36 34-46 34-46s-8-12-8-28c0-22 16-40 38-40z" fill="#10B981" />
                                </svg>

                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>

            </div>

            {/* Clean Footer */}
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] text-zinc-400 pt-1.5 z-10 shrink-0 font-normal">
                <span>© 2026 PitchSide Inc. All rights reserved.</span>
                <span>MatchPass Booking Engine</span>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {isPaid && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 cursor-none"
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center"
                        >
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={36} />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 mb-1">Tickets Confirmed!</h3>
                            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                                Successfully booked <strong>{MOCK_CHECKOUT.selectedSeats.length} seats</strong>. QR credentials have been generated in your account.
                            </p>
                            <button
                                onClick={() => router.push("/matches")}
                                className="w-full bg-zinc-900 hover:bg-black text-white font-medium py-3.5 rounded-xl transition-all cursor-none"
                            >
                                Return to Matches
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}