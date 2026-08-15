"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { locationService, type LocationItem } from "@/services/location.service";
import { User, Mail, Smartphone, MapPin, Shield, CheckCircle2, Map, ChevronDown, MapPinned, Lock, Key, X, AlertCircle } from "lucide-react";
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

    // ==========================================
    // Profile States
    // ==========================================
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [provinceId, setProvinceId] = useState("");
    const [cityId, setCityId] = useState("");
    const [loginMethod, setLoginMethod] = useState("email");

    const [provinces, setProvinces] = useState<LocationItem[]>([]);
    const [cities, setCities] = useState<LocationItem[]>([]);

    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
    const [profileErrorMessage, setProfileErrorMessage] = useState("");
    const [isEditingLocation, setIsEditingLocation] = useState(false);

    // ==========================================
    // Password States
    // ==========================================
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    // ==========================================
    // Contact Modal States
    // ==========================================
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactModalType, setContactModalType] = useState<"email" | "phone">("email");
    const [contactModalStep, setContactModalStep] = useState<"request" | "verify">("request");
    const [newContactValue, setNewContactValue] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [contactModalError, setContactModalError] = useState("");
    const [securityMessage, setSecurityMessage] = useState("");
    const [securityError, setSecurityError] = useState("");

    // ==========================================
    // Effects
    // ==========================================
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName && user.lastName !== "-" ? user.lastName : "");
            setProvinceId(user.provinceId ? String(user.provinceId) : "");
            setCityId(user.cityId ? String(user.cityId) : "");
            if (user.loginMethod) {
                setLoginMethod(user.loginMethod.toLowerCase());
            }
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

    // ==========================================
    // Mutations
    // ==========================================
    const updateProfileMutation = useMutation({
        mutationFn: (payload: any) => userService.updateProfile(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            setIsEditingLocation(false);
            setProfileErrorMessage("");
            setIsSuccessMessageVisible(true);
            setTimeout(() => setIsSuccessMessageVisible(false), 3000);
        },
        onError: (err: any) => {
            setProfileErrorMessage(err.response?.data?.message || "Failed to update profile.");
            setTimeout(() => setProfileErrorMessage(""), 5000);
        }
    });

    const changeLoginMethodMutation = useMutation({
        mutationFn: (payload: any) => userService.updateProfile(payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            setLoginMethod(variables.loginMethod.toLowerCase());
            setSecurityError("");
            setSecurityMessage(`Login method successfully updated to ${variables.loginMethod}.`);
            setTimeout(() => setSecurityMessage(""), 4000);
        },
        onError: (err: any) => {
            setSecurityMessage("");
            setSecurityError(err.response?.data?.message || "Failed to update login method.");
            setTimeout(() => setSecurityError(""), 5000);
        }
    });

    const changePasswordMutation = useMutation({
        mutationFn: (payload: any) => userService.changePassword(payload),
        onSuccess: () => {
            setPasswordSuccess("Your password has been updated successfully.");
            setPasswordError("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setPasswordSuccess(""), 4000);
        },
        onError: (err: any) => {
            setPasswordError(err.response?.data?.message || "Failed to update password.");
            setPasswordSuccess("");
        }
    });

    const requestOtpMutation = useMutation({
        mutationFn: (value: string) => contactModalType === "email" ? userService.sendNewEmailOtp(value) : userService.sendNewPhoneOtp(value),
        onSuccess: () => {
            setContactModalStep("verify");
            setContactModalError("");
        },
        onError: (err: any) => {
            setContactModalError(err.response?.data?.message || "Failed to send verification code.");
        }
    });

    const verifyOtpMutation = useMutation({
        mutationFn: (payload: { identifier: string; otp: string }) => 
            contactModalType === "email" ? userService.verifyNewEmail(payload) : userService.verifyNewPhone(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            closeContactModal();
            setSecurityError("");
            setSecurityMessage(`${contactModalType === "email" ? "Email Address" : "Phone Number"} updated successfully!`);
            setTimeout(() => setSecurityMessage(""), 4000);
        },
        onError: (err: any) => {
            setContactModalError(err.response?.data?.message || "Invalid or expired verification code.");
        }
    });

    // ==========================================
    // Handlers
    // ==========================================
    const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateProfileMutation.mutate({ firstName, lastName, cityId: cityId ? Number(cityId) : null });
    };

    const handleCancelLocation = () => {
        setProvinceId(user?.provinceId ? String(user.provinceId) : "");
        setCityId(user?.cityId ? String(user.cityId) : "");
        setIsEditingLocation(false);
    };

    const handleLoginMethodChange = (method: 'EMAIL' | 'PHONE') => {
        // برای جلوگیری از ارور اعتبارسنجی بک‌اند، کل اطلاعات مورد نیاز را همراه متد لاگین می‌فرستیم
        const payload: any = {
            firstName: firstName || user?.firstName || "Unknown",
            lastName: lastName || user?.lastName || "Unknown",
            loginMethod: method
        };
        
        if (cityId || user?.cityId) {
            payload.cityId = cityId ? Number(cityId) : Number(user.cityId);
        }

        changeLoginMethodMutation.mutate(payload);
    };

    const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        
        // الگوی دقیق و سخت‌گیرانه برای پسورد (حروف بزرگ، کوچک، عدد، علامت ویژه، حداقل ۸ حرف)
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(newPassword)) {
            setPasswordError("Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.");
            return;
        }

        changePasswordMutation.mutate({ currentPassword, newPassword, confirmPassword });
    };

    const openContactModal = (type: "email" | "phone") => {
        setContactModalType(type);
        setContactModalStep("request");
        setNewContactValue("");
        setOtpCode("");
        setContactModalError("");
        setIsContactModalOpen(true);
    };

    const closeContactModal = () => {
        setIsContactModalOpen(false);
        setContactModalStep("request");
        setNewContactValue("");
        setOtpCode("");
        setContactModalError("");
    };

    const handleRequestOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newContactValue) return setContactModalError(`Please enter a valid ${contactModalType}.`);
        requestOtpMutation.mutate(newContactValue);
    };

    const handleVerifyOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (otpCode.length < 5) return setContactModalError("Please enter a valid code.");
        verifyOtpMutation.mutate({ identifier: newContactValue, otp: otpCode });
    };

    // ==========================================
    // Styles
    // ==========================================
    const inputClass = "block w-full cursor-none rounded-2xl border-2 border-gray-100 bg-gray-50/50 p-4 text-sm font-medium text-zinc-900 outline-none transition-all focus:border-zinc-950 focus:bg-white hover:border-gray-200";
    const labelClass = "mb-2 block text-sm font-bold text-gray-700";
    const readonlyTextClass = "flex items-center w-full cursor-default rounded-2xl border-2 border-transparent bg-gray-50/80 p-4 text-sm font-medium text-zinc-900";

    return (
        <div className="flex flex-col gap-8 relative">
            
            {/* ========================================== */}
            {/* Modal for Changing Email/Phone             */}
            {/* ========================================== */}
            <AnimatePresence>
                {isContactModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl"
                        >
                            <button onClick={closeContactModal} className="absolute right-6 top-6 cursor-none text-gray-400 transition-colors hover:text-black">
                                <X size={24} />
                            </button>

                            <div className="mb-6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                                    {contactModalType === "email" ? <Mail size={24} className="text-zinc-950" /> : <Smartphone size={24} className="text-zinc-950" />}
                                </div>
                                <h3 className="text-2xl font-black text-zinc-950">
                                    Change {contactModalType === "email" ? "Email" : "Phone Number"}
                                </h3>
                                <p className="mt-2 text-sm font-medium text-zinc-500">
                                    {contactModalStep === "request" 
                                        ? `Enter your new ${contactModalType} to receive a verification code.` 
                                        : `Enter the code sent to ${newContactValue}.`}
                                </p>
                            </div>

                            {contactModalError && (
                                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
                                    <AlertCircle size={18} /> {contactModalError}
                                </div>
                            )}

                            {contactModalStep === "request" && (
                                <form onSubmit={handleRequestOtpSubmit} className="flex flex-col gap-4">
                                    <input
                                        type={contactModalType === "email" ? "email" : "tel"}
                                        placeholder={contactModalType === "email" ? "new@example.com" : "0912..."}
                                        value={newContactValue}
                                        onChange={(e) => { setNewContactValue(e.target.value); setContactModalError(""); }}
                                        className={inputClass}
                                        dir={contactModalType === "phone" ? "ltr" : "auto"}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={requestOtpMutation.isPending}
                                        className="mt-2 w-full cursor-none rounded-full bg-zinc-950 py-4 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {requestOtpMutation.isPending ? "Sending Code..." : "Send Verification Code"}
                                    </button>
                                </form>
                            )}

                            {contactModalStep === "verify" && (
                                <form onSubmit={handleVerifyOtpSubmit} className="flex flex-col gap-4 text-center">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="• • • • • •"
                                        value={otpCode}
                                        onChange={(e) => { 
                                            const englishNum = e.target.value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
                                            setOtpCode(englishNum.replace(/\D/g, "")); 
                                            setContactModalError(""); 
                                        }}
                                        className="block w-full cursor-none rounded-2xl border-2 border-gray-100 bg-gray-50/50 p-4 text-center text-2xl font-black tracking-[0.5em] text-zinc-950 outline-none transition-all focus:border-zinc-950 focus:bg-white"
                                        autoFocus
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={verifyOtpMutation.isPending}
                                        className="mt-2 w-full cursor-none rounded-full bg-zinc-950 py-4 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Update"}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => { setContactModalStep("request"); setOtpCode(""); }} 
                                        className="mt-2 cursor-none text-xs font-bold text-zinc-500 hover:text-zinc-950"
                                    >
                                        Change Contact Info
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================== */}
            {/* Personal Information Form                  */}
            {/* ========================================== */}
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

                <AnimatePresence>
                    {profileErrorMessage && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600"
                        >
                            <AlertCircle size={18} /> {profileErrorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

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

            {/* ========================================== */}
            {/* Account & Security Information             */}
            {/* ========================================== */}
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-zinc-950">Contact & Security</h2>
                            <p className="text-sm font-medium text-zinc-500">Manage your email, phone number, and password.</p>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {securityMessage && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-600"
                        >
                            <CheckCircle2 size={18} /> {securityMessage}
                        </motion.div>
                    )}
                    {securityError && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600"
                        >
                            <AlertCircle size={18} /> {securityError}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Login Method Toggle - ظاهر اصلی بازگردانی شد */}
                <div className="flex flex-col gap-4 border-b border-gray-100 py-5 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h3 className="font-semibold text-gray-900 select-none cursor-none">Login Method</h3>
                        <p className="text-sm text-gray-500 select-none cursor-none">Choose how you prefer to sign in.</p>
                    </div>
                    <div className="flex rounded-xl bg-gray-100 p-1">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            disabled={changeLoginMethodMutation.isPending}
                            onClick={() => handleLoginMethodChange('EMAIL')}
                            className={`flex cursor-none items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                loginMethod === "email" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                            } ${changeLoginMethodMutation.isPending ? "opacity-50" : ""}`}
                        >
                            <Mail size={16} /> Email
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            disabled={changeLoginMethodMutation.isPending}
                            onClick={() => handleLoginMethodChange('PHONE')}
                            className={`flex cursor-none items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                loginMethod === "phone" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                            } ${changeLoginMethodMutation.isPending ? "opacity-50" : ""}`}
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
                            onClick={() => openContactModal("email")}
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
                            onClick={() => openContactModal("phone")}
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
                        <AnimatePresence>
                            {passwordError && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }} 
                                    className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600"
                                >
                                    <AlertCircle size={18} className="shrink-0" /> <span className="leading-relaxed">{passwordError}</span>
                                </motion.div>
                            )}
                            {passwordSuccess && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }} 
                                    className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-600"
                                >
                                    <CheckCircle2 size={18} className="shrink-0" /> <span>{passwordSuccess}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-bold text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClass}
                                    required
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
                                    required
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
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={changePasswordMutation.isPending}
                                className="cursor-none rounded-xl border border-zinc-300 bg-white px-6 py-2.5 text-xs font-bold text-zinc-900 transition-all hover:bg-zinc-950 hover:text-white disabled:opacity-50"
                            >
                                {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}