"use client";

import { DashboardTab } from "../types";
import { User, Wallet, Ticket, CreditCard, LifeBuoy, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    activeTab: DashboardTab;
    setActiveTab: (tab: DashboardTab) => void;
    user?: any;
    isLoading?: boolean;
}

export default function DashboardSidebar({ activeTab, setActiveTab, user, isLoading }: SidebarProps) {
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem("token"); 
        router.push("/auth?mode=login"); 
    };

    const menuItems: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
        { id: 'profile', label: 'Profile Details', icon: <User size={20} /> },
        { id: 'wallet', label: 'My Wallet', icon: <Wallet size={20} /> },
        { id: 'tickets', label: 'My Tickets', icon: <Ticket size={20} /> },
        { id: 'support', label: 'Support & Reports', icon: <LifeBuoy size={20} /> },
    ];

    return (
        <aside className="w-full md:w-72 shrink-0">
            <div className="sticky top-28 flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

               {/* User Mini Profile */}
                <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6 pt-2 px-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-lg font-bold text-white uppercase">
                        {isLoading ? "..." : user?.firstName?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 capitalize">
                            {isLoading ? "Loading..." : `${user?.firstName || "User"} ${user?.lastName !== "-" ? user?.lastName : ""}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {user?.role === "BUYER" ? "Standard Member" : "Premium Member"}
                        </p>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                activeTab === item.id
                                    ? "bg-black text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="mt-8 border-t border-gray-100 pt-4">
                    <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={20} />
                        Log Out
                    </button>
                </div>
            </div>
        </aside>
    );
}