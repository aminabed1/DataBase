"use client";

import { useState } from "react";
import { ShieldCheck, MapPin, User as UserIcon, Camera, Smartphone, Mail, CalendarDays } from "lucide-react";

export default function ProfileTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [loginMethod, setLoginMethod] = useState("email");

    // تابع برای هندل کردن دکمه‌های امنیتی (فعلاً فقط لاگ می‌کنه تا بعداً مودال رو بهش وصل کنیم)
    const handleSecureAction = (actionType: string) => {
        console.log(`Open OTP Modal for: ${actionType}`);
        // اینجا در آینده مودال OTP رو باز می‌کنیم
    };

    const handleSubmitGeneralInfo = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    const inputClass = "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition-colors focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black";
    const labelClass = "mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500";
    const sectionClass = "rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8";

    return (
        <div className="flex flex-col gap-8">

            {/* =========================================
                بخش اول: اطلاعات عمومی (با دکمه ذخیره)
            ========================================= */}
            <form onSubmit={handleSubmitGeneralInfo} className={sectionClass}>
                <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                            <UserIcon size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black">General Information</h2>
                            <p className="text-sm text-gray-500">Update your basic details and location.</p>
                        </div>
                    </div>
                    {/* دکمه ذخیره فقط برای این بخش کار می‌کنه */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {/* Profile Picture */}
                <div className="mb-8 flex items-center gap-6">
                    <div className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black text-2xl font-bold text-white shadow-md">
                        M
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                            <Camera size={24} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Profile Picture</h3>
                        <p className="mt-1 text-xs text-gray-500">Click to upload (JPG, PNG up to 5MB)</p>
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
                            <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="date" className={`${inputClass} pl-10 text-gray-600`} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Province</label>
                        <select className={inputClass} defaultValue="tehran">
                            <option value="">Select Province</option>
                            <option value="tehran">Tehran</option>
                            <option value="alborz">Alborz</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>City</label>
                        <select className={inputClass} defaultValue="tehran">
                            <option value="">Select City</option>
                            <option value="tehran">Tehran</option>
                            <option value="karaj">Karaj</option>
                        </select>
                    </div>
                </div>
            </form>

            {/* =========================================
                بخش دوم: امنیت و تماس (هرکدام نیازمند OTP هستند)
            ========================================= */}
            <div className={sectionClass}>
                <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-black">Account & Security</h2>
                        <p className="text-sm text-gray-500">Manage sensitive data. Changes require verification.</p>
                    </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-4 border-b border-gray-100 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Email Address</h3>
                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" /> mahdi@example.com
                        </p>
                    </div>
                    <button
                        onClick={() => handleSecureAction('email')}
                        className="rounded-full bg-gray-100 px-5 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-200"
                    >
                        Change Email
                    </button>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-4 border-b border-gray-100 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Phone Number</h3>
                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                            <Smartphone size={14} className="text-gray-400" /> 0912 345 6789
                        </p>
                    </div>
                    <button
                        onClick={() => handleSecureAction('phone')}
                        className="rounded-full bg-gray-100 px-5 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-200"
                    >
                        Change Phone
                    </button>
                </div>

                {/* Primary Login Method */}
                <div className="flex flex-col gap-4 border-b border-gray-100 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Login Method</h3>
                        <p className="text-sm text-gray-500">Choose how you prefer to sign in.</p>
                    </div>
                    <div className="flex rounded-xl bg-gray-100 p-1">
                        <button
                            type="button"
                            onClick={() => {
                                setLoginMethod("email");
                                handleSecureAction('login_method');
                            }}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                loginMethod === "email" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <Mail size={16} /> Email
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setLoginMethod("phone");
                                handleSecureAction('login_method');
                            }}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                loginMethod === "phone" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <Smartphone size={16} /> Phone
                        </button>
                    </div>
                </div>

                {/* Change Password */}
                <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Password</h3>
                        <p className="text-sm text-gray-500">Ensure your account is using a secure password.</p>
                    </div>
                    <button
                        onClick={() => handleSecureAction('password')}
                        className="rounded-full bg-gray-100 px-5 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-200"
                    >
                        Update Password
                    </button>
                </div>
            </div>

        </div>
    );
}