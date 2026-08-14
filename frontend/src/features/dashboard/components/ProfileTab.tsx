"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { locationService, type LocationItem } from "@/services/location.service";
import { User, Mail, Smartphone, MapPin, Shield, CheckCircle2 } from "lucide-react";

export default function ProfileTab({ user }: { user?: any }) {
    const queryClient = useQueryClient();

    // ==========================================
    // STATES
    // ==========================================
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [provinceId, setProvinceId] = useState("");
    const [cityId, setCityId] = useState("");

    const [provinces, setProvinces] = useState<LocationItem[]>([]);
    const [cities, setCities] = useState<LocationItem[]>([]);

    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

    // ==========================================
    // EFFECTS
    // ==========================================
    // Sync user data to states when user prop changes
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName && user.lastName !== "-" ? user.lastName : "");
            setProvinceId(user.provinceId ? String(user.provinceId) : "");
            setCityId(user.cityId ? String(user.cityId) : "");
        }
    }, [user]);

    // Fetch provinces on mount
    useEffect(() => {
        locationService.getProvinces().then(setProvinces);
    }, []);

    // Fetch cities when province changes
    useEffect(() => {
        if (provinceId) {
            locationService.getCitiesByProvince(provinceId).then((data) => {
                setCities(data);
                // Reset city if the new province doesn't have the currently selected city
                if (!data.find((c) => c.id === cityId)) {
                    setCityId("");
                }
            });
        } else {
            setCities([]);
            setCityId("");
        }
    }, [provinceId]);

    // ==========================================
    // MUTATION
    // ==========================================
    const updateProfileMutation = useMutation({
        mutationFn: (payload: any) => userService.updateProfile(payload),
        onSuccess: () => {
            // Invalidate the cache to trigger a refetch in useProfile hook
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            
            // Show success message temporarily
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

    // ==========================================
    // STYLES
    // ==========================================
    const inputClass = "block w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 p-4 text-sm font-medium text-zinc-900 outline-none transition-all focus:border-zinc-950 focus:bg-white hover:border-gray-200";
    const labelClass = "mb-2 block text-sm font-bold text-gray-700";

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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Province</label>
                            <div className="relative">
                                <MapPin size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={provinceId}
                                    onChange={(e) => setProvinceId(e.target.value)}
                                    className={`${inputClass} pl-12 appearance-none`}
                                >
                                    <option value="" disabled>Select Province</option>
                                    {provinces.map((prov) => (
                                        <option key={prov.id} value={prov.id}>
                                            {prov.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>City</label>
                            <div className="relative">
                                <MapPin size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={cityId}
                                    onChange={(e) => setCityId(e.target.value)}
                                    disabled={!provinceId}
                                    className={`${inputClass} pl-12 appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <option value="" disabled>Select City</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
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

            {/* Contact & Security Information */}
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-zinc-950">Contact & Security</h2>
                        <p className="text-sm font-medium text-zinc-500">Manage your email and phone number.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            className="w-full rounded-xl border-2 border-zinc-200 bg-white py-2 text-sm font-bold text-zinc-900 transition-colors hover:border-zinc-950 hover:bg-zinc-50"
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
                            className="w-full rounded-xl border-2 border-zinc-200 bg-white py-2 text-sm font-bold text-zinc-900 transition-colors hover:border-zinc-950 hover:bg-zinc-50"
                            onClick={() => console.log("Open Phone Change Modal")}
                        >
                            Change Phone Number
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}