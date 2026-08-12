"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard,
    Search, CheckCircle2, Clock, XCircle, Download
} from "lucide-react";

// ==========================================
// Mock Data
// ==========================================
const MOCK_TRANSACTIONS = [
    { id: "TX-982374", title: "Wallet Top Up", date: "Aug 10, 2026", amount: 100.00, type: "credit", status: "completed", method: "Credit Card ending in 4242" },
    { id: "TX-982373", title: "Lakers vs Bulls Ticket", date: "Aug 05, 2026", amount: 120.00, type: "debit", status: "completed", method: "Wallet Balance" },
    { id: "TX-982372", title: "Refund: Cancelled Match", date: "Jul 28, 2026", amount: 45.00, type: "credit", status: "completed", method: "Wallet Balance" },
    { id: "TX-982371", title: "Withdrawal to Bank", date: "Jul 25, 2026", amount: 50.00, type: "debit", status: "pending", method: "Bank Transfer" },
    { id: "TX-982370", title: "Failed Top Up", date: "Jul 20, 2026", amount: 200.00, type: "credit", status: "failed", method: "Credit Card ending in 1234" },
    { id: "TX-982369", title: "Real Madrid vs Barca Ticket", date: "Jul 15, 2026", amount: 150.00, type: "debit", status: "completed", method: "Wallet Balance" },
];

// ==========================================
// Merged Wallet & Transactions Component
// ==========================================
export default function WalletTab() {
    // Top-up states
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");

    // Mock data for wallet
    const currentBalance = 245.50;
    const presets = [50, 100, 200, 500];

    // Filter Logic
    const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
        const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || tx.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" ? true : tx.type === filterType;
        return matchesSearch && matchesType;
    });

    // Handlers
    const handleAddFunds = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount && !selectedPreset) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setAmount("");
            setSelectedPreset(null);
            console.log(`Redirecting to payment gateway for $${selectedPreset || amount}`);
        }, 1200);
    };

    const handlePresetClick = (value: number) => {
        setSelectedPreset(value);
        setAmount(""); // Clear custom input when preset is selected
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "");
        setAmount(val);
        setSelectedPreset(null); // Clear preset when typing custom amount
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <span className="flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600"><CheckCircle2 size={14} /> Completed</span>;
            case "pending":
                return <span className="flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600"><Clock size={14} /> Pending</span>;
            case "failed":
                return <span className="flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"><XCircle size={14} /> Failed</span>;
            default:
                return null;
        }
    };

    const sectionClass = "rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8";

    return (
        <div className="flex flex-col gap-8">

            {/* ========================================== */}
            {/* TOP SECTION: Virtual Card & Top Up Form    */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                {/* 1. Virtual Wallet Card */}
                <div className="relative flex h-56 flex-col justify-between overflow-hidden rounded-3xl bg-black p-8 text-white shadow-xl lg:h-full">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl transform-gpu" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl transform-gpu" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/70">
                            <Wallet size={20} />
                            <span className="text-sm font-medium tracking-wider uppercase">PitchSide Balance</span>
                        </div>
                        <CreditCard size={24} className="text-white/50" />
                    </div>

                    <div className="relative z-10">
                        <p className="text-sm text-white/70">Available Funds</p>
                        <h2 className="mt-1 flex items-start text-5xl font-black tracking-tight">
                            <span className="mt-2 text-2xl text-white/70">$</span>
                            {currentBalance.toFixed(2)}
                        </h2>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-sm text-white/50">
                        <span>Mahdi Jorati</span>
                        <span>Active</span>
                    </div>
                </div>

                {/* 2. Add Funds Form */}
                <form onSubmit={handleAddFunds} className={sectionClass}>
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                            <Plus size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black select-none cursor-none">Add Funds</h2>
                            <p className="text-sm text-gray-500 select-none cursor-none">Top up your wallet to book faster.</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="mb-3 block cursor-none select-none text-xs font-bold uppercase tracking-wider text-gray-500">
                            Select Amount
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {presets.map((preset) => (
                                <motion.button
                                    key={preset}
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handlePresetClick(preset)}
                                    className={`flex cursor-none items-center justify-center rounded-2xl border py-3 text-sm font-semibold transition-colors ${
                                        selectedPreset === preset
                                            ? "border-black bg-black text-white"
                                            : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                                    }`}
                                >
                                    ${preset}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="mb-3 block cursor-none select-none text-xs font-bold uppercase tracking-wider text-gray-500">
                            Or Enter Custom Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">$</span>
                            <input
                                type="text"
                                placeholder="0.00"
                                value={amount}
                                onChange={handleCustomAmountChange}
                                className="block w-full cursor-none rounded-2xl border border-gray-200 bg-gray-50 p-4 pl-10 text-lg font-bold text-black outline-none transition-all focus:border-black focus:bg-white focus:shadow-sm"
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading || (!amount && !selectedPreset)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full cursor-none items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-bold text-white transition-opacity disabled:opacity-50"
                    >
                        {isLoading ? "Processing..." : "Proceed to Payment"}
                        {!isLoading && <ArrowUpRight size={18} />}
                    </motion.button>
                </form>
            </div>

            {/* ========================================== */}
            {/* BOTTOM SECTION: Transactions Table         */}
            {/* ========================================== */}
            <div className="flex flex-col gap-6">

                {/* Header & Controls */}
                <div className={sectionClass}>
                    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-black select-none cursor-none">Transaction History</h2>
                            <p className="mt-1 text-sm text-gray-500 select-none cursor-none">View and download your past financial activities.</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex cursor-none items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-gray-50"
                        >
                            <Download size={16} />
                            Download PDF
                        </motion.button>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Search Bar */}
                        <div className="relative w-full sm:max-w-xs">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search by ID or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-black outline-none transition-all focus:border-black focus:bg-white focus:shadow-sm"
                            />
                        </div>

                        {/* Filter Pills */}
                        <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1 overflow-x-auto hide-scrollbar">
                            <button
                                onClick={() => setFilterType("all")}
                                className={`cursor-none whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${filterType === "all" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                            >
                                All Transactions
                            </button>
                            <button
                                onClick={() => setFilterType("credit")}
                                className={`cursor-none whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${filterType === "credit" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                            >
                                Deposits
                            </button>
                            <button
                                onClick={() => setFilterType("debit")}
                                className={`cursor-none whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${filterType === "debit" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                            >
                                Purchases
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 select-none">
                            <tr>
                                <th className="px-6 py-4 font-bold">Transaction</th>
                                <th className="px-6 py-4 font-bold">Date & ID</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Amount</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={tx.id}
                                            className="group transition-colors hover:bg-gray-50/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                                                        tx.type === "credit" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                        {tx.type === "credit" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 select-none cursor-none">{tx.title}</p>
                                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 select-none cursor-none">
                                                            <CreditCard size={12} /> {tx.method}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900 select-none cursor-none">{tx.date}</p>
                                                <p className="mt-0.5 text-xs text-gray-400 select-none cursor-none">{tx.id}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(tx.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <p className={`font-black tracking-tight select-none cursor-none ${
                                                    tx.type === "credit" ? "text-green-600" : "text-gray-900"
                                                }`}>
                                                    {tx.type === "credit" ? "+" : "-"}${tx.amount.toFixed(2)}
                                                </p>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
                                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                                                    <Search size={24} />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 select-none cursor-none">No transactions found</h3>
                                                <p className="mt-1 text-sm text-gray-500 select-none cursor-none">
                                                    We couldn't find anything matching "{searchQuery}". Try adjusting your filters.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}