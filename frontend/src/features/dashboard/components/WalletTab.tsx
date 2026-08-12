"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, History } from "lucide-react";

export default function WalletTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

    // Mock data for wallet
    const currentBalance = 245.50;
    const presets = [50, 100, 200, 500];

    const recentTransactions = [
        { id: 1, title: "Wallet Top Up", date: "Aug 10, 2026", amount: "+$100.00", type: "credit" },
        { id: 2, title: "Lakers vs Bulls Ticket", date: "Aug 05, 2026", amount: "-$120.00", type: "debit" },
        { id: 3, title: "Refund: Cancelled Match", date: "Jul 28, 2026", amount: "+$45.00", type: "credit" },
    ];

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

    const sectionClass = "rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8";

    return (
        <div className="flex flex-col gap-8">

            {/* Top Section: Virtual Card & Top Up Form */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                {/* 1. Virtual Wallet Card */}
                <div className="relative flex h-56 flex-col justify-between overflow-hidden rounded-3xl bg-black p-8 text-white shadow-xl lg:h-full">
                    {/* Background glow effects */}
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

            {/* Bottom Section: Recent Activity */}
            <div className={sectionClass}>
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                            <History size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black select-none cursor-none">Recent Wallet Activity</h2>
                            <p className="text-sm text-gray-500 select-none cursor-none">Latest transactions using your wallet.</p>
                        </div>
                    </div>

                    <button type="button" className="cursor-none text-sm font-bold text-gray-500 transition-colors hover:text-black">
                        View All
                    </button>
                </div>

                <div className="flex flex-col">
                    {recentTransactions.map((tx, index) => (
                        <div
                            key={tx.id}
                            className={`flex items-center justify-between py-4 ${
                                index !== recentTransactions.length - 1 ? "border-b border-gray-50" : ""
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                    tx.type === "credit" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-600"
                                }`}>
                                    {tx.type === "credit" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 select-none cursor-none">{tx.title}</h4>
                                    <p className="text-xs text-gray-500 select-none cursor-none">{tx.date}</p>
                                </div>
                            </div>
                            <span className={`font-bold select-none cursor-none ${
                                tx.type === "credit" ? "text-green-600" : "text-gray-900"
                            }`}>
                                {tx.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}