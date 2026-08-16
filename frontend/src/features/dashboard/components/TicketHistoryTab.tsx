"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketService } from "../services/ticket.service";
import apiClient from "@/services/client";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Calendar, MapPin, Search, AlertCircle, Trophy, CheckCircle2, X, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function TicketHistoryTab() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [cancelModal, setCancelModal] = useState<number | null>(null);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['my-tickets'],
        queryFn: ticketService.getMyTickets
    });

    const tickets = data?.data || [];

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

    const { data: penaltyData, isLoading: isPenaltyLoading } = useQuery({
        queryKey: ['penalty', cancelModal],
        queryFn: async () => {
            if (!cancelModal) return null;
            const res = await apiClient.get(`/cancellations/${cancelModal}/penalty`);
            return res.data.data;
        },
        enabled: !!cancelModal
    });

    const cancelMutation = useMutation({
        mutationFn: async (reservationId: number) => {
            const res = await apiClient.post(`/cancellations/${reservationId}?reason=Requested+by+user`);
            return res.data;
        },
        onSuccess: () => {
            setToast({ message: "Cancellation request submitted to support.", type: "success" });
            setCancelModal(null);
            queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
        },
        onError: (err: any) => {
            setToast({ message: err.response?.data?.message || "Failed to submit request.", type: "error" });
        }
    });

    if (toast) setTimeout(() => setToast(null), 5000);

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
        <div className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8 relative">
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} 
                        className={`absolute top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                        {toast.message}
                        <button onClick={() => setToast(null)} className="ml-4 opacity-70 hover:opacity-100"><X size={16}/></button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {cancelModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl">
                            <button onClick={() => setCancelModal(null)} className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors cursor-none"><X size={24} /></button>
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <h3 className="text-2xl font-black text-zinc-950">Cancel Reservation</h3>
                                <p className="mt-2 text-sm text-gray-500 font-medium">Review the penalty calculation before submitting.</p>
                            </div>
                            
                            {isPenaltyLoading ? (
                                <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-zinc-400" size={32}/></div>
                            ) : penaltyData ? (
                                <div className="flex flex-col gap-3 mb-8">
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                        <span className="text-gray-500 font-bold text-sm">Total Paid</span>
                                        <span className="font-black text-zinc-900">${penaltyData.totalPaid}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl text-red-600">
                                        <span className="font-bold text-sm">Penalty ({penaltyData.penaltyPercentage}%)</span>
                                        <span className="font-black">-${penaltyData.penaltyAmount}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl text-emerald-700">
                                        <span className="font-bold text-sm">Estimated Refund</span>
                                        <span className="font-black">+${penaltyData.refundAmount}</span>
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-2 flex items-start gap-1.5 font-medium leading-relaxed">
                                        <AlertTriangle size={14} className="shrink-0 text-amber-500 mt-0.5"/>
                                        Your request will be reviewed by support. Upon approval, the refunded balance will be credited to your wallet.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-red-500 text-sm font-bold py-4">Failed to load penalty details.</div>
                            )}

                            <button 
                                disabled={isPenaltyLoading || !penaltyData || cancelMutation.isPending} 
                                onClick={() => cancelMutation.mutate(cancelModal)} 
                                className="flex w-full cursor-none items-center justify-center rounded-full bg-zinc-900 hover:bg-black py-4 text-sm font-bold text-white transition-all disabled:opacity-50"
                            >
                                {cancelMutation.isPending ? "Submitting Request..." : "Submit Request to Support"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                        const matchDateObj = new Date(t.matchDate);
                        const isFuture = matchDateObj.getTime() > new Date().getTime();
                        const safeDate = t.matchDate ? matchDateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "TBA";

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

                                    <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-1 text-blue-600">
                                            <Trophy size={14} />
                                            <span>{t.sport || "Match"}</span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-amber-600">{t.category}</span>
                                    </div>
                                    
                                    <h3 className="mb-4 text-lg font-black text-gray-900 select-none cursor-none">
                                        {t.hostTeam || "Unknown"} vs {t.guestTeam || "Unknown"}
                                    </h3>

                                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-2"><Calendar size={14} /> {safeDate}</div>
                                        <div className="flex items-center gap-2"><MapPin size={14} /> {t.venueName || "Unknown Venue"}</div>
                                    </div>
                                </div>

                                <div className="border-t-2 border-dashed border-gray-100 bg-gray-50 p-4 flex items-center justify-between">
                                    <span className="font-black text-lg text-gray-900 select-none cursor-none">${safePrice}</span>
                                    
                                    {t.status === "ISSUED" && isFuture && t.reservationId && (
                                        t.cancellationRequested ? (
                                            <div className="text-xs font-bold bg-orange-100 text-orange-600 px-4 py-2 rounded-xl cursor-not-allowed select-none flex items-center justify-center">
                                                Cancellation Pending
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setCancelModal(t.reservationId)}
                                                className="text-xs font-bold bg-zinc-100 text-zinc-700 px-4 py-2 rounded-xl hover:bg-zinc-200 transition-colors cursor-none"
                                            >
                                                Request Cancel
                                            </button>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}