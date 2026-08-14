"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import { locationService, type LocationItem } from "@/services/location.service"; // 👈 سرویس جدید
import { Mail, Lock, User, Smartphone, MapPin, Map, Key, ArrowRight, ShieldCheck, AlertCircle, Trophy, Ticket, ChevronDown } from "lucide-react";

// ==========================================
// Custom Select Dropdown Component
// ==========================================
function CustomSelect({
                          icon: Icon,
                          placeholder,
                          value, // در اینجا آیدی (ID) قرار میگیره
                          options, // آرایه‌ای از آبجکت‌های استان/شهر
                          onChange,
                          disabled = false
                      }: {
    icon: React.ElementType;
    placeholder: string;
    value: string;
    options: LocationItem[];
    onChange: (val: string) => void;
    disabled?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // پیدا کردن نام نمایشی بر اساس آیدی انتخاب شده
    const selected = options.find(o => o.id === value);

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
                className={`block w-full cursor-none rounded-2xl border-2 p-4 pl-12 pr-10 text-left text-sm font-medium outline-none backdrop-blur-sm transition-all 
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
                        className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-48 overflow-y-auto hide-scrollbar rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl"
                    >
                        {options.length === 0 ? (
                            <div className="p-3 text-center text-sm text-gray-400 select-none cursor-none">No options</div>
                        ) : (
                            options.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => { onChange(opt.id); setIsOpen(false); }}
                                    className={`w-full cursor-none rounded-xl px-4 py-3 text-left text-sm transition-colors ${value === opt.id ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-700 hover:bg-gray-50 font-medium'}`}
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

type AuthMode = "login" | "signup";
type LoginMethod = "password" | "otp";
type OtpStep = "request" | "verify";

export default function AuthPanel() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const defaultMode = searchParams.get("mode") === "signup" ? "signup" : "login";

    const [mode, setMode] = useState<AuthMode>(defaultMode);
    const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
    const [otpStep, setOtpStep] = useState<OtpStep>("request");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Location States
    const [provinces, setProvinces] = useState<LocationItem[]>([]);
    const [cities, setCities] = useState<LocationItem[]>([]);

    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", province_id: "", city_id: "", password: "", identifier: "", otp: ""
    });

    // لود کردن استان‌ها هنگام بالا آمدن کامپوننت
    useEffect(() => {
        locationService.getProvinces().then(setProvinces);
    }, []);

    // لود کردن شهرها با هر بار تغییر استان
    useEffect(() => {
        if (formData.province_id) {
            locationService.getCitiesByProvince(formData.province_id).then(data => {
                setCities(data);
                // ریست کردن شهر انتخاب شده اگر تو استان جدید نبود
                if (!data.find(c => c.id === formData.city_id)) {
                    setFormData(prev => ({ ...prev, city_id: "" }));
                }
            });
        } else {
            setCities([]);
            setFormData(prev => ({ ...prev, city_id: "" }));
        }
    }, [formData.province_id]);

    useEffect(() => {
        window.history.replaceState(null, "", `?mode=${mode}`);
    }, [mode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSuccessAuth = (data: any) => {
        if (data?.token) {
            localStorage.setItem("token", data.token);
        }
        router.push("/dashboard");
    };

    // ==========================================
    // SIGNUP SUBMIT
    // ==========================================
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!formData.name || !formData.email || !formData.phone || !formData.province_id || !formData.city_id || !formData.password) {
            return setError("Please fill out all fields.");
        }

        setIsLoading(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                city_id: formData.city_id,
                province_id: formData.province_id,
                password: formData.password
            };
            const data = await authService.register(payload);
            handleSuccessAuth(data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // LOGIN SUBMIT
    // ==========================================
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.identifier) {
            return setError("Please enter your email or phone number.");
        }

        setIsLoading(true);

        try {
            if (loginMethod === "password") {
                if (!formData.password) {
                    setIsLoading(false);
                    return setError("Please enter your password.");
                }
                
                await authService.loginWithPassword(formData.identifier, formData.password);
                
                setLoginMethod("otp");
                setOtpStep("verify");
                
            } else {
                if (otpStep === "request") {
                    await authService.requestOtp(formData.identifier);
                    setOtpStep("verify");
                } else {
                    if (formData.otp.length < 5) {
                        setIsLoading(false);
                        return setError("Invalid verification code.");
                    }
                    
                    const data = await authService.verifyOtp(formData.identifier, formData.otp);
                    handleSuccessAuth(data);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Login failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "block w-full cursor-none rounded-2xl border-2 border-gray-100 bg-gray-50/50 p-4 pl-12 text-sm font-medium text-zinc-900 outline-none backdrop-blur-sm transition-all focus:border-zinc-950 focus:bg-white focus:shadow-xl focus:shadow-black/5 hover:border-gray-200 hover:bg-white";

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full"
        >
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl md:flex-row">

                {/* ========================================== */}
                {/* DESKTOP SLIDING OVERLAY (The Curved Panel) */}
                {/* ========================================== */}
                <motion.div
                    initial={false}
                    animate={{
                        x: mode === "login" ? "100%" : "0%",
                        borderTopLeftRadius: mode === "login" ? "120px" : "0px",
                        borderBottomLeftRadius: mode === "login" ? "120px" : "0px",
                        borderTopRightRadius: mode === "signup" ? "120px" : "0px",
                        borderBottomRightRadius: mode === "signup" ? "120px" : "0px",
                    }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-0 z-30 hidden h-full w-1/2 flex-col items-center justify-center overflow-hidden text-white shadow-2xl md:flex bg-[linear-gradient(to_bottom_right,var(--theme-panel-1),var(--theme-panel-2),var(--theme-panel-3))]"
                >
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl will-change-transform [animation:aurora-spin_40s_linear_infinite] [background:conic-gradient(from_0deg,transparent_0%,var(--theme-aurora-a)_20%,transparent_35%,var(--theme-aurora-b)_60%,transparent_80%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-10 [background-size:24px_24px]"></div>

                    <AnimatePresence mode="wait">
                        {mode === "login" && (
                            <motion.div
                                key="promo-signup"
                                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25, ease: "easeOut" }}
                                className="relative z-10 flex flex-col items-center px-16 text-center lg:px-24"
                            >
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                                    <Trophy size={48} className="mb-6 opacity-80" />
                                </motion.div>
                                <h3 className="mb-4 text-3xl font-black tracking-tight">Join PitchSide</h3>
                                <p className="mb-8 font-medium text-gray-400">Create an account to get exclusive access to premium matches, fast bookings, and VIP tickets.</p>
                                <button
                                    onClick={() => { setMode("signup"); setError(null); }}
                                    className="cursor-none rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-bold tracking-wide text-white transition-all hover:bg-white hover:text-black"
                                >
                                    Create Account
                                </button>
                            </motion.div>
                        )}

                        {mode === "signup" && (
                            <motion.div
                                key="promo-login"
                                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.25, ease: "easeOut" }}
                                className="relative z-10 flex flex-col items-center px-16 text-center lg:px-24"
                            >
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                                    <Ticket size={48} className="mb-6 opacity-80" />
                                </motion.div>
                                <h3 className="mb-4 text-3xl font-black tracking-tight">Already a Member?</h3>
                                <p className="mb-8 font-medium text-gray-400">Sign in to access your wallet, download your tickets, and check your upcoming matches.</p>
                                <button
                                    onClick={() => { setMode("login"); setError(null); setOtpStep("request"); }}
                                    className="cursor-none rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-bold tracking-wide text-white transition-all hover:bg-white hover:text-black"
                                >
                                    Log In Here
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ========================================== */}
                {/* MOBILE TAB TOGGLE (Hidden on Desktop)      */}
                {/* ========================================== */}
                <div className="relative z-20 flex px-6 pt-6 md:hidden">
                    <div className="flex w-full rounded-2xl border border-gray-100 bg-gray-50/80 p-1 shadow-sm backdrop-blur-md">
                        <button
                            type="button"
                            onClick={() => { setMode("login"); setError(null); setOtpStep("request"); }}
                            className="relative z-10 flex-1 cursor-none rounded-xl py-3 text-sm font-bold text-gray-500 transition-colors hover:text-black"
                        >
                            {mode === "login" && <motion.div layoutId="active-pill-mobile" className="absolute inset-0 -z-10 rounded-xl border border-gray-200 bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                            <span className={`relative z-10 ${mode === "login" ? "text-black" : ""}`}>Log In</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode("signup"); setError(null); }}
                            className="relative z-10 flex-1 cursor-none rounded-xl py-3 text-sm font-bold text-gray-500 transition-colors hover:text-black"
                        >
                            {mode === "signup" && <motion.div layoutId="active-pill-mobile" className="absolute inset-0 -z-10 rounded-xl border border-gray-200 bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                            <span className={`relative z-10 ${mode === "signup" ? "text-black" : ""}`}>Sign Up</span>
                        </button>
                    </div>
                </div>

                {/* ========================================== */}
                {/* FORMS CONTAINER                            */}
                {/* ========================================== */}
                <div className="relative flex h-full w-full flex-col md:flex-row">

                    {/* LEFT SIDE: LOGIN FORM */}
                    <div className={`flex h-full w-full flex-col justify-center overflow-y-auto px-6 py-8 md:w-1/2 md:px-12 lg:px-20 hide-scrollbar ${mode === 'login' ? 'block' : 'hidden md:flex'}`}>
                        <div className="m-auto w-full max-w-sm">
                            <form onSubmit={handleLoginSubmit} noValidate className="flex flex-col gap-5">
                                <div className="mb-4 text-center md:mb-6">
                                    <h2 className="cursor-none select-none text-3xl font-black tracking-tight text-zinc-950">Welcome Back</h2>
                                    <p className="mt-2 cursor-none select-none text-sm text-zinc-500">Sign in to manage your bookings.</p>
                                </div>

                                {otpStep === "request" && (
                                    <div className="mb-2 flex items-center justify-center gap-8">
                                        <button type="button" onClick={() => {setLoginMethod("password"); setError(null);}} className={`cursor-none border-b-2 pb-1.5 text-sm font-semibold transition-colors ${loginMethod === "password" ? "border-zinc-950 text-zinc-950" : "border-transparent text-gray-400 hover:text-zinc-800"}`}>
                                            Password
                                        </button>
                                        <button type="button" onClick={() => {setLoginMethod("otp"); setError(null);}} className={`cursor-none border-b-2 pb-1.5 text-sm font-semibold transition-colors ${loginMethod === "otp" ? "border-zinc-950 text-zinc-950" : "border-transparent text-gray-400 hover:text-zinc-800"}`}>
                                            One-Time Code
                                        </button>
                                    </div>
                                )}

                                <AnimatePresence mode="popLayout" initial={false}>
                                    {otpStep === "request" ? (
                                        <motion.div key="login-inputs" layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="flex flex-col gap-4">

                                            <div className="relative group">
                                                <User size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-zinc-950" />
                                                <input type="text" name="identifier" required placeholder="Email or Phone Number" value={formData.identifier} onChange={handleInputChange} className={inputClass} />
                                            </div>

                                            <AnimatePresence>
                                                {loginMethod === "password" && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="relative group overflow-hidden">
                                                        <Key size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-zinc-950" />
                                                        <input type="password" name="password" required placeholder="Password" value={formData.password} onChange={handleInputChange} className={inputClass} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="otp-inputs" layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="flex flex-col items-center gap-4 text-center">
                                            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-gray-100 bg-white text-zinc-950 shadow-sm">
                                                <ShieldCheck size={28} />
                                            </div>
                                            <div>
                                                <p className="cursor-none select-none text-sm font-bold text-zinc-950">Enter Verification Code</p>
                                                <p className="mt-1 cursor-none select-none text-xs text-zinc-500">Sent to <span className="font-semibold text-zinc-800">{formData.identifier}</span></p>
                                            </div>
                                            <input
                                                type="text" name="otp" maxLength={6} required placeholder="• • • • • •" autoFocus
                                                value={formData.otp} onChange={(e) => {setFormData({...formData, otp: e.target.value.replace(/\D/g, "")}); setError(null);}}
                                                className="block w-full cursor-none rounded-2xl border border-gray-200 bg-white p-4 text-center text-2xl font-black tracking-[0.5em] text-zinc-950 outline-none transition-all focus:border-zinc-950 focus:shadow-sm"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {error && mode === 'login' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-600">
                                            <AlertCircle size={16} /> {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="mt-2 flex w-full cursor-none items-center justify-center gap-2 rounded-full bg-zinc-950 py-4 text-sm font-bold text-white transition-opacity disabled:opacity-70 group">
                                    {isLoading ? "Processing..." : (
                                        loginMethod === "otp" && otpStep === "request" ? "Send Code" : "Log In"
                                    )}
                                    {!isLoading && loginMethod === "otp" && otpStep === "request" && <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />}
                                </motion.button>

                                {loginMethod === "otp" && otpStep === "verify" && (
                                    <button type="button" onClick={() => {setOtpStep("request"); setFormData({...formData, otp: ""});}} className="mt-1 cursor-none text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-950">
                                        Change Contact Info
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* RIGHT SIDE: SIGNUP FORM */}
                    <div className={`flex h-full w-full flex-col overflow-y-auto px-6 py-8 md:w-1/2 md:px-12 lg:px-20 hide-scrollbar ${mode === 'signup' ? 'block' : 'hidden md:flex'}`}>
                        <div className="m-auto w-full max-w-sm pb-8">
                            <form onSubmit={handleSignupSubmit} noValidate className="flex flex-col gap-4">
                                <div className="mb-2 text-center md:mb-6">
                                    <h2 className="cursor-none select-none text-3xl font-black tracking-tight text-zinc-950">Create Account</h2>
                                    <p className="mt-2 cursor-none select-none text-sm text-zinc-500">Join PitchSide to book your tickets.</p>
                                </div>

                                <div className="relative group">
                                    <User size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-zinc-950" />
                                    <input type="text" name="name" required placeholder="Full Name" value={formData.name} onChange={handleInputChange} className={inputClass} />
                                </div>
                                <div className="relative group">
                                    <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-zinc-950" />
                                    <input type="email" name="email" required placeholder="Email Address" value={formData.email} onChange={handleInputChange} className={inputClass} />
                                </div>
                                <div className="relative group">
                                    <Smartphone size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-zinc-950" />
                                    <input type="tel" name="phone" required placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className={inputClass} dir="ltr" />
                                </div>

                                {/* Province & City Dropdowns */}
                                <div className="flex gap-3">
                                    <CustomSelect
                                        icon={Map}
                                        placeholder="Province"
                                        value={formData.province_id}
                                        options={provinces}
                                        onChange={(val) => { setFormData({ ...formData, province_id: val, city_id: "" }); setError(null); }}
                                    />
                                    <CustomSelect
                                        icon={MapPin}
                                        placeholder="City"
                                        value={formData.city_id}
                                        options={cities}
                                        disabled={!formData.province_id}
                                        onChange={(val) => { setFormData({ ...formData, city_id: val }); setError(null); }}
                                    />
                                </div>

                                <div className="relative group">
                                    <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-zinc-950" />
                                    <input type="password" name="password" required placeholder="Create Password" value={formData.password} onChange={handleInputChange} className={inputClass} />
                                </div>

                                <AnimatePresence>
                                    {error && mode === 'signup' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-600">
                                            <AlertCircle size={16} /> {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="mt-2 flex w-full cursor-none items-center justify-center rounded-full bg-zinc-950 py-4 text-sm font-bold text-white transition-opacity disabled:opacity-70 group">
                                    {isLoading ? "Creating Account..." : "Sign Up"}
                                </motion.button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}