"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "../services/wallet.service";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard,
    Search, CheckCircle2, Clock, XCircle, Download, AlertCircle, X, Building2
} from "lucide-react";

// ==========================================
// Merged Wallet & Transactions Component
// ==========================================
export default function WalletTab({ user }: { user?: any }) {
    const queryClient = useQueryClient();

    // ==========================================
    // Fetch Data
    // ==========================================
    const { data: walletData, isLoading: isWalletLoading } = useQuery({
        queryKey: ['my-wallet'],
        queryFn: walletService.getMyWallet
    });

    const { data: txData, isLoading: isTxLoading } = useQuery({
        queryKey: ['my-transactions'],
        queryFn: walletService.getMyTransactions
    });

    const { data: methodsData } = useQuery({
        queryKey: ['payment-methods'],
        queryFn: walletService.getPaymentMethods
    });

    const currentBalance = walletData?.data?.credit || 0.00;
    const transactions = txData?.data || [];
    const paymentMethods = methodsData?.data || [];
    const userName = user ? `${user.firstName} ${user.lastName}` : "User Card";

    // ==========================================
    // Mutations & States
    // ==========================================
    const [amount, setAmount] = useState("");
    const [topUpSuccess, setTopUpSuccess] = useState("");
    const [topUpError, setTopUpError] = useState("");
    
    // Modal States
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");
    const presets = [50, 100, 200, 500];

    const topUpMutation = useMutation({
        mutationFn: (data: { amount: number; paymentMethodId: number }) => walletService.topUpWallet(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-wallet'] });
            queryClient.invalidateQueries({ queryKey: ['my-transactions'] });
            setAmount("");
            setSelectedMethodId(null);
            setIsPaymentModalOpen(false);
            setTopUpError("");
            setTopUpSuccess("Wallet topped up successfully!");
            setTimeout(() => setTopUpSuccess(""), 4000);
        },
        onError: (err: any) => {
            setIsPaymentModalOpen(false);
            setTopUpSuccess("");
            setTopUpError(err.response?.data?.message || "Failed to top up wallet.");
            setTimeout(() => setTopUpError(""), 4000);
        }
    });

    // ==========================================
    // Handlers
    // ==========================================
    const handleProceedClick = (e: React.FormEvent) => {
        e.preventDefault();
        const topUpValue = parseFloat(amount);
        
        if (!topUpValue || topUpValue <= 0) {
            setTopUpError("Please enter a valid amount.");
            return;
        }
        setTopUpError("");
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = () => {
        if (!selectedMethodId) return;
        topUpMutation.mutate({ 
            amount: parseFloat(amount), 
            paymentMethodId: selectedMethodId 
        });
    };

    const handlePresetClick = (value: number) => {
        setAmount(value.toString());
        setTopUpError("");
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9.]/g, "");
        setAmount(val);
        setTopUpError("");
    };

    // Filter Logic
    const filteredTransactions = transactions.filter((tx: any) => {
        const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || tx.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" ? true : tx.type === filterType;
        return matchesSearch && matchesType;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
            case "success":
                return <span className="flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600"><CheckCircle2 size={14} /> Completed</span>;
            case "pending":
                return <span className="flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600"><Clock size={14} /> Pending</span>;
            case "failed":
            case "cancelled":
                return <span className="flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"><XCircle size={14} /> Failed</span>;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const sectionClass = "rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8";

    return (
        <div className="flex flex-col gap-8 relative">

            {/* ========================================== */}
            {/* Payment Method Selection Modal             */}
            {/* ========================================== */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl"
                        >
                            <button 
                                onClick={() => setIsPaymentModalOpen(false)} 
                                className="absolute right-6 top-6 cursor-none text-gray-400 transition-colors hover:text-black"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-zinc-950">Select Payment Method</h3>
                                <p className="mt-2 text-sm font-medium text-zinc-500">
                                    Choose a gateway to complete your ${amount} top-up.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 mb-8 max-h-[300px] overflow-y-auto pr-2">
                                {paymentMethods.map((method: any) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedMethodId(method.id)}
                                        className={`flex w-full cursor-none items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                                            selectedMethodId === method.id 
                                            ? 'border-zinc-950 bg-zinc-50' 
                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${selectedMethodId === method.id ? 'bg-zinc-950 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                <Building2 size={18} />
                                            </div>
                                            <span className="font-bold text-zinc-900">{method.description}</span>
                                        </div>
                                        {selectedMethodId === method.id && (
                                            <CheckCircle2 size={20} className="text-zinc-950" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <motion.button
                                type="button"
                                onClick={handleConfirmPayment}
                                disabled={!selectedMethodId || topUpMutation.isPending}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex w-full cursor-none items-center justify-center gap-2 rounded-full bg-zinc-950 py-4 text-sm font-bold text-white transition-opacity disabled:opacity-50"
                            >
                                {topUpMutation.isPending ? "Processing..." : `Pay $${amount}`}
                            </motion.button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                            {isWalletLoading ? (
                                <span className="ml-2 animate-pulse rounded-md bg-white/20 text-transparent">000.00</span>
                            ) : (
                                <span className="ml-2">{currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            )}
                        </h2>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-sm text-white/50">
                        <span>{userName}</span>
                        <span>Active</span>
                    </div>
                </div>

                {/* 2. Add Funds Form */}
                <form onSubmit={handleProceedClick} className={sectionClass}>
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                            <Plus size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black select-none cursor-none">Add Funds</h2>
                            <p className="text-sm text-gray-500 select-none cursor-none">Top up your wallet to book faster.</p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {topUpError && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} 
                                className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600"
                            >
                                <AlertCircle size={18} /> {topUpError}
                            </motion.div>
                        )}
                        {topUpSuccess && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} 
                                className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-600"
                            >
                                <CheckCircle2 size={18} /> {topUpSuccess}
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                                        amount === preset.toString()
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
                        disabled={!amount}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full cursor-none items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-bold text-white transition-opacity disabled:opacity-50"
                    >
                        Proceed to Payment <ArrowUpRight size={18} />
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
                                placeholder="Search by ID or description..."
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
                                {isTxLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center text-sm font-medium text-gray-400">Loading transactions...</td>
                                    </tr>
                                ) : filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx: any) => (
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
                                                        tx.type === "credit" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
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
                                                <p className="font-semibold text-gray-900 select-none cursor-none">{formatDate(tx.date)}</p>
                                                <p className="mt-0.5 text-xs text-gray-400 select-none cursor-none">{tx.id}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(tx.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <p className={`font-black tracking-tight select-none cursor-none ${
                                                    tx.type === "credit" ? "text-green-600" : "text-red-600"
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