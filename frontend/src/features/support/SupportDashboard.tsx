"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportService } from "@/services/support.service"; // مسیر سرویس را در صورت نیاز اصلاح کنید
import {
    ShieldCheck, Ticket, AlertCircle, MessageSquare,
    CheckCircle2, XCircle, Search, RefreshCw, LogOut,
    Clock, CreditCard, User, Building2, Eye, Ban, Send,
    SlidersHorizontal
} from "lucide-react";

// ==========================================
// Mock Database State for Support Ops
// ==========================================
const INITIAL_RESERVATIONS = [
    {
        id: 1,
        user: { name: "Ali Rezaei", email: "ali@test.com", phone: "09121111111" },
        match: "Esteghlal vs Persepolis",
        venue: "Azadi Stadium",
        seat: "North Stand · R2-S4",
        amount: 250,
        status: "CONFIRMED",
        paymentStatus: "SUCCESS",
        paymentMethod: "Saman Gateway",
        transactionRef: "TRX-001",
        date: "2026-07-20 10:00"
    },
    {
        id: 4,
        user: { name: "Zahra Karami", email: "zahra@test.com", phone: "09124444444" },
        match: "Sepahan vs Tractor",
        venue: "Naghsh-e Jahan",
        seat: "South Stand · R1-S2",
        amount: 200,
        status: "CANCELLED",
        paymentStatus: "FAILED",
        paymentMethod: "Card to Card",
        transactionRef: "TRX-004",
        date: "2026-07-23 13:00"
    },
    {
        id: 5,
        user: { name: "Reza Reddington", email: "reza@test.com", phone: "09125555555" },
        match: "Mahram vs Shahrdari Gorgan",
        venue: "Azadi Basketball Hall",
        seat: "East Stand · R3-S8",
        amount: 200,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: "Wallet Balance",
        transactionRef: "TRX-005",
        date: "2026-07-24 14:00"
    }
];

const INITIAL_METHODS = [
    { id: 1, name: "Melli Gateway", status: "ALLOWED" },
    { id: 2, name: "Saman Gateway", status: "ALLOWED" },
    { id: 3, name: "Melli Bank Direct", status: "NOT_ALLOWED" },
    { id: 4, name: "Card to Card", status: "ALLOWED" },
    { id: 5, name: "Wallet Balance", status: "ALLOWED" },
    { id: 6, name: "Cash on Delivery", status: "NOT_ALLOWED" },
    { id: 7, name: "Pasargad Gateway", status: "ALLOWED" },
    { id: 8, name: "Zarinpal Gateway", status: "ALLOWED" },
];

