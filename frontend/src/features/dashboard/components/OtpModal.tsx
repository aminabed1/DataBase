"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Mail, Smartphone, Key, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    actionType: string | null;
    currentEmail?: string;
    currentPhone?: string;
    onVerify: (code: string, data?: any) => void;
}

type Step = "input" | "otp";

export default function OtpModal({ isOpen, onClose, actionType, currentEmail, currentPhone, onVerify }: OtpModalProps) {
    const [step, setStep] = useState<Step>("input");

    const [inputValue, setInputValue] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setStep("input");
            setInputValue("");
            setOldPassword("");
            setNewPassword("");
            setOtp("");
            setError(null);
            setIsLoading(false);
        } else {
            if (actionType?.startsWith("login_method")) {
                setStep("otp");
            }
        }
    }, [isOpen, actionType]);

    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Client-side Validations
        if (actionType === 'email') {
            if (!inputValue.trim()) return setError("Please fill out this field.");
            if (inputValue === currentEmail) return setError("New email cannot be the same as your current one.");
            if (!inputValue.includes('@')) return setError(`Please include an '@' in the email address. '${inputValue}' is missing an '@'.`);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) return setError("Please enter a valid email address.");
        }
        if (actionType === 'phone') {
            if (!inputValue.trim()) return setError("Please fill out this field.");
            if (inputValue === currentPhone) return setError("New phone number cannot be the same as your current one.");
            if (inputValue.length < 10) return setError("Please enter a valid phone number.");
        }
        if (actionType === 'password') {
            if (!oldPassword || !newPassword) return setError("Please fill out all password fields.");
            if (oldPassword === newPassword) return setError("Your new password must be different from the old one.");
            if (newPassword.length < 8) return setError("Password must be at least 8 characters long.");
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) return setError("Password must contain uppercase, lowercase, and a number.");
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep("otp");
        }, 800);
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 5) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onVerify(otp, { inputValue, oldPassword, newPassword });
        }, 1200);
    };

    const getInputClass = (hasError: boolean) =>
        `block w-full rounded-2xl border bg-gray-50 p-4 text-sm outline-none transition-all ${
            hasError
                ? "border-red-500 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-gray-200 text-black focus:border-black focus:bg-white focus:shadow-sm"
        }`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], layout: { type: "spring", bounce: 0, duration: 0.4 } }}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="absolute right-6 top-6 z-10 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-black"
                        >
                            <X size={20} />
                        </motion.button>

                        <motion.div layout className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5 text-black">
                            {actionType === 'email' && <Mail size={28} />}
                            {actionType === 'phone' && <Smartphone size={28} />}
                            {actionType === 'password' && <Key size={28} />}
                            {actionType?.startsWith('login_method') && <ShieldCheck size={28} />}
                        </motion.div>

                        <AnimatePresence mode="popLayout" initial={false}>
                            {step === "input" ? (
                                <motion.div
                                    key="input-step" layout
                                    initial={{ opacity: 0, filter: "blur(4px)", scale: 0.96 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                    exit={{ opacity: 0, filter: "blur(4px)", scale: 0.96 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="flex w-full flex-col"
                                >
                                    <motion.h2 layout className="mb-2 text-2xl font-bold tracking-tight text-black">
                                        {actionType === 'email' ? "New Email Address" : actionType === 'phone' ? "New Phone Number" : "Update Password"}
                                    </motion.h2>
                                    <motion.p layout className="mb-6 text-sm leading-relaxed text-gray-500">
                                        Please enter your new information below.
                                    </motion.p>

                                    {/* 👇 اینجا noValidate اضافه شد */}
                                    <form onSubmit={handleInputSubmit} noValidate className="flex flex-col gap-4">
                                        {actionType === 'email' && (
                                            <input type="email" required placeholder="Enter new email" value={inputValue} onChange={(e) => {setInputValue(e.target.value); setError(null);}} className={getInputClass(!!error)} />
                                        )}
                                        {actionType === 'phone' && (
                                            <input type="tel" required placeholder="Enter new phone number" value={inputValue} onChange={(e) => {setInputValue(e.target.value); setError(null);}} className={getInputClass(!!error)} dir="ltr" />
                                        )}
                                        {actionType === 'password' && (
                                            <>
                                                <input type="password" required placeholder="Current password" value={oldPassword} onChange={(e) => {setOldPassword(e.target.value); setError(null);}} className={getInputClass(false)} />
                                                <input type="password" required placeholder="New password" value={newPassword} onChange={(e) => {setNewPassword(e.target.value); setError(null);}} className={getInputClass(!!error)} />
                                            </>
                                        )}

                                        {/* ارور کاستوم با افکت لرزش */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: 'auto', x: [-5, 5, -5, 5, 0] }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex items-center gap-2 text-sm font-medium text-red-500"
                                                >
                                                    <AlertCircle size={16} /> {error}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={isLoading} className="mt-2 flex w-full items-center justify-center rounded-full bg-black py-4 text-sm font-bold text-white disabled:opacity-70">
                                            {isLoading ? "Processing..." : "Continue"}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="otp-step" layout
                                    initial={{ opacity: 0, filter: "blur(4px)", scale: 0.96 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                    exit={{ opacity: 0, filter: "blur(4px)", scale: 0.96 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="flex w-full flex-col"
                                >
                                    <motion.h2 layout className="mb-2 text-2xl font-bold tracking-tight text-black">
                                        Verify it's you
                                    </motion.h2>
                                    <motion.p layout className="mb-6 text-sm leading-relaxed text-gray-500">
                                        We sent a 6-digit code to authorize this change.
                                    </motion.p>

                                    <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                                        <input
                                            type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                            placeholder="• • • • • •" autoFocus
                                            className="block w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center text-2xl font-black tracking-[0.5em] text-black outline-none transition-all focus:border-black focus:bg-white focus:shadow-sm"
                                        />

                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={otp.length < 5 || isLoading} className="mt-2 flex w-full items-center justify-center rounded-full bg-black py-4 text-sm font-bold text-white disabled:opacity-70">
                                            {isLoading ? "Verifying..." : "Verify & Save"}
                                        </motion.button>
                                    </form>

                                    {!actionType?.startsWith("login_method") && (
                                        <motion.button layout onClick={() => setStep("input")} type="button" className="mt-4 w-full text-center text-sm font-medium text-gray-500 transition-colors hover:text-black">
                                            Wait, I need to change the details
                                        </motion.button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}