"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/client";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CreditCard, AlertCircle, CheckCircle2, X, Building2, Calendar, Receipt } from "lucide-react";

export default function PendingOrdersTab() {
    const queryClient = useQueryClient();
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [currentReservationId, setCurrentReservationId] = useState<number | null>(null);
    const [currentAmount, setCurrentAmount] = useState<number>(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);

    // ==========================================
    // Fetch Data
    // ==========================================
    const { data: response, isLoading } = useQuery({
        queryKey: ['active-reservations'],
        queryFn: async () => {
            const res = await apiClient.get("/reservations/active");
            return res.data.data;
        },
        refetchInterval: 10000 // هر 10 ثانیه چک می‌کند تا رزروهای منقضی شده حذف شوند
    });
    
    const pendingOrders = response || [];

    const { data: paymentMethods = [] } = useQuery({
        queryKey: ['payment-methods'],
        queryFn: async () => {
            const res = await apiClient.get("/payments/methods");
            return res.data.data;
        }
    });

    // ==========================================
    // Pay Mutation
    // ==========================================
    const payMutation = useMutation({
        mutationFn: async () => {
            const res = await apiClient.post(`/payments/checkout`, {
                reservationId: currentReservationId,
                paymentMethodId: selectedPaymentMethod
            });
            if (res.data && res.data.success === false) throw new Error(res.data.message);
            return res.data;
        },
        onSuccess: () => {
            setToast({ message: "Payment successful! Your tickets are now issued.", type: 'success' });
            setIsPaymentModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['active-reservations'] });
            queryClient.invalidateQueries({ queryKey: ['my-tickets'] }); // آپدیت شدن لیست بلیت‌ها
        },
        onError: (err: any) => {
            setToast({ message: err.message || err.response?.data?.message || "Payment failed.", type: 'error' });
        }
    });

    if (toast) setTimeout(() => setToast(null), 5000);

    const handleOpenPayment = (id: number, amount: number) => {
        setCurrentReservationId(id);
        setCurrentAmount(amount);
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8 relative">
            
            {/* Custom Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} 
                        className={`absolute top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                        {toast.message}
                        <button onClick={() => setToast(null)} className="ml-4 opacity-70 hover:opacity-100"><X size={16}/></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment Modal */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl">
                            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute right-6 top-6 text-gray-400 hover:text-black"><X size={24} /></button>
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <h3 className="text-2xl font-black text-zinc-950">Complete Payment</h3>
                                <p className="mt-2 text-sm font-bold text-red-500 flex items-center gap-1"><Clock size={16}/> Pay before the timer expires.</p>
                            </div>
                            <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl">
                                <span className="font-bold text-gray-500">Total Amount:</span>
                                <span className="text-2xl font-black text-black">${currentAmount}</span>
                            </div>
                            <div className="flex flex-col gap-3 mb-8">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Payment Gateway</label>
                                {paymentMethods.map((method: any) => (
                                    <button key={method.id} onClick={() => setSelectedPaymentMethod(method.id)} className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 transition-all ${selectedPaymentMethod === method.id ? 'border-zinc-950 bg-zinc-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                        <Building2 size={20} className={selectedPaymentMethod === method.id ? "text-zinc-950" : "text-gray-400"} />
                                        <span className="font-bold text-zinc-900">{method.description}</span>
                                    </button>
                                ))}
                            </div>
                            <button disabled={!selectedPaymentMethod || payMutation.isPending} onClick={() => payMutation.mutate()} className="flex w-full items-center justify-center rounded-full bg-zinc-950 py-4 text-sm font-bold text-white transition-opacity disabled:opacity-50">
                                {payMutation.isPending ? "Processing..." : `Pay $${currentAmount} Now`}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                                        onClick={() => handleOpenPayment(order.reservationId, order.totalAmount)}
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