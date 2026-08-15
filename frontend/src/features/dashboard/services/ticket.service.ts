import apiClient from "@/services/client";

export const ticketService = {
    getMyTickets: async () => {
        const response = await apiClient.get("/tickets/me");
        return response.data;
    }
};