"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OtpModal from "./OtpModal";
import { locationService, type LocationItem } from "@/services/location.service";
import { ShieldCheck, User as UserIcon, Camera, Smartphone, Mail, CalendarDays, ChevronDown } from "lucide-react";

// ==========================================
// Custom Dropdown Component
// ==========================================
function CustomDropdown({
                            value,
                            options,
                            onChange,
                            placeholder
                        }: {
    value: string;
    options: LocationItem[];
    onChange: (val: string) => void;
    placeholder: string
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // پیدا کردن نام نمایشی (Label) بر اساس آیدی (Value)
    const selected = options.find(o => o.id === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full cursor-none items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition-all hover:bg-gray-100 focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
            >
                <span className={selected ? "text-gray-900" : "text-gray-400"}>
                    {selected ? selected.name : placeholder}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        data-lenis-prevent="true"
                        className="absolute left-0 right-0 top-full z-50 mt-2 max-h-48 overflow-y-auto hide-scrollbar rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
                    >
                        {options.length === 0 ? (
                            <div className="p-3 text-center text-sm text-gray-400 select-none cursor-none">No options</div>
                        ) : (
                            options.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => { onChange(opt.id); setIsOpen(false); }}
                                    className={`w-full cursor-none rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${value === opt.id ? 'bg-black font-semibold text-white' : 'text-gray-700 hover:bg-gray-50'}`}
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

// ==========================================
// Main Profile Tab Component
// ==========================================
export default function ProfileTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [loginMethod, setLoginMethod] = useState("email");

    // Location States
    const [provinces, setProvinces] = useState<LocationItem[]>([]);
    const [cities, setCities] = useState<LocationItem[]>([]);
    const [provinceId, setProvinceId] = useState("");
    const [cityId, setCityId] = useState("");

    // Fetch Provinces on mount
    useEffect(() => {
        locationService.getProvinces().then(setProvinces);
    }, []);

    // Fetch Cities when Province changes
    useEffect(() => {
        if (provinceId) {
            locationService.getCitiesByProvince(provinceId).then(data => {
                setCities(data);
                // اگه آیدی شهر فعلی تو لیست جدید نبود، پاکش کن
                if (!data.find(c => c.id === cityId)) setCityId("");
            });
        } else {
            setCities([]);
            setCityId("");
        }
    }, [provinceId]);

    // Mock user data for initialization and validation comparisons
    const currentUserData = {
        email: "mahdi@example.com",
        phone: "09123456789"
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<string | null>(null);

    const handleSecureAction = (actionType: string) => {
        setCurrentAction(actionType);
        setIsModalOpen(true);
    };

    const handleOtpSuccess = (code: string) => {
        console.log(`OTP Verified: ${code} for action: ${currentAction}`);
        if (currentAction?.startsWith("login_method_")) {
            setLoginMethod(currentAction.replace("login_method_", ""));
        }
        setIsModalOpen(false);
    };

    const handleSubmitGeneralInfo = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Saving Profile:", { provinceId, cityId });
        setTimeout(() => setIsLoading(false), 1000);
    };

    // Shared styling classes
    const inputClass = "block w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition-all focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:shadow-sm";
    const labelClass = "mb-2 block cursor-none text-xs font-bold uppercase tracking-wider text-gray-500 select-none";
    const sectionClass = "rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8";
    const actionBtnClass = "rounded-full cursor-none bg-gray-100 px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-gray-200 hover:shadow-sm";

    return (
        <div className="flex flex-col gap-8">
            {/* General Information Section */}
            <form onSubmit={handleSubmitGeneralInfo} className={sectionClass}>
                <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                            <UserIcon size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black select-none cursor-none">General Information</h2>
                            <p className="text-sm text-gray-500 select-none cursor-none">Update your basic details and location.</p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="rounded-full cursor-none bg-black px-6 py-2.5 text-sm font-bold text-white shadow-md transition-colors disabled:opacity-70"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </motion.button>
                </div>

                <div className="mb-8 flex items-center gap-6">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative flex h-20 w-20 cursor-none items-center justify-center overflow-hidden rounded-full bg-black text-2xl font-bold text-white shadow-md transition-shadow hover:shadow-lg"
                    >
                        M
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                            <Camera size={24} className="text-white" />
                        </div>
                    </motion.div>
                    <div>
                        <h3 className="font-bold text-gray-900 select-none cursor-none">Profile Picture</h3>
                        <p className="mt-1 text-xs text-gray-500 select-none cursor-none">Click to upload (JPG, PNG up to 5MB)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>First Name</label>
                        <input type="text" defaultValue="Mahdi" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Last Name</label>
                        <input type="text" defaultValue="" placeholder="Enter your last name" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Date of Birth</label>
                        <div className="relative">
                            <CalendarDays size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                className={`${inputClass} pl-10 text-gray-600 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-none [&::-webkit-calendar-picker-indicator]:opacity-0`}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Province</label>
                        <CustomDropdown value={provinceId} options={provinces} onChange={setProvinceId} placeholder="Select Province" />
                    </div>
                    <div>
                        <label className={labelClass}>City</label>
                        <CustomDropdown value={cityId} options={cities} onChange={setCityId} placeholder="Select City" />
                    </div>
                </div>
            </form>

            {/* Account & Security Section */}
            <div className={sectionClass}>
                <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-black select-none cursor-none">Account & Security</h2>
                        <p className="text-sm text-gray-500 select-none cursor-none">Manage sensitive data. Changes require verification.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 border-b border-gray-100 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 select-none cursor-none">Email Address</h3>
                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" /> {currentUserData.email}
                        </p>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => handleSecureAction('email')} className={actionBtnClass}>
                        Change Email
                    </motion.button>
                </div>

                <div className="flex flex-col gap-4 border-b border-gray-100 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 select-none cursor-none">Phone Number</h3>
                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                            <Smartphone size={14} className="text-gray-400" /> {currentUserData.phone}
                        </p>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => handleSecureAction('phone')} className={actionBtnClass}>
                        Change Phone
                    </motion.button>
                </div>

                <div className="flex flex-col gap-4 border-b border-gray-100 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 select-none cursor-none">Login Method</h3>
                        <p className="text-sm text-gray-500 select-none cursor-none">Choose how you prefer to sign in.</p>
                    </div>
                    <div className="flex rounded-xl bg-gray-100 p-1">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => { if(loginMethod !== "email") handleSecureAction('login_method_email'); }}
                            className={`flex cursor-none items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                loginMethod === "email" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <Mail size={16} /> Email
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => { if(loginMethod !== "phone") handleSecureAction('login_method_phone'); }}
                            className={`flex cursor-none items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                loginMethod === "phone" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <Smartphone size={16} /> Phone
                        </motion.button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 select-none cursor-none">Password</h3>
                        <p className="text-sm text-gray-500 select-none cursor-none">Ensure your account is using a secure password.</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => handleSecureAction('password')} className={actionBtnClass}>
                        Update Password
                    </motion.button>
                </div>
            </div>

            <OtpModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                actionType={currentAction}
                currentEmail={currentUserData.email}
                currentPhone={currentUserData.phone}
                onVerify={handleOtpSuccess}
            />
        </div>
    );
}