export default function SupportDashboard() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // ==========================================
    // 1. امنیت فرانت‌اند: قفل کردن صفحه فقط برای پشتیبان‌ها
    // ==========================================
    const [isAuthorized, setIsAuthorized] = useState(false);
    useEffect(() => {
        const rawRole = localStorage.getItem("role") || "";
        const cleanRole = rawRole.replace(/['"]/g, "").toUpperCase();

        if (cleanRole !== "SUPPORT" && cleanRole !== "ROLE_SUPPORT") {
            router.push("/");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);
    const [activeTab, setActiveTab] = useState<"reservations" | "issues" | "methods" | "analytics">("reservations");

    // Local State
    const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
    const [methods, setMethods] = useState(INITIAL_METHODS);

    // Filter & Search
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIssue, setSelectedIssue] = useState<any>(null);
    const [replyText, setReplyText] = useState("");

    // Stored Procedure Search
    const [supportIdentifier, setSupportIdentifier] = useState("sup1@test.com");
    const [procResults, setProcResults] = useState<any[]>([]);
    const [procExecuted, setProcExecuted] = useState(false);

    // ==========================================
    // 2. واکشی (Fetch) ریپورت‌ها از بک‌اند
    // ==========================================
    const { data: issuesResponse, isLoading: isLoadingIssues } = useQuery({
        queryKey: ['support-issues'],
        queryFn: supportService.getAllIssues,
        enabled: isAuthorized // فقط در صورتی درخواست بزن که یوزر ادمین باشد
    });
    
    const issues = issuesResponse?.data || [];

    // ==========================================
    // 3. ارسال پاسخ (Reply) به بک‌اند
    // ==========================================
    const replyMutation = useMutation({
        mutationFn: (data: { id: number, reply: string }) => supportService.replyToIssue(data.id, data.reply),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['support-issues'] });
            setSelectedIssue(null);
            setReplyText("");
        }
    });

    // Handle Reservation Actions
    const handleUpdateReservation = (id: number, newStatus: "CONFIRMED" | "CANCELLED") => {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    // Toggle Payment Method
    const handleToggleMethod = (id: number) => {
        setMethods(prev => prev.map(m => m.id === id ? {
            ...m,
            status: m.status === "ALLOWED" ? "NOT_ALLOWED" : "ALLOWED"
        } : m));
    };

    // Reply to Issue
    const handleReplyIssue = (issueId: number) => {
        if (!replyText.trim()) return;
        replyMutation.mutate({ id: issueId, reply: replyText });
    };

    // Run Stored Procedure Simulation
    const handleRunStoredProcedure = (e: React.FormEvent) => {
        e.preventDefault();
        setProcExecuted(true);
        setProcResults([
            { userId: 4, name: "Zahra Karami", phone: "09124444444", email: "zahra@test.com", cancellationsCount: 1, reason: "Schedule change" }
        ]);
    };

    // اگر در حال چک کردن نقش کاربر است، صفحه سفید نشان بده تا ریدایرکت انجام شود
    if (!isAuthorized) return <div className="min-h-screen bg-[#F8F9FA]" />;

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#15151A] font-sans flex flex-col selection:bg-emerald-500 selection:text-white">

            {/* Top Navigation Bar */}
            <header className="h-16 bg-white border-b border-zinc-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-zinc-900 tracking-tight">PitchSide Support Console</h1>
                        <span className="text-[10px] font-mono text-zinc-400">Authenticated: sup1@test.com (SUPPORT ROLE)</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push("/matches")}
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-all"
                    >
                        View Store
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            router.push("/auth?mode=login");
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                    >
                        <LogOut size={14} /> Exit
                    </button>
                </div>
            </header>

            {/* Dashboard Container */}
            <div className="max-w-7xl w-full mx-auto p-6 flex-1 flex flex-col gap-6">

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200/70 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-[11px] font-medium text-zinc-400">Total Reservations</span>
                            <h3 className="text-2xl font-bold text-zinc-900">{reservations.length}</h3>
                        </div>
                        <div className="p-3 bg-zinc-50 rounded-xl text-zinc-700"><Ticket size={20} /></div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200/70 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-[11px] font-medium text-zinc-400">Pending Actions</span>
                            <h3 className="text-2xl font-bold text-amber-600">{reservations.filter(r => r.status === "PENDING").length}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Clock size={20} /></div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200/70 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-[11px] font-medium text-zinc-400">Open Complaints</span>
                            <h3 className="text-2xl font-bold text-red-600">{issues.filter((i: any) => i.status === "OPEN").length}</h3>
                        </div>
                        <div className="p-3 bg-red-50 rounded-xl text-red-600"><AlertCircle size={20} /></div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200/70 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-[11px] font-medium text-zinc-400">Allowed Gateways</span>
                            <h3 className="text-2xl font-bold text-emerald-700">{methods.filter(m => m.status === "ALLOWED").length} / {methods.length}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700"><SlidersHorizontal size={20} /></div>
                    </div>
                </div>

                {/* Tab Controls */}
                <div className="flex border-b border-zinc-200 gap-6 text-sm font-semibold">
                    <button
                        onClick={() => setActiveTab("reservations")}
                        className={`pb-3 relative transition-all ${activeTab === "reservations" ? "text-emerald-800" : "text-zinc-500 hover:text-zinc-800"}`}
                    >
                        Ticket & Reservation Moderation
                        {activeTab === "reservations" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("issues")}
                        className={`pb-3 relative transition-all ${activeTab === "issues" ? "text-emerald-800" : "text-zinc-500 hover:text-zinc-800"}`}
                    >
                        User Issue Reports ({issues.filter((i: any) => i.status === "OPEN").length})
                        {activeTab === "issues" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("methods")}
                        className={`pb-3 relative transition-all ${activeTab === "methods" ? "text-emerald-800" : "text-zinc-500 hover:text-zinc-800"}`}
                    >
                        Gateway Controls
                        {activeTab === "methods" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("analytics")}
                        className={`pb-3 relative transition-all ${activeTab === "analytics" ? "text-emerald-800" : "text-zinc-500 hover:text-zinc-800"}`}
                    >
                        Cancellation Analytics (SP)
                        {activeTab === "analytics" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700" />}
                    </button>
                </div>

                {/* ========================================== */}
                {/* TAB 1: RESERVATION & TICKET MANAGEMENT    */}
                {/* ========================================== */}
                {activeTab === "reservations" && (
                    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search by User, Email or Transaction Ref..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium text-zinc-800 placeholder:text-zinc-400 outline-none focus:bg-white focus:border-emerald-700"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-zinc-50/70 border-b border-zinc-100 text-zinc-400 uppercase font-semibold">
                                <tr>
                                    <th className="py-3 px-4">User</th>
                                    <th className="py-3 px-4">Match & Seat</th>
                                    <th className="py-3 px-4">Amount</th>
                                    <th className="py-3 px-4">Payment Status</th>
                                    <th className="py-3 px-4">Reservation Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                                {reservations
                                    .filter(r => r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((r) => (
                                        <tr key={r.id} className="hover:bg-zinc-50/50 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-zinc-900">{r.user.name}</div>
                                                <div className="text-[11px] text-zinc-400 font-mono">{r.user.phone}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-medium text-zinc-900">{r.match}</div>
                                                <div className="text-[11px] text-zinc-500">{r.venue} · {r.seat}</div>
                                            </td>
                                            <td className="py-3.5 px-4 font-semibold text-zinc-900">${r.amount}.00</td>
                                            <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                                        r.paymentStatus === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' :
                                                            r.paymentStatus === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                                    }`}>
                                                        {r.paymentStatus} ({r.paymentMethod})
                                                    </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                                        r.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700' :
                                                            r.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-zinc-100 text-zinc-600'
                                                    }`}>
                                                        {r.status}
                                                    </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="inline-flex gap-1.5">
                                                    {r.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => handleUpdateReservation(r.id, "CONFIRMED")}
                                                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                                            title="Approve Ticket"
                                                        >
                                                            <CheckCircle2 size={15} />
                                                        </button>
                                                    )}
                                                    {r.status !== 'CANCELLED' && (
                                                        <button
                                                            onClick={() => handleUpdateReservation(r.id, "CANCELLED")}
                                                            className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                                            title="Cancel & Revoke"
                                                        >
                                                            <XCircle size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ========================================== */}
                {/* TAB 2: ISSUES & COMPLAINTS (Connected to API) */}
                {/* ========================================== */}
                {activeTab === "issues" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-6 flex flex-col gap-3">
                            {isLoadingIssues ? (
                                <div className="p-10 text-center text-zinc-500 text-sm font-bold">Loading issues from database...</div>
                            ) : issues.length === 0 ? (
                                <div className="p-10 text-center text-zinc-500 text-sm font-bold">No active issues found.</div>
                            ) : (
                                issues.map((issue: any) => (
                                    <div
                                        key={issue.id}
                                        onClick={() => { setSelectedIssue(issue); setReplyText(issue.reply || ""); }}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                                            selectedIssue?.id === issue.id
                                                ? "border-emerald-700 shadow-md ring-1 ring-emerald-700"
                                                : "border-zinc-200/80 hover:border-zinc-300"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                issue.status === 'OPEN' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                                            }`}>
                                                {issue.status}
                                            </span>
                                            <span className="text-[11px] text-zinc-400 font-mono">
                                                {issue.created_at ? new Date(issue.created_at).toLocaleString() : ""}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-zinc-900 mb-1">{issue.subject}</h4>
                                        <p className="text-xs text-zinc-600 line-clamp-2">{issue.description}</p>
                                        <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                                            <span>From: {issue.user_name} ({issue.user_email})</span>
                                            <span>Res ID: #{issue.reservation_id || "N/A"}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Issue Response Box */}
                        <div className="lg:col-span-6">
                            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm">
                                {selectedIssue ? (
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-zinc-400 uppercase">Case #{selectedIssue.id}</span>
                                                <span className="text-xs font-bold text-zinc-800">· {selectedIssue.subject}</span>
                                            </div>
                                            <p className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-100 leading-relaxed">
                                                {selectedIssue.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-zinc-700">Official Support Resolution</label>
                                            <textarea
                                                rows={4}
                                                disabled={selectedIssue.status === "RESOLVED"}
                                                placeholder={selectedIssue.status === "RESOLVED" ? "This case is closed." : "Type formal response to customer..."}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 outline-none focus:bg-white focus:border-emerald-700 disabled:opacity-50"
                                            />
                                        </div>

                                        {selectedIssue.status === "OPEN" && (
                                            <button
                                                onClick={() => handleReplyIssue(selectedIssue.id)}
                                                disabled={replyMutation.isPending}
                                                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                                            >
                                                <Send size={14} /> {replyMutation.isPending ? "Sending..." : "Send Resolution & Mark Resolved"}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-64 flex flex-col items-center justify-center text-zinc-400 gap-2">
                                        <MessageSquare size={32} />
                                        <span className="text-xs">Select a user complaint from the left to inspect and reply.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================== */}
                {/* TAB 3: GATEWAY & PAYMENT METHOD CONTROLS   */}
                {/* ========================================== */}
                {activeTab === "methods" && (
                    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-base font-bold text-zinc-900">Payment Gateway Authorization</h3>
                            <p className="text-xs text-zinc-500">Toggle whether a payment gateway or offline payment is ALLOWED or NOT_ALLOWED system-wide.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {methods.map((method) => {
                                const isAllowed = method.status === "ALLOWED";
                                return (
                                    <div
                                        key={method.id}
                                        className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/70 bg-zinc-50/40"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isAllowed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                <CreditCard size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-zinc-900">{method.name}</span>
                                                <span className="text-[10px] font-mono text-zinc-400">Status: {method.status}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleToggleMethod(method.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                isAllowed
                                                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                        >
                                            {isAllowed ? "Active (ALLOWED)" : "Disabled (NOT_ALLOWED)"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ========================================== */}
                {/* TAB 4: CANCELLATION ANALYTICS (SP RUNNER)   */}
                {/* ========================================== */}
                {activeTab === "analytics" && (
                    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm flex flex-col gap-6">
                        <div>
                            <h3 className="text-base font-bold text-zinc-900">Stored Procedure: User Cancellation Audit</h3>
                            <p className="text-xs text-zinc-500">Query users who have at least one recorded reservation cancellation using Support Credentials.</p>
                        </div>

                        <form onSubmit={handleRunStoredProcedure} className="flex gap-3 max-w-md">
                            <input
                                type="text"
                                value={supportIdentifier}
                                onChange={(e) => setSupportIdentifier(e.target.value)}
                                placeholder="Support Email / Phone"
                                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:bg-white focus:border-emerald-700"
                            />
                            <button
                                type="submit"
                                className="bg-zinc-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                            >
                                <RefreshCw size={13} /> Execute Procedure
                            </button>
                        </form>

                        {procExecuted && (
                            <div className="overflow-x-auto border border-zinc-100 rounded-xl">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-zinc-50 text-zinc-400 uppercase font-semibold">
                                    <tr>
                                        <th className="py-2.5 px-4">User ID</th>
                                        <th className="py-2.5 px-4">Name</th>
                                        <th className="py-2.5 px-4">Contact</th>
                                        <th className="py-2.5 px-4">Cancellations Count</th>
                                        <th className="py-2.5 px-4">Primary Reason</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 text-zinc-700">
                                    {procResults.map((r, i) => (
                                        <tr key={i} className="hover:bg-zinc-50/50">
                                            <td className="py-3 px-4 font-mono font-bold">#{r.userId}</td>
                                            <td className="py-3 px-4 font-semibold text-zinc-900">{r.name}</td>
                                            <td className="py-3 px-4 font-mono text-zinc-500">{r.email} · {r.phone}</td>
                                            <td className="py-3 px-4 font-bold text-red-600">{r.cancellationsCount}</td>
                                            <td className="py-3 px-4 text-zinc-600">{r.reason}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}