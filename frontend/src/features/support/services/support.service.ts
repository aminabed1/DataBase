import axios from "axios";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const supportService = {
    // 1. Reservations
    getAllReservations: async () => {
        const res = await axios.get(`${API_ROOT}/reservations/all`, getAuthHeaders());
        return res.data.data;
    },
    updateReservationStatus: async (id: number, status: "CONFIRMED" | "CANCELLED") => {
        const res = await axios.patch(`${API_ROOT}/reservations/${id}/status?status=${status}`, {}, getAuthHeaders());
        return res.data;
    },

    // 2. Issue Reports
    getAllReports: async () => {
        const res = await axios.get(`${API_ROOT}/reports/all`, getAuthHeaders());
        return res.data.data;
    },
    resolveReport: async (id: number, reply: string) => {
        const res = await axios.put(`${API_ROOT}/reports/${id}/resolve`, { reply }, getAuthHeaders());
        return res.data;
    },

    // 3. Payment Methods
    getAllPaymentMethods: async () => {
        const res = await axios.get(`${API_ROOT}/payments/methods/all`, getAuthHeaders());
        return res.data.data;
    },
    togglePaymentMethod: async (id: number) => {
        const res = await axios.patch(`${API_ROOT}/payments/methods/${id}/toggle`, {}, getAuthHeaders());
        return res.data;
    },

    // 4. Cancellation Audit Procedure
    runCancellationProcedure: async (identifier: string) => {
        const res = await axios.get(`${API_ROOT}/cancellations/audit?identifier=${encodeURIComponent(identifier)}`, getAuthHeaders());
        return res.data.data;
    }
};