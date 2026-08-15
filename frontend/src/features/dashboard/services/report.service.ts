import apiClient from "@/services/client";

export const reportService = {
    submitReport: async (data: { subject: string, description: string, paymentId?: number | null }) => {
        const response = await apiClient.post("/reports", data);
        return response.data;
    },
    getUserReports: async () => {
        const response = await apiClient.get("/reports");
        return response.data;
    }
};