"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "../services/report.service";
import { motion, AnimatePresence } from "framer-motion";
import { LifeBuoy, Send, MessageSquare, CheckCircle2, Clock, ChevronDown, Ticket, AlertCircle } from "lucide-react";

// ==========================================
// Custom Dropdown Component
// ==========================================
function CustomDropdown({ value, options, onChange, placeholder }: { value: string, options: {label: string, value: string}[], onChange: (val: string) => void, placeholder: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selected = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="relative z-20">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full cursor-none items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition-all hover:bg-gray-100 focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
            >
                <span className={selected ? "text-gray-900" : "text-gray-400"}>{selected ? selected.label : placeholder}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`w-full cursor-none rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${value === opt.value ? 'bg-black font-semibold text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ==========================================
// Main Support Component
// ==========================================
export default function SupportTab() {
    const queryClient = useQueryClient();
    const [category, setCategory] = useState("");
    const [relatedId, setRelatedId] = useState("");
    const [message, setMessage] = useState("");
    const [expandedTicket, setExpandedTicket] = useState<number | null>(null);

    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    const { data: reportsData, isLoading: isReportsLoading } = useQuery({
        queryKey: ['my-reports'],
        queryFn: reportService.getUserReports
    });
    
    const myReports = reportsData?.data || [];

    const submitMutation = useMutation({
        mutationFn: (data: any) => reportService.submitReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-reports'] });
            setCategory("");
            setRelatedId("");
            setMessage("");
            setFormError("");
            setFormSuccess("Report submitted successfully! Our team will review it.");
            setTimeout(() => setFormSuccess(""), 5000);
        },
        onError: (err: any) => {
            setFormSuccess("");
            setFormError(err.response?.data?.message || "Failed to submit report.");
            setTimeout(() => setFormError(""), 5000);
        }
    });

    const categories = [
        { label: "Payment Issue", value: "Payment Issue" },
        { label: "Match Time Change", value: "Match Time Change" },
        { label: "Seat/Section Issue", value: "Seat/Section Issue" },
        { label: "Unexpected Cancellation", value: "Unexpected Cancellation" },
        { label: "Other (Pricing, Status)", value: "Other" },
    ];

    const handleSubmitTicket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !message.trim()) return;

        // استخراج عدد از تکست (مثلاً تبدیل TRX-12 به 12)
        const extractedPaymentId = relatedId ? parseInt(relatedId.replace(/\D/g, ""), 10) : null;

        submitMutation.mutate({
            subject: category,
            description: message,
            paymentId: isNaN(extractedPaymentId as number) ? null : extractedPaymentId
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const inputClass = "block w-full cursor-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition-all focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black focus:shadow-sm";
    const labelClass = "mb-2 block cursor-none text-xs font-bold uppercase tracking-wider text-gray-500 select-none";
    const sectionClass = "rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8 h-full";

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            {/* LEFT COLUMN: Submit New Ticket */}
            <div className="lg:col-span-5 relative z-10">
                <form onSubmit={handleSubmitTicket} className={sectionClass}>
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                            <LifeBuoy size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black select-none cursor-none">Submit a Request</h2>
                            <p className="text-sm text-gray-500 select-none cursor-none">We're here to help you.</p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {formError && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
                                <AlertCircle size={18} /> {formError}
                            </motion.div>
                        )}
                        {formSuccess && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-600">
                                <CheckCircle2 size={18} /> {formSuccess}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-5">
                        <div>
                            <label className={labelClass}>Issue Category *</label>
                            <CustomDropdown value={category} options={categories} onChange={setCategory} placeholder="Select the issue type" />
                        </div>

                        <div>
                            <label className={labelClass}>Ticket or Transaction ID (Optional)</label>
                            <div className="relative">
                                <Ticket size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="e.g. 12"
                                    value={relatedId}
                                    onChange={(e) => setRelatedId(e.target.value)}
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Description *</label>
                            <textarea
                                required
                                rows={5}
                                placeholder="Please describe your issue in detail..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className={`${inputClass} resize-none`}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={submitMutation.isPending || !category || !message.trim()}
                            className="mt-2 flex w-full cursor-none items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-bold text-white transition-opacity disabled:opacity-50"
                        >
                            {submitMutation.isPending ? "Submitting..." : "Submit Report"}
                            {!submitMutation.isPending && <Send size={16} />}
                        </motion.button>
                    </div>
                </form>
            </div>

            {/* RIGHT COLUMN: Ticket History */}
            <div className="lg:col-span-7">
                <div className={sectionClass}>
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black select-none cursor-none">Your Support Tickets</h2>
                            <p className="text-sm text-gray-500 select-none cursor-none">Track the status of your reports.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isReportsLoading ? (
                            <p className="text-sm text-gray-400 text-center py-8">Loading your reports...</p>
                        ) : myReports.length === 0 ? (
                            <div className="text-center py-10 flex flex-col items-center">
                                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4"><MessageSquare size={24}/></div>
                                <p className="text-sm font-bold text-gray-900">No reports found</p>
                                <p className="text-xs text-gray-400 mt-1">You haven't submitted any support requests yet.</p>
                            </div>
                        ) : (
                            myReports.map((ticket: any) => {
                                const isExpanded = expandedTicket === ticket.id;
                                const isReviewed = ticket.status === "RESOLVED" || ticket.status === "CLOSED";

                                return (
                                    <div key={ticket.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                                            className="flex w-full cursor-none flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between text-left"
                                        >
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-bold text-gray-900 select-none cursor-none">{ticket.subject}</h4>
                                                    {isReviewed ? (
                                                        <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase text-green-600">
                                                            <CheckCircle2 size={12} /> Reviewed
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-600">
                                                            <Clock size={12} /> Pending
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500 select-none cursor-none">
                                                    ID: SUP-{ticket.id} • {formatDate(ticket.createdAt)} {ticket.relatedPaymentId && `• Payment ID: ${ticket.relatedPaymentId}`}
                                                </p>
                                            </div>
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                                                <ChevronDown size={16} />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                >
                                                    <div className="border-t border-gray-50 bg-gray-50/50 p-5">
                                                        <div className="mb-4">
                                                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400 select-none cursor-none">Your Report</span>
                                                            <p className="text-sm leading-relaxed text-gray-700 select-none cursor-none">{ticket.description}</p>
                                                        </div>

                                                        <div>
                                                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400 select-none cursor-none">Support Reply</span>
                                                            {ticket.adminReply ? (
                                                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                                                    <p className="text-sm leading-relaxed text-gray-900 select-none cursor-none">{ticket.adminReply}</p>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 p-4 text-orange-700">
                                                                    <AlertCircle size={16} className="shrink-0" />
                                                                    <p className="text-sm font-medium select-none cursor-none">Our team is currently reviewing your report. Please check back later.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}