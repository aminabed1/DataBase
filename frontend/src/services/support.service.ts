import apiClient from "./client";

export const supportService = {
    getAllIssues: async () => {
        const response = await apiClient.get("/support/issues");
        return response.data;
    },
    replyToIssue: async (id: number, reply: string) => {
        const response = await apiClient.post(`/support/issues/${id}/reply`, { reply });
        return response.data;
    }
};