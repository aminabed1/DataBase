"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/client";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CreditCard, Calendar, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PendingOrdersTab() {
    const router = useRouter();

    const { data: response, isLoading } = useQuery({
        queryKey: ['active-reservations'],
        queryFn: async () => {
            const res = await apiClient.get("/reservations/active");
            return res.data.data;
        },
        refetchInterval: 10000 
    });
    
    const pendingOrders = response || [];

    const handleOpenPayment = (order: any) => {
        // ساخت آبجکتی مشابه ساختار صفحه PaymentView با استفاده از دیتای جدید بک‌اند
        const checkoutDetails = {
            match: {
                matchId: order.reservationId,
                sport: order.sport,
                hostTeam: order.hostTeam,
                guestTeam: order.guestTeam,
                venue: order.venue,
                datetime: order.reservedAt
            },
            selectedSeats: order.seats || []
        };
        
        sessionStorage.setItem("checkout_details", JSON.stringify(checkoutDetails));
        router.push(`/booking/payment?reservationId=${order.reservationId}`);
    };

    return (
        <div className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8 relative">
            <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black select-none cursor-none">Pending Orders</h2>
                        <p className="mt-1 text-sm text-gray-500 select-none cursor-none">Complete your payment within 10 minutes to secure your seats.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    <div className="py-10 text-center text-sm font-medium text-gray-400">Loading your reservations...</div>
                ) : pendingOrders.length === 0 ? (
                    <div className="py-10 flex flex-col items-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4"><Receipt size={24}/></div>
                        <p className="text-sm font-bold text-gray-900">No pending orders</p>
                        <p className="text-xs text-gray-500 mt-1">You don't have any unpaid reservations right now.</p>
                    </div>
                ) : (
                    pendingOrders.map((order: any) => {
                        const expiryDate = new Date(order.expiredAt);
                        const isExpired = expiryDate.getTime() < new Date().getTime();

                        return (
                            <motion.div 
                                key={order.reservationId} 
                                initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
                                className={`flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl border-2 transition-all ${isExpired ? 'border-red-100 bg-red-50/30 opacity-70' : 'border-gray-100 bg-white hover:shadow-md'}`}
                            >
                                <div className="flex flex-col gap-2 mb-4 sm:mb-0 w-full sm:w-auto">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {isExpired ? 'Expired' : order.status}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400">RES-{order.reservationId}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                                        <Calendar size={16} className="text-gray-400"/>
                                        Reserved at: {new Date(order.reservedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-red-500">
                                        <Clock size={14} />
                                        Expires at: {expiryDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                                    <div className="text-2xl font-black text-zinc-900">${order.totalAmount}</div>
                                    <button 
                                        disabled={isExpired}
                                        onClick={() => handleOpenPayment(order)}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-950 text-white text-sm font-bold rounded-xl transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        <CreditCard size={16} />
                                        {isExpired ? 'Expired' : 'Pay Now'}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}