"use client";

import { useQuery } from "@tanstack/react-query";
import { ticketService } from "../services/ticket.service";
import { motion } from "framer-motion";
import { Ticket, Calendar, MapPin, Search, AlertCircle, Trophy } from "lucide-react";
import { useState } from "react";

export default function TicketHistoryTab() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['my-tickets'],
        queryFn: ticketService.getMyTickets
    });

    const tickets = data?.data || [];

    // اضافه شدن جستجو بر اساس ورزش (sport)
    const filteredTickets = tickets.filter((t: any) => 
        (t.hostTeam || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (t.guestTeam || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (t.ticketCode || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.sport || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        if (!status) return "bg-gray-100 text-gray-500 border-gray-200";
        switch (status.toUpperCase()) {
            case "ISSUED": return "bg-emerald-50 text-emerald-600 border-emerald-200";
            case "USED": return "bg-gray-100 text-gray-500 border-gray-200";
            case "CANCELLED":
            case "EXPIRED": return "bg-red-50 text-red-600 border-red-200";
            default: return "bg-blue-50 text-blue-600 border-blue-200";
        }
    };

    if (isError) {
        return (
            <div className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600">
                    <AlertCircle size={18} /> Error loading tickets: {(error as any)?.message || "Server Error"}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                        <Ticket size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black select-none cursor-none">My Tickets</h2>
                        <p className="mt-1 text-sm text-gray-500 select-none cursor-none">View and manage your purchased match tickets.</p>
                    </div>
                </div>
                
                <div className="relative w-full sm:max-w-xs">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search sport, teams, or codes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-black outline-none transition-all focus:border-black focus:bg-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full py-10 text-center text-sm font-medium text-gray-400">Loading tickets...</div>
                ) : filteredTickets.length === 0 ? (
                    <div className="col-span-full py-10 flex flex-col items-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4"><Ticket size={24}/></div>
                        <p className="text-sm font-bold text-gray-900">No tickets found</p>
                    </div>
                ) : (
                    filteredTickets.map((t: any) => {
                        const safePrice = Number(t.price || 0).toFixed(2);
                        const safeDate = t.matchDate ? new Date(t.matchDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "TBA";

                        return (
                            <motion.div 
                                key={t.id} 
                                whileHover={{ y: -4 }}
                                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-gray-100 bg-white transition-shadow hover:shadow-lg"
                            >
                                <div className="p-5">
                                    <div className="mb-4 flex items-start justify-between">
                                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${getStatusStyle(t.status)}`}>
                                            {t.status || "UNKNOWN"}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400 select-none cursor-none">{t.ticketCode}</span>
                                    </div>

                                    {/* بج نمایش نوع ورزش */}
                                    <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
                                        <Trophy size={14} />
                                        <span>{t.sport || "Match"}</span>
                                    </div>
                                    
                                    <h3 className="mb-4 text-lg font-black text-gray-900 select-none cursor-none">
                                        {t.hostTeam || "Unknown"} vs {t.guestTeam || "Unknown"}
                                    </h3>

                                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-2"><Calendar size={14} /> {safeDate}</div>
                                        <div className="flex items-center gap-2"><MapPin size={14} /> {t.venueName || "Unknown Venue"}</div>
                                    </div>
                                </div>

                                <div className="border-t-2 border-dashed border-gray-100 bg-gray-50 p-4 flex items-center justify-center">
                                    <span className="font-black text-lg text-gray-900 select-none cursor-none">${safePrice}</span>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}