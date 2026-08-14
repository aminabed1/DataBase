"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { locationService, type LocationItem } from "@/services/location.service";
import { User, Mail, Smartphone, MapPin, Shield, CheckCircle2, Map, ChevronDown, MapPinned, Lock, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// Custom Select Dropdown Component
// ==========================================
function CustomSelect({
    icon: Icon,
    placeholder,
    value,
    options,
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

    const selected = options.find(o => String(o.id) === String(value));

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
                        className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-48 overflow-y-auto hide-scrollbar rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {options.length === 0 ? (
                            <div className="p-3 text-center text-sm text-gray-400 select-none cursor-none">No options</div>
                        ) : (
                            options.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => { onChange(String(opt.id)); setIsOpen(false); }}
                                    className={`w-full cursor-none rounded-xl px-4 py-3 text-left text-sm transition-colors ${String(value) === String(opt.id) ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-700 hover:bg-gray-50 font-medium'}`}
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

export default function ProfileTab({ user }: { user?: any }) {
    const queryClient = useQueryClient();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [provinceId, setProvinceId] = useState("");
    const [cityId, setCityId] = useState("");
    const [loginMethod, setLoginMethod] = useState("email"); // Added Login Method State

    const [provinces, setProvinces] = useState<LocationItem[]>([]);
    const [cities, setCities] = useState<LocationItem[]>([]);

    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
    const [isEditingLocation, setIsEditingLocation] = useState(false);

    // Password change states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName && user.lastName !== "-" ? user.lastName : "");
            setProvinceId(user.provinceId ? String(user.provinceId) : "");
            setCityId(user.cityId ? String(user.cityId) : "");
            // If backend supports storing login method, you can set it here too
        }
    }, [user]);

    useEffect(() => {
        locationService.getProvinces().then(setProvinces);
    }, []);

    useEffect(() => {
        if (provinceId) {
            locationService.getCitiesByProvince(provinceId).then((data) => {
                setCities(data);
                setCityId((currentCityId) => {
                    if (currentCityId && !data.find((c) => String(c.id) === String(currentCityId))) {
                        return "";
                    }
                    return currentCityId;
                });
            });
        } else {
            setCities([]);
            setCityId("");
        }
    }, [provinceId]);

    const updateProfileMutation = useMutation({
        mutationFn: (payload: any) => userService.updateProfile(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            setIsEditingLocation(false);
            setIsSuccessMessageVisible(true);
            setTimeout(() => setIsSuccessMessageVisible(false), 3000);
        },
        onError: (err) => {
            console.error("Failed to update profile:", err);
            alert("Failed to update profile. Please try again.");
        }
    });

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate({
            firstName,
            lastName,
            cityId: cityId ? Number(cityId) : null
        });
    };

    const handleCancelLocation = () => {
        setProvinceId(user?.provinceId ? String(user.provinceId) : "");
        setCityId(user?.cityId ? String(user.cityId) : "");
        setIsEditingLocation(false);
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }
        alert("Password change frontend action triggered (Backend pending).");
    };

    const inputClass = "block w-full cursor-none rounded-2xl border-2 border-gray-100 bg-gray-50/50 p-4 text-sm font-medium text-zinc-900 outline-none transition-all focus:border-zinc-950 focus:bg-white hover:border-gray-200";
    const labelClass = "mb-2 block text-sm font-bold text-gray-700";
    const readonlyTextClass = "flex items-center w-full cursor-default rounded-2xl border-2 border-transparent bg-gray-50/80 p-4 text-sm font-medium text-zinc-900";

    return (
        <div className="flex flex-col gap-8">
            {/* Personal Information Form */}
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-zinc-950">Personal Information</h2>
                        <p className="text-sm font-medium text-zinc-500">Update your basic profile details.</p>
                    </div>
                </div>

                <form onSubmit={handleSaveChanges} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={inputClass}
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={inputClass}
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="mt-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MapPinned size={20} className="text-zinc-400" />
                                <h3 className="text-sm font-bold text-zinc-900">Location Details</h3>
                            </div>
                            
                            {!isEditingLocation && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditingLocation(true)}
                                    className="cursor-none rounded-xl border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold text-zinc-700 transition-colors hover:border-zinc-950 hover:bg-zinc-50 hover:text-zinc-950"
                                >
                                    Change Location
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {isEditingLocation ? (
                                <>
                                    <div>
                                        <label className={labelClass}>Province</label>
                                        <CustomSelect
                                            icon={Map}
                                            placeholder="Select Province"
                                            value={provinceId}
                                            options={provinces}
                                            onChange={(val) => { setProvinceId(val); setCityId(""); }}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>City</label>
                                        <CustomSelect
                                            icon={MapPin}
                                            placeholder="Select City"
                                            value={cityId}
                                            options={cities}
                                            disabled={!provinceId}
                                            onChange={(val) => setCityId(val)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className={labelClass}>Province</label>
                                        <div className={readonlyTextClass}>
                                            <Map size={18} className="mr-3 text-gray-400" />
                                            {user?.provinceName || provinces.find(p => String(p.id) === String(provinceId))?.name || "Not Set"}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>City</label>
                                        <div className={readonlyTextClass}>
                                            <MapPin size={18} className="mr-3 text-gray-400" />
                                            {user?.cityName || cities.find(c => String(c.id) === String(cityId))?.name || "Not Set"}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <AnimatePresence>
                            {isEditingLocation && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 flex justify-end"
                                >
                                    <button
                                        type="button"
                                        onClick={handleCancelLocation}
                                        className="cursor-none text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        Cancel Location Change
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                        <div className="h-6">
                            {isSuccessMessageVisible && (
                                <span className="flex items-center gap-2 text-sm font-bold text-emerald-600 animate-pulse">
                                    <CheckCircle2 size={18} />
                                    Profile updated successfully!
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="rounded-full bg-zinc-950 px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {updateProfileMutation.isPending ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Account & Security Information */}
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-zinc-950">Contact & Security</h2>
                        <p className="text-sm font-medium text-zinc-500">Manage your email, phone number, and password.</p>
                    </div>
                </div>

                {/* Login Method Toggle - Restored Feature */}
                {/* Login Method Toggle - Restored Feature */}
                <div className="flex flex-col gap-4 border-b border-gray-100 py-5 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h3 className="font-semibold text-gray-900 select-none cursor-none">Login Method</h3>
                        <p className="text-sm text-gray-500 select-none cursor-none">Choose how you prefer to sign in.</p>
                    </div>
                    <div className="flex rounded-xl bg-gray-100 p-1">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setLoginMethod('email')}
                            className={`flex cursor-none items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                loginMethod === "email" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <Mail size={16} /> Email
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setLoginMethod('phone')}
                            className={`flex cursor-none items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                loginMethod === "phone" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <Smartphone size={16} /> Phone
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
                    {/* Email */}
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-full bg-white p-2 shadow-sm">
                                <Mail size={18} className="text-zinc-950" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</p>
                                <p className="mt-0.5 text-sm font-bold text-zinc-900">{user?.email || "Not Set"}</p>
                            </div>
                        </div>
                        <button 
                            className="w-full cursor-none rounded-xl border-2 border-zinc-200 bg-white py-2 text-sm font-bold text-zinc-900 transition-colors hover:border-zinc-950 hover:bg-zinc-50"
                            onClick={() => console.log("Open Email Change Modal")}
                        >
                            Change Email
                        </button>
                    </div>

                    {/* Phone */}
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-full bg-white p-2 shadow-sm">
                                <Smartphone size={18} className="text-zinc-950" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</p>
                                <p className="mt-0.5 text-sm font-bold text-zinc-900" dir="ltr">
                                    {user?.phoneNumber || "Not Set"}
                                </p>
                            </div>
                        </div>
                        <button 
                            className="w-full cursor-none rounded-xl border-2 border-zinc-200 bg-white py-2 text-sm font-bold text-zinc-900 transition-colors hover:border-zinc-950 hover:bg-zinc-50"
                            onClick={() => console.log("Open Phone Change Modal")}
                        >
                            Change Phone Number
                        </button>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-full bg-white p-2 shadow-sm">
                            <Lock size={18} className="text-zinc-950" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900">Change Password</h3>
                            <p className="text-xs text-zinc-500">Ensure your account is using a secure password.</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-bold text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="cursor-none rounded-xl border border-zinc-300 bg-white px-6 py-2.5 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-950 hover:text-white"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